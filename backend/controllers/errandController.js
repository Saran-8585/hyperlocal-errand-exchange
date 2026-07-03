import Errand from '../models/Errand.js';
import Review from '../models/Review.js';

export async function getAll(req, res) {
  const { category, urgency, neighbourhood, search, minReward, maxReward } = req.query;
  const filter = { status: 'Open' };

  if (category) filter.category = category;
  if (urgency) filter.urgency = urgency;
  if (neighbourhood) filter.location_name = neighbourhood;
  if (minReward || maxReward) {
    filter.reward = {};
    if (minReward) filter.reward.$gte = Number(minReward);
    if (maxReward) filter.reward.$lte = Number(maxReward);
  }
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const errands = await Errand.find(filter)
    .populate('posted_by', 'name neighbourhood avatar_initial')
    .sort({ created_at: -1 })
    .lean();

  const enriched = await Promise.all(errands.map(async (e) => {
    const rating = e.claimed_by
      ? await getAvgRating(e.claimed_by)
      : null;
    return {
      ...e,
      id: e._id,
      poster_name: e.posted_by?.name,
      poster_neighbourhood: e.posted_by?.neighbourhood,
      poster_avatar: e.posted_by?.avatar_initial,
      runner_rating: rating,
    };
  }));

  res.json(enriched);
}

export async function getOne(req, res) {
  const errand = await Errand.findById(req.params.id)
    .populate('posted_by', 'name neighbourhood avatar_initial phone')
    .populate('claimed_by', 'name avatar_initial')
    .lean();

  if (!errand) return res.status(404).json({ error: 'Errand not found' });

  const rating = errand.claimed_by ? await getAvgRating(errand.claimed_by._id) : null;

  res.json({
    ...errand,
    id: errand._id,
    poster_name: errand.posted_by?.name,
    poster_neighbourhood: errand.posted_by?.neighbourhood,
    poster_avatar: errand.posted_by?.avatar_initial,
    poster_phone: errand.posted_by?.phone,
    claimed_name: errand.claimed_by?.name,
    claimed_avatar: errand.claimed_by?.avatar_initial,
    runner_rating: rating,
  });
}

export async function create(req, res) {
  const { title, description, category, reward, reward_type, urgency, location_name, latitude, longitude, deadline } = req.body;
  if (!title || !description || !category || !location_name || !latitude || !longitude || !deadline) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const errand = await Errand.create({
    title, description, category,
    reward: reward || 0,
    reward_type: reward_type || '₹',
    urgency: urgency || 'Medium',
    location_name, latitude, longitude, deadline,
    posted_by: req.user.id,
  });
  res.status(201).json(errand);
}

export async function claim(req, res) {
  const errand = await Errand.findById(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (errand.status !== 'Open') return res.status(400).json({ error: 'Errand is not available' });
  if (errand.posted_by.toString() === req.user.id) return res.status(403).json({ error: 'You cannot claim your own errand' });

  const updated = await Errand.findOneAndUpdate(
    { _id: req.params.id, status: 'Open' },
    { status: 'Claimed', claimed_by: req.user.id },
    { new: true }
  );
  if (!updated) return res.status(409).json({ error: 'Errand was already claimed' });
  res.json(updated);
}

export async function complete(req, res) {
  const errand = await Errand.findById(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (!errand.claimed_by || errand.claimed_by.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Only the claimed runner can mark as complete' });
  }
  if (errand.status !== 'Claimed') return res.status(400).json({ error: 'Errand must be claimed first' });

  const updated = await Errand.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed' },
    { new: true }
  );
  res.json(updated);
}

export async function cancel(req, res) {
  const errand = await Errand.findById(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (errand.posted_by.toString() !== req.user.id) return res.status(403).json({ error: 'Only the poster can cancel' });
  if (errand.status !== 'Open') return res.status(400).json({ error: 'Can only cancel open errands' });

  const updated = await Errand.findByIdAndUpdate(
    req.params.id,
    { status: 'Cancelled' },
    { new: true }
  );
  res.json(updated);
}

async function getAvgRating(userId) {
  const result = await Review.aggregate([
    { $match: { reviewee_id: userId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  return result.length > 0 ? Math.round(result[0].avg * 10) / 10 : null;
}
