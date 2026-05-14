import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { TableSkeleton } from '../components/Skeleton';
import api from '../utils/axios';
import { IndianRupee, FileText, CheckCircle2, ClipboardList, Eye, XCircle } from 'lucide-react';

const statusColors = { Open: 'bg-blue-100 text-blue-700', Claimed: 'bg-amber-100 text-amber-700', Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-slate-100 text-slate-700' };

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('posted');
  const [posted, setPosted] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    async function fetchAll() {
      try {
        const [postedRes, claimedRes, statsRes] = await Promise.all([
          api.get('/dashboard/posted'),
          api.get('/dashboard/claimed'),
          api.get('/dashboard/stats'),
        ]);
        setPosted(postedRes.data);
        setClaimed(claimedRes.data);
        setStats(statsRes.data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchAll();
  }, [user, navigate]);

  async function handleCancel() {
    if (!cancelTarget) return;
    try {
      await api.put(`/errands/${cancelTarget}/cancel`);
      addToast('Errand cancelled', 'success');
      setPosted(prev => prev.map(e => e.id === cancelTarget ? { ...e, status: 'Cancelled' } : e));
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to cancel', 'error');
    } finally { setCancelTarget(null); }
  }

  async function handleComplete() {
    if (!completeTarget) return;
    try {
      await api.put(`/errands/${completeTarget}/complete`);
      addToast('Errand marked completed!', 'success');
      setClaimed(prev => prev.map(e => e.id === completeTarget ? { ...e, status: 'Completed' } : e));
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to complete', 'error');
    } finally { setCompleteTarget(null); }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><TableSkeleton /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Posted', value: stats.posted, icon: FileText, color: 'bg-blue-50 text-blue-600' },
            { label: 'Claimed', value: stats.claimed, icon: ClipboardList, color: 'bg-amber-50 text-amber-600' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
            { label: 'Earnings', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'bg-primary/10 text-primary' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {['posted', 'claimed'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition capitalize ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'posted' ? 'My Posted Errands' : 'My Claimed Errands'}
          </button>
        ))}
      </div>

      {tab === 'posted' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {posted.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">You haven't posted any errands yet</p>
              <Link to="/post" className="text-primary font-medium text-sm hover:underline mt-2 inline-block">Post your first errand</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Title</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Reward</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Deadline</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Claimed By</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posted.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{e.title}</td>
                      <td className="px-4 py-3 text-gray-500">{e.category}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[e.status]}`}>{e.status}</span></td>
                      <td className="px-4 py-3 font-medium">{e.reward > 0 ? `₹${e.reward}` : e.reward_type}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{new Date(e.deadline).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{e.claimed_name || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/errand/${e.id}`} className="p-1.5 text-gray-400 hover:text-primary rounded transition"><Eye size={16} /></Link>
                          {e.status === 'Open' && (
                            <button onClick={() => setCancelTarget(e.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition"><XCircle size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'claimed' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {claimed.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">You haven't claimed any errands yet</p>
              <Link to="/" className="text-primary font-medium text-sm hover:underline mt-2 inline-block">Browse errands</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Title</th>
                    <th className="text-left px-4 py-3 font-medium">Posted By</th>
                    <th className="text-left px-4 py-3 font-medium">Reward</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Deadline</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claimed.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{e.title}</td>
                      <td className="px-4 py-3 text-gray-500">{e.poster_name}</td>
                      <td className="px-4 py-3 font-medium">{e.reward > 0 ? `₹${e.reward}` : e.reward_type}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[e.status]}`}>{e.status}</span></td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{new Date(e.deadline).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/errand/${e.id}`} className="p-1.5 text-gray-400 hover:text-primary rounded transition"><Eye size={16} /></Link>
                          {e.status === 'Claimed' && (
                            <button onClick={() => setCompleteTarget(e.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">Complete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog open={!!cancelTarget} title="Cancel Errand?" message="This cannot be undone." onConfirm={handleCancel} onCancel={() => setCancelTarget(null)} />
      <ConfirmDialog open={!!completeTarget} title="Mark as Completed?" message="Confirm this errand has been completed." onConfirm={handleComplete} onCancel={() => setCompleteTarget(null)} />
    </div>
  );
}
