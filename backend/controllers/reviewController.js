import Review from '../models/Review.js';
import Errand from '../models/Errand.js';

export async function createReview(req, res) {
  const { errand_id, reviewee_id, rating, comment } = req.body;
  if (!errand_id || !reviewee_id || !rating) {
    return res.status(400).json({ error: 'errand_id, reviewee_id, and rating are required' });
  }
  if (req.user.id === reviewee_id) {
    return res.status(403).json({ error: 'You cannot review yourself' });
  }
  const errand = await Errand.findById(errand_id);
  if (!errand || errand.status !== 'Completed') {
    return res.status(400).json({ error: 'Errand must be completed to review' });
  }
  if (errand.posted_by.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Only the poster can leave a review' });
  }
  if (errand.claimed_by?.toString() !== reviewee_id) {
    return res.status(400).json({ error: 'Reviewee did not claim this errand' });
  }
  const existing = await Review.findOne({ errand_id, reviewer_id: req.user.id });
  if (existing) {
    return res.status(409).json({ error: 'You already reviewed this errand' });
  }
  const review = await Review.create({
    errand_id,
    reviewer_id: req.user.id,
    reviewee_id,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment || '',
  });
  res.status(201).json({ id: review._id, ...req.body });
}

export async function getReviews(req, res) {
  const reviews = await Review.find({ reviewee_id: req.params.userId })
    .populate('reviewer_id', 'name avatar_initial')
    .sort({ created_at: -1 })
    .lean();

  const mapped = reviews.map(r => ({
    ...r,
    id: r._id,
    reviewer_name: r.reviewer_id?.name,
    reviewer_avatar: r.reviewer_id?.avatar_initial,
  }));

  res.json(mapped);
}
