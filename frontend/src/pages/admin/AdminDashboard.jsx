import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import {
  Users, ClipboardList, MessageSquare, Star,
  FileText, CheckCircle2, Clock, XCircle
} from 'lucide-react';

const statusIcons = { Open: Clock, Claimed: FileText, Completed: CheckCircle2, Cancelled: XCircle };
const statusColors = { Open: 'text-blue-600 bg-blue-50', Claimed: 'text-amber-600 bg-amber-50', Completed: 'text-green-600 bg-green-50', Cancelled: 'text-slate-600 bg-slate-50' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  if (!data) return <div className="text-center py-12 text-red-500">Failed to load dashboard</div>;

  const stats = [
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Errands', value: data.totalErrands, icon: ClipboardList, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Reviews', value: data.totalReviews, icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg Rating', value: data.avgRating, icon: Star, color: 'bg-green-50 text-green-600', suffix: '/5' },
  ];

  const statusEntries = Object.entries(data.errandsByStatus);
  const total = statusEntries.reduce((s, [, c]) => s + c, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
              {s.suffix}
            </p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Errands by Status</h2>
          <div className="space-y-3">
            {statusEntries.map(([status, count]) => {
              const Icon = statusIcons[status] || FileText;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-gray-700">
                      <Icon size={14} className={statusColors[status]?.split(' ')[0] || 'text-gray-500'} />
                      {status}
                    </span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${statusColors[status]?.split(' ')[0].replace('text-', 'bg-') || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Users by Neighbourhood</h2>
          <div className="space-y-3">
            {data.usersByNeighbourhood.map(n => {
              const maxCount = Math.max(...data.usersByNeighbourhood.map(x => x.count));
              const pct = Math.round((n.count / maxCount) * 100);
              return (
                <div key={n._id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{n._id}</span>
                    <span className="text-gray-500">{n.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.map(a => (
              <div key={a.id} className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  a.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                  a.status === 'Claimed' ? 'bg-amber-100 text-amber-700' :
                  a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>{a.status}</span>
                <span className="text-gray-900 font-medium flex-1 truncate">{a.title}</span>
                <span className="text-gray-400">{a.poster_name}</span>
                <span className="text-gray-400 text-xs">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
