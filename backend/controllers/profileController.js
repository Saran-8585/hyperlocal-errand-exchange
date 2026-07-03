import User from '../models/User.js';
import Errand from '../models/Errand.js';
import Review from '../models/Review.js';

export async function getProfile(req, res) {
  const user = await User.findById(req.params.id).select('id name email neighbourhood phone avatar_initial created_at');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const postedCount = await Errand.countDocuments({ posted_by: user._id });
  const completedCount = await Errand.countDocuments({ claimed_by: user._id, status: 'Completed' });
  const ratingResult = await Review.aggregate([
    { $match: { reviewee_id: user._id } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  const rating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

  res.json({ ...user.toObject(), postedCount, completedCount, rating });
}

export async function updateProfile(req, res) {
  const { name, neighbourhood, phone } = req.body;
  const updateData = {};
  if (name !== undefined) { updateData.name = name; updateData.avatar_initial = name.charAt(0).toUpperCase(); }
  if (neighbourhood !== undefined) updateData.neighbourhood = neighbourhood;
  if (phone !== undefined) updateData.phone = phone;

  const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
    .select('id name email neighbourhood phone avatar_initial created_at');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}
