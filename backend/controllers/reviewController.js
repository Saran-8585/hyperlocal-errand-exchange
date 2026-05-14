import db from '../db/database.js';

export function createReview(req, res) {
  const { errand_id, reviewee_id, rating, comment } = req.body;
  if (!errand_id || !reviewee_id || !rating) {
    return res.status(400).json({ error: 'errand_id, reviewee_id, and rating are required' });
  }
  if (req.user.id === reviewee_id) {
    return res.status(403).json({ error: 'You cannot review yourself' });
  }
  const errand = db.prepare('SELECT * FROM errands WHERE id = ?').get(errand_id);
  if (!errand || errand.status !== 'Completed') {
    return res.status(400).json({ error: 'Errand must be completed to review' });
  }
  if (errand.posted_by !== req.user.id) {
    return res.status(403).json({ error: 'Only the poster can leave a review' });
  }
  if (errand.claimed_by !== reviewee_id) {
    return res.status(400).json({ error: 'Reviewee did not claim this errand' });
  }
  const existing = db.prepare('SELECT id FROM reviews WHERE errand_id = ? AND reviewer_id = ?').get(errand_id, req.user.id);
  if (existing) {
    return res.status(409).json({ error: 'You already reviewed this errand' });
  }
  const result = db.prepare(
    'INSERT INTO reviews (errand_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
  ).run(errand_id, req.user.id, reviewee_id, Math.min(5, Math.max(1, rating)), comment || '');
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
}

export function getReviews(req, res) {
  const reviews = db.prepare(`
    SELECT r.*, u.name AS reviewer_name, u.avatar_initial AS reviewer_avatar
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.userId);
  res.json(reviews);
}
