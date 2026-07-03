import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Search, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';

const statusColors = { Open: 'bg-blue-100 text-blue-700', Claimed: 'bg-amber-100 text-amber-700', Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-slate-100 text-slate-700' };
const categories = ['Grocery Run', 'Parcel Drop', 'Pet Care', 'Home Help', 'Tech Help', 'Other'];

export default function AdminErrands() {
  const { addToast } = useToast();
  const [errands, setErrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchErrands = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (category) params.append('category', category);
      const res = await api.get(`/admin/errands?${params}`);
      setErrands(res.data.errands);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      addToast('Failed to load errands', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, category, addToast]);

  useEffect(() => { fetchErrands(); }, [fetchErrands]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/errands/${deleteTarget}`);
      addToast('Errand deleted', 'success');
      setDeleteTarget(null);
      fetchErrands();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete', 'error');
      setDeleteTarget(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Errands</h2>
          <p className="text-sm text-gray-500">{total} total errands</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search errands..." className="w-full sm:w-48 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="">All status</option>
            <option value="Open">Open</option>
            <option value="Claimed">Claimed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading errands...</div>
      ) : errands.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No errands found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Reward</th>
                  <th className="text-left px-4 py-3 font-medium">Posted By</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Area</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Deadline</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {errands.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{e.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.category}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[e.status]}`}>{e.status}</span></td>
                    <td className="px-4 py-3 font-medium">{e.reward > 0 ? `₹${e.reward}` : e.reward_type}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[120px]">{e.poster_name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{e.location_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{new Date(e.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/errand/${e.id}`} className="p-1.5 text-gray-400 hover:text-primary rounded transition"><Eye size={16} /></Link>
                        <button onClick={() => setDeleteTarget(e.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition"><Trash2 size={16} /></button>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Errand?" message="This will permanently delete the errand and all associated reviews. This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
