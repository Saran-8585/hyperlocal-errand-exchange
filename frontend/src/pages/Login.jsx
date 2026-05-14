import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../utils/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      addToast('Logged in successfully!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">HE</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Test credentials</p>
            <div className="space-y-2">
              {[
                { email: 'alice@local.com', label: 'Alice Sharma' },
                { email: 'bob@local.com', label: 'Bob Patel' },
              ].map(cred => (
                <button key={cred.email} onClick={() => { setEmail(cred.email); setPassword('password123'); }} className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition flex items-center justify-between">
                  <span>{cred.label}</span>
                  <span className="text-gray-400 font-mono text-xs">{cred.email}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Password: <span className="font-mono">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
