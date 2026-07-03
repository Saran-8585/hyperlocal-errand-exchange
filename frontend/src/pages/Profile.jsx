import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { StarRatingDisplay, StarRatingInput } from '../components/StarRating';
import { CardSkeleton } from '../components/Skeleton';
import api from '../utils/axios';
import { Edit3, Save, X, Mail, MapPin, Phone, FileText, CheckCircle2, Star, MessageSquare } from 'lucide-react';

const neighbourhoods = ['Kuniyamuthur', 'Sugunapuram', 'Vadavalli', 'Kovaipudur', 'R.S. Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Ganapathy'];

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', neighbourhood: '', phone: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ errand_id: '', rating: 5, comment: '' });
  const [reviewing, setReviewing] = useState(false);

  const isOwnProfile = user && String(user.id) === String(id);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          api.get(`/profile/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
        setForm({ name: profileRes.data.name, neighbourhood: profileRes.data.neighbourhood, phone: profileRes.data.phone || '' });
      } catch {
        addToast('Profile not found', 'error');
        navigate('/');
      } finally { setLoading(false); }
    }
    fetchProfile();
  }, [id]);

  async function handleSave() {
    try {
      const res = await api.put('/profile', form);
      setProfile(prev => ({ ...prev, ...res.data }));
      addToast('Profile updated!', 'success');
      setEditing(false);
    } catch (err) {
      addToast(err.response?.data?.error || 'Update failed', 'error');
    }
  }

  async function handleReview(e) {
    e.preventDefault();
    setReviewing(true);
    try {
      await api.post('/reviews', {
        errand_id: reviewData.errand_id,
        reviewee_id: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      addToast('Review submitted!', 'success');
      setShowReviewForm(false);
      setReviewData({ errand_id: '', rating: 5, comment: '' });
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      addToast(err.response?.data?.error || 'Review failed', 'error');
    } finally { setReviewing(false); }
  }

  const [completedErrands, setCompletedErrands] = useState([]);
  useEffect(() => {
    if (isOwnProfile && showReviewForm) {
      api.get('/dashboard/posted').then(res => {
        setCompletedErrands(res.data.filter(e => e.status === 'Completed' && e.claimed_by));
      }).catch(() => {});
    }
  }, [isOwnProfile, showReviewForm]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><CardSkeleton /></div>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl shrink-0">
            {profile.avatar_initial}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold" />
                <select value={form.neighbourhood} onChange={e => setForm(prev => ({ ...prev, neighbourhood: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  {neighbourhoods.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <input type="tel" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail size={14} /> {profile.email}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {profile.neighbourhood}</span>
                  {profile.phone && <span className="flex items-center gap-1"><Phone size={14} /> {profile.phone}</span>}
                </div>
              </>
            )}
          </div>
          {isOwnProfile && (
            <button onClick={() => editing ? handleSave() : setEditing(true)} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition ${editing ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary border border-gray-200'}`}>
              {editing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
            </button>
          )}
          {editing && (
            <button onClick={() => setEditing(false)} className="p-2 text-gray-400 hover:text-red-500 transition">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.postedCount}</p>
            <p className="text-xs text-gray-500">Errands Posted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <StarRatingDisplay rating={profile.rating} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-400" /> Reviews
          </h2>
          {isOwnProfile && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-sm text-primary font-medium hover:underline">
              {showReviewForm ? 'Cancel' : 'Leave a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleReview} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Completed Errand</label>
              <select value={reviewData.errand_id} onChange={e => setReviewData(prev => ({ ...prev, errand_id: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                <option value="">Choose...</option>
                {completedErrands.map(e => (
                  <option key={e.id} value={e.id}>{e.title} (claimed by ID: {e.claimed_by})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <StarRatingInput rating={reviewData.rating} onChange={r => setReviewData(prev => ({ ...prev, rating: r }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea value={reviewData.comment} onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" placeholder="Share your experience..." />
            </div>
            <button type="submit" disabled={reviewing} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50">
              {reviewing ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                  {r.reviewer_avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{r.reviewer_name}</span>
                    <StarRatingDisplay rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
