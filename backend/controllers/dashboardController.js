import Errand from '../models/Errand.js';

export async function getPosted(req, res) {
  const errands = await Errand.find({ posted_by: req.user.id })
    .populate('claimed_by', 'name avatar_initial')
    .sort({ created_at: -1 })
    .lean();

  const mapped = errands.map(e => ({
    ...e,
    id: e._id,
    claimed_name: e.claimed_by?.name,
    claimed_avatar: e.claimed_by?.avatar_initial,
  }));

  res.json(mapped);
}

export async function getClaimed(req, res) {
  const errands = await Errand.find({ claimed_by: req.user.id })
    .populate('posted_by', 'name neighbourhood avatar_initial')
    .sort({ created_at: -1 })
    .lean();

  const mapped = errands.map(e => ({
    ...e,
    id: e._id,
    poster_name: e.posted_by?.name,
    poster_neighbourhood: e.posted_by?.neighbourhood,
    poster_avatar: e.posted_by?.avatar_initial,
  }));

  res.json(mapped);
}

export async function getStats(req, res) {
  const userId = req.user.id;
  const posted = await Errand.countDocuments({ posted_by: userId });
  const claimed = await Errand.countDocuments({ claimed_by: userId });
  const completed = await Errand.countDocuments({ claimed_by: userId, status: 'Completed' });
  const earningsResult = await Errand.aggregate([
    { $match: { claimed_by: userId, status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$reward' } } },
  ]);
  const earnings = earningsResult.length > 0 ? earningsResult[0].total : 0;

  res.json({ posted, claimed, completed, earnings });
}
