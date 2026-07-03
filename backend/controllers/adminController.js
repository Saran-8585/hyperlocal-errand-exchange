import User from '../models/User.js';
import Errand from '../models/Errand.js';
import Review from '../models/Review.js';

export async function getDashboardStats(req, res) {
  const totalUsers = await User.countDocuments();
  const totalErrands = await Errand.countDocuments();
  const totalReviews = await Review.countDocuments();

  const errandsByStatus = await Errand.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const usersByNeighbourhood = await User.aggregate([
    { $match: { role: 'user' } },
    { $group: { _id: '$neighbourhood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const avgRatingResult = await Review.aggregate([
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  const avgRating = avgRatingResult.length > 0 ? Math.round(avgRatingResult[0].avg * 10) / 10 : 0;

  const recentErrands = await Errand.find()
    .sort({ created_at: -1 })
    .limit(5)
    .populate('posted_by', 'name avatar_initial')
    .lean();

  const recent = recentErrands.map(e => ({
    id: e._id,
    title: e.title,
    status: e.status,
    poster_name: e.posted_by?.name,
    created_at: e.created_at,
  }));

  const statusMap = {};
  errandsByStatus.forEach(s => { statusMap[s._id] = s.count; });

  const errandsByNeighbourhood = await Errand.aggregate([
    { $group: { _id: '$location_name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    totalUsers,
    totalErrands,
    totalReviews,
    errandsByStatus: statusMap,
    usersByNeighbourhood,
    errandsByNeighbourhood,
    avgRating,
    recentActivity: recent,
  });
}

export async function getUsers(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { search, neighbourhood, role, status } = req.query;

  const filter = {};
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (neighbourhood) filter.neighbourhood = neighbourhood;
  if (role) filter.role = role;
  if (status) filter.status = status;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('id name email neighbourhood phone avatar_initial role status created_at')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const enriched = await Promise.all(users.map(async (u) => {
    const errandCount = await Errand.countDocuments({ posted_by: u._id });
    return { ...u, id: u._id, errandCount };
  }));

  res.json({
    users: enriched,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function updateUserRole(req, res) {
  const { role } = req.body;
  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "user" or "admin"' });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('id name email role status neighbourhood');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export async function toggleUserStatus(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin' && user.status === 'active') {
    return res.status(400).json({ error: 'Cannot suspend another admin' });
  }
  user.status = user.status === 'active' ? 'suspended' : 'active';
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, status: user.status });
}

export async function getAllErrands(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { status, category, neighbourhood, search, urgency } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (neighbourhood) filter.location_name = neighbourhood;
  if (urgency) filter.urgency = urgency;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const [errands, total] = await Promise.all([
    Errand.find(filter)
      .populate('posted_by', 'name email')
      .populate('claimed_by', 'name email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Errand.countDocuments(filter),
  ]);

  const mapped = errands.map(e => ({
    ...e,
    id: e._id,
    poster_name: e.posted_by?.name,
    poster_email: e.posted_by?.email,
    claimed_name: e.claimed_by?.name,
  }));

  res.json({ errands: mapped, total, page, pages: Math.ceil(total / limit) });
}

export async function deleteErrand(req, res) {
  const errand = await Errand.findByIdAndDelete(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  await Review.deleteMany({ errand_id: req.params.id });
  res.json({ message: 'Errand and associated reviews deleted' });
}

export async function getAllReviews(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { rating, search } = req.query;

  const filter = {};
  if (rating) filter.rating = parseInt(rating);
  if (search) {
    filter.comment = new RegExp(search, 'i');
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('reviewer_id', 'name email avatar_initial')
      .populate('reviewee_id', 'name email')
      .populate('errand_id', 'title')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  const mapped = reviews.map(r => ({
    ...r,
    id: r._id,
    reviewer_name: r.reviewer_id?.name,
    reviewer_email: r.reviewer_id?.email,
    reviewer_avatar: r.reviewer_id?.avatar_initial,
    reviewee_name: r.reviewee_id?.name,
    errand_title: r.errand_id?.title,
  }));

  res.json({ reviews: mapped, total, page, pages: Math.ceil(total / limit) });
}

export async function deleteReview(req, res) {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json({ message: 'Review deleted' });
}
