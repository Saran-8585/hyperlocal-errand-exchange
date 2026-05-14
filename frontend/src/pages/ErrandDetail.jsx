import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { SingleErrandMap } from '../components/ErrandMap';
import { StarRatingDisplay } from '../components/StarRating';
import ConfirmDialog from '../components/ConfirmDialog';
import { CardSkeleton } from '../components/Skeleton';
import api from '../utils/axios';
import { MapPin, Clock, IndianRupee, User, Calendar, ChevronLeft } from 'lucide-react';

const urgencyColors = { High: 'bg-red-100 text-red-700', Medium: 'bg-orange-100 text-orange-700', Low: 'bg-green-100 text-green-700' };
const statusColors = { Open: 'bg-blue-100 text-blue-700', Claimed: 'bg-amber-100 text-amber-700', Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-slate-100 text-slate-700' };

export default function ErrandDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [errand, setErrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const fetchErrand = useCallback(async () => {
    try {
      const res = await api.get(`/errands/${id}`);
      setErrand(res.data);
    } catch {
      addToast('Errand not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchErrand(); }, [fetchErrand]);

  useEffect(() => {
    if (!errand) return;
    function update() {
      const now = new Date();
      const deadline = new Date(errand.deadline);
      const diff = deadline - now;
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m left` : `${h}h ${m}m left`);
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [errand]);

  async function handleClaim() {
    setActionLoading(true);
    try {
      await api.put(`/errands/${id}/claim`);
      addToast('Errand claimed successfully!', 'success');
      fetchErrand();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to claim', 'error');
    } finally { setActionLoading(false); }
  }

  async function handleComplete() {
    setActionLoading(true);
    try {
      await api.put(`/errands/${id}/complete`);
      addToast('Errand marked as completed!', 'success');
      fetchErrand();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to complete', 'error');
    } finally { setActionLoading(false); }
  }

  async function handleCancel() {
    setConfirmCancel(false);
    setActionLoading(true);
    try {
      await api.put(`/errands/${id}/cancel`);
      addToast('Errand cancelled', 'success');
      fetchErrand();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to cancel', 'error');
    } finally { setActionLoading(false); }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><CardSkeleton /></div>;
  if (!errand) return null;

  const isPoster = user && user.id === errand.posted_by;
  const isClaimer = user && user.id === errand.claimed_by;
  const expired = new Date(errand.deadline) < new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4 transition">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyColors[errand.urgency]}`}>{errand.urgency}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[errand.status]}`}>{errand.status}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{errand.category}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{errand.title}</h1>
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{errand.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2.5 text-sm">
              <IndianRupee size={18} className="text-gray-400" />
              <div>
                <span className="text-gray-500">Reward</span>
                <p className="font-semibold text-primary">{errand.reward > 0 ? `₹${errand.reward}` : errand.reward_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock size={18} className="text-gray-400" />
              <div>
                <span className="text-gray-500">Deadline</span>
                <p className={`font-semibold ${expired ? 'text-red-500' : 'text-gray-900'}`}>{timeLeft}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin size={18} className="text-gray-400" />
              <div>
                <span className="text-gray-500">Location</span>
                <p className="font-semibold text-gray-900">{errand.location_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <span className="text-gray-500">Posted</span>
                <p className="font-semibold text-gray-900">{new Date(errand.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
              {errand.poster_avatar}
            </div>
            <div>
              <p className="font-medium text-gray-900">{errand.poster_name}</p>
              <p className="text-sm text-gray-500">{errand.poster_neighbourhood}</p>
            </div>
          </div>

          {errand.claimed_name && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl mb-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-semibold">
                {errand.claimed_avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">Claimed by {errand.claimed_name}</p>
                {errand.runner_rating > 0 && <StarRatingDisplay rating={errand.runner_rating} />}
              </div>
            </div>
          )}

          <div className="mb-6">
            <SingleErrandMap latitude={errand.latitude} longitude={errand.longitude} />
          </div>

          {user && errand.status === 'Open' && !isPoster && (
            <button onClick={handleClaim} disabled={actionLoading || expired} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50">
              {actionLoading ? 'Claiming...' : 'Claim this Errand'}
            </button>
          )}
          {user && isPoster && errand.status === 'Open' && (
            <button onClick={() => setConfirmCancel(true)} disabled={actionLoading} className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50">
              Cancel Errand
            </button>
          )}
          {user && isClaimer && errand.status === 'Claimed' && (
            <button onClick={handleComplete} disabled={actionLoading} className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50">
              {actionLoading ? 'Processing...' : 'Mark as Completed'}
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel Errand?"
        message="Are you sure you want to cancel this errand? This action cannot be undone."
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}
