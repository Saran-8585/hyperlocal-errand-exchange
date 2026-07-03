import User from '../models/User.js';

export async function adminAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const user = await User.findById(req.user.id).select('role status');
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.adminUser = user;
  next();
}
