import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  const { name, email, password, neighbourhood } = req.body;
  if (!name || !email || !password || !neighbourhood) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hashed = bcryptjs.hashSync(password, 10);
  const initial = name.charAt(0).toUpperCase();
  const user = await User.create({ name, email, password: hashed, neighbourhood, avatar_initial: initial });
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: { id: user._id, name, email, neighbourhood, avatar_initial: initial, phone: '', role: user.role }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !bcryptjs.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended. Contact admin.' });
  }
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, neighbourhood: user.neighbourhood, phone: user.phone, avatar_initial: user.avatar_initial, role: user.role }
  });
}

export async function getMe(req, res) {
  const user = await User.findById(req.user.id).select('id name email neighbourhood phone avatar_initial role status created_at');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}
