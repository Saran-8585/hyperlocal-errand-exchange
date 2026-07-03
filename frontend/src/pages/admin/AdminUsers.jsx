import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { useToast } from '../../components/Toast';
import { Search, ChevronLeft, ChevronRight, Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (neighbourhood) params.append('neighbourhood', neighbourhood);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, neighbourhood, addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleToggleRole(userId, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      addToast(`User role changed to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update role', 'error');
    }
  }

  async function handleToggleStatus(userId, currentStatus) {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      addToast(`User ${currentStatus === 'active' ? 'suspended' : 'activated'}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to toggle status', 'error');
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <p className="text-sm text-gray-500">{total} total users</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <select value={neighbourhood} onChange={e => { setNeighbourhood(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="">All areas</option>
            {['Kuniyamuthur','Sugunapuram','Vadavalli','Kovaipudur','R.S. Puram','Gandhipuram','Saibaba Colony','Peelamedu','Singanallur','Ganapathy'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Area</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Errands</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className={`hover:bg-gray-50 ${u.status === 'suspended' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-xs">{u.avatar_initial}</div>
                        <Link to={`/profile/${u.id}`} className="font-medium text-gray-900 hover:text-primary truncate max-w-[140px]">{u.name}</Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.neighbourhood}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{u.errandCount}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleRole(u.id, u.role)} className="p-1.5 text-gray-400 hover:text-purple-600 rounded transition" title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}>
                          {u.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button onClick={() => handleToggleStatus(u.id, u.status)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition" title={u.status === 'active' ? 'Suspend user' : 'Activate user'}>
                          {u.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Page {page} of {pages}</span>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 rounded"><ChevronLeft size={18} /></button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 rounded"><ChevronRight size={18} /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
