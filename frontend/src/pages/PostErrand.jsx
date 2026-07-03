import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { DraggableMap } from '../components/ErrandMap';
import api from '../utils/axios';

const categories = ['Grocery Run', 'Parcel Drop', 'Pet Care', 'Home Help', 'Tech Help', 'Other'];
const neighbourhoods = ['Kuniyamuthur', 'Sugunapuram', 'Vadavalli', 'Kovaipudur', 'R.S. Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Ganapathy'];

export default function PostErrand() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', reward: '', urgency: 'Medium',
    location_name: '', latitude: 10.9379, longitude: 76.9592, deadline: ''
  });

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleDrag(lat, lng) {
    setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
  }

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/errands', {
        ...form,
        reward: Number(form.reward) || 0,
        reward_type: Number(form.reward) > 0 ? '₹' : 'Favour',
      });
      addToast('Errand posted successfully!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to post errand', 'error');
    } finally {
      setLoading(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post an Errand</h1>
        <p className="text-gray-500 mb-8">Tell your neighbours what you need done</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="e.g. Pick up groceries from D-Mart" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} required rows={4} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none" placeholder="Describe what needs to be done in detail..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={form.urgency} onChange={e => update('urgency', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward (₹)</label>
              <input type="number" value={form.reward} onChange={e => update('reward', e.target.value)} min={0} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="0 for favour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
              <input type="datetime-local" value={form.deadline} onChange={e => update('deadline', e.target.value)} required min={minDate} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Neighbourhood *</label>
              <select value={form.location_name} onChange={e => update('location_name', e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select area</option>
                {neighbourhoods.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <div className="flex gap-2">
                <input type="number" step="any" value={form.latitude} onChange={e => update('latitude', parseFloat(e.target.value) || 0)} required className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Lat" />
                <input type="number" step="any" value={form.longitude} onChange={e => update('longitude', parseFloat(e.target.value) || 0)} required className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Lng" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin the location (drag the marker)</label>
            <DraggableMap position={[form.latitude, form.longitude]} onDrag={handleDrag} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Errand'}
          </button>
        </form>
      </div>
    </div>
  );
}
