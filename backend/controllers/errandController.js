import db from '../db/database.js';

export function getAll(req, res) {
  const { category, urgency, neighbourhood, search, minReward, maxReward } = req.query;
  let sql = `
    SELECT e.*, u.name AS poster_name, u.neighbourhood AS poster_neighbourhood, u.avatar_initial AS poster_avatar,
      (SELECT AVG(rating) FROM reviews WHERE reviewee_id = e.claimed_by) AS runner_rating
    FROM errands e
    JOIN users u ON e.posted_by = u.id
    WHERE e.status = 'Open'
  `;
  const params = [];

  if (category) { sql += ' AND e.category = ?'; params.push(category); }
  if (urgency) { sql += ' AND e.urgency = ?'; params.push(urgency); }
  if (neighbourhood) { sql += ' AND e.location_name = ?'; params.push(neighbourhood); }
  if (search) { sql += ' AND (e.title LIKE ? OR e.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (minReward) { sql += ' AND e.reward >= ?'; params.push(Number(minReward)); }
  if (maxReward) { sql += ' AND e.reward <= ?'; params.push(Number(maxReward)); }

  sql += ' ORDER BY e.created_at DESC';
  const errands = db.prepare(sql).all(...params);
  res.json(errands);
}

export function getOne(req, res) {
  const errand = db.prepare(`
    SELECT e.*, u.name AS poster_name, u.neighbourhood AS poster_neighbourhood, u.avatar_initial AS poster_avatar, u.phone AS poster_phone,
      c.name AS claimed_name, c.avatar_initial AS claimed_avatar,
      (SELECT AVG(rating) FROM reviews WHERE reviewee_id = e.claimed_by) AS runner_rating
    FROM errands e
    JOIN users u ON e.posted_by = u.id
    LEFT JOIN users c ON e.claimed_by = c.id
    WHERE e.id = ?
  `).get(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  res.json(errand);
}

export function create(req, res) {
  const { title, description, category, reward, reward_type, urgency, location_name, latitude, longitude, deadline } = req.body;
  if (!title || !description || !category || !location_name || !latitude || !longitude || !deadline) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const result = db.prepare(`
    INSERT INTO errands (title, description, category, reward, reward_type, urgency, location_name, latitude, longitude, deadline, posted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, category, reward || 0, reward_type || '₹', urgency || 'Medium', location_name, latitude, longitude, deadline, req.user.id);
  const errand = db.prepare('SELECT * FROM errands WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(errand);
}

export function claim(req, res) {
  const errand = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (errand.status !== 'Open') return res.status(400).json({ error: 'Errand is not available' });
  if (errand.posted_by === req.user.id) return res.status(403).json({ error: 'You cannot claim your own errand' });

  try {
    const result = db.prepare(
      "UPDATE errands SET status = 'Claimed', claimed_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'Open'"
    ).run(req.user.id, req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Errand was already claimed' });
    const updated = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to claim errand' });
  }
}

export function complete(req, res) {
  const errand = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (errand.claimed_by !== req.user.id) return res.status(403).json({ error: 'Only the claimed runner can mark as complete' });
  if (errand.status !== 'Claimed') return res.status(400).json({ error: 'Errand must be claimed first' });

  db.prepare("UPDATE errands SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);
  const updated = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function cancel(req, res) {
  const errand = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
  if (!errand) return res.status(404).json({ error: 'Errand not found' });
  if (errand.posted_by !== req.user.id) return res.status(403).json({ error: 'Only the poster can cancel' });
  if (errand.status !== 'Open') return res.status(400).json({ error: 'Can only cancel open errands' });

  db.prepare("UPDATE errands SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);
  const updated = db.prepare('SELECT * FROM errands WHERE id = ?').get(req.params.id);
  res.json(updated);
}
