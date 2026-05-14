import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

export function register(req, res) {
  const { name, email, password, neighbourhood } = req.body;
  if (!name || !email || !password || !neighbourhood) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hashed = bcryptjs.hashSync(password, 10);
  const initial = name.charAt(0).toUpperCase();
  const result = db.prepare(
    'INSERT INTO users (name, email, password, neighbourhood, avatar_initial) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hashed, neighbourhood, initial);

  const token = jwt.sign({ id: result.lastInsertRowid, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, name, email, neighbourhood, avatar_initial: initial, phone: '' }
  });
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcryptjs.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, neighbourhood: user.neighbourhood, phone: user.phone, avatar_initial: user.avatar_initial }
  });
}

export function getMe(req, res) {
  const user = db.prepare('SELECT id, name, email, neighbourhood, phone, avatar_initial, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}
