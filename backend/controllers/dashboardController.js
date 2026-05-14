import db from '../db/database.js';

export function getPosted(req, res) {
  const errands = db.prepare(`
    SELECT e.*, u.name AS claimed_name, u.avatar_initial AS claimed_avatar
    FROM errands e
    LEFT JOIN users u ON e.claimed_by = u.id
    WHERE e.posted_by = ?
    ORDER BY e.created_at DESC
  `).all(req.user.id);
  res.json(errands);
}

export function getClaimed(req, res) {
  const errands = db.prepare(`
    SELECT e.*, u.name AS poster_name, u.neighbourhood AS poster_neighbourhood, u.avatar_initial AS poster_avatar
    FROM errands e
    JOIN users u ON e.posted_by = u.id
    WHERE e.claimed_by = ?
    ORDER BY e.created_at DESC
  `).all(req.user.id);
  res.json(errands);
}

export function getStats(req, res) {
  const posted = db.prepare('SELECT COUNT(*) AS count FROM errands WHERE posted_by = ?').get(req.user.id);
  const claimed = db.prepare('SELECT COUNT(*) AS count FROM errands WHERE claimed_by = ?').get(req.user.id);
  const completed = db.prepare("SELECT COUNT(*) AS count FROM errands WHERE claimed_by = ? AND status = 'Completed'").get(req.user.id);
  const earnings = db.prepare("SELECT COALESCE(SUM(reward), 0) AS total FROM errands WHERE claimed_by = ? AND status = 'Completed'").get(req.user.id);
  res.json({
    posted: posted.count,
    claimed: claimed.count,
    completed: completed.count,
    earnings: earnings.total
  });
}
