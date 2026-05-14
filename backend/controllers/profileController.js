import db from '../db/database.js';

export function getProfile(req, res) {
  const user = db.prepare('SELECT id, name, email, neighbourhood, phone, avatar_initial, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const posted = db.prepare('SELECT COUNT(*) AS count FROM errands WHERE posted_by = ?').get(user.id);
  const completed = db.prepare("SELECT COUNT(*) AS count FROM errands WHERE claimed_by = ? AND status = 'Completed'").get(user.id);
  const rating = db.prepare('SELECT AVG(rating) AS avg FROM reviews WHERE reviewee_id = ?').get(user.id);

  res.json({ ...user, postedCount: posted.count, completedCount: completed.count, rating: rating.avg || 0 });
}

export function updateProfile(req, res) {
  const { name, neighbourhood, phone } = req.body;
  db.prepare('UPDATE users SET name = COALESCE(?, name), neighbourhood = COALESCE(?, neighbourhood), phone = COALESCE(?, phone), avatar_initial = ? WHERE id = ?')
    .run(name || null, neighbourhood || null, phone || null, (name || '').charAt(0).toUpperCase() || null, req.user.id);
  const user = db.prepare('SELECT id, name, email, neighbourhood, phone, avatar_initial, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
}
