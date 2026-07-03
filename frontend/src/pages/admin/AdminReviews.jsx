import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/axios';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import { StarRatingDisplay } from '../../components/StarRating';
import { ChevronLeft, ChevronRight, Trash2, Search } from 'lucide-react';

export default function AdminReviews() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const res = await api.get(`/admin/reviews?${params}`);
      setReviews(res.data.reviews);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      addToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, addToast]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/reviews/${deleteTarget}`);
      addToast('Review deleted', 'success');
      setDeleteTarget(null);
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete', 'error');
      setDeleteTarget(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Reviews</h2>
          <p className="text-sm text-gray-500">{total} total reviews</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search comments..." className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reviews found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Reviewer</th>
                  <th className="text-left px-4 py-3 font-medium">Reviewee</th>
                  <th className="text-left px-4 py-3 font-medium">Errand</th>
                  <th className="text-left px-4 py-3 font-medium">Rating</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Comment</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-xs">{r.reviewer_avatar}</div>
                        <span className="text-gray-900 truncate max-w-[120px]">{r.reviewer_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[120px]">{r.reviewee_name}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{r.errand_title}</td>
                    <td className="px-4 py-3"><StarRatingDisplay rating={r.rating} /></td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px] hidden sm:table-cell">{r.comment || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteTarget(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition"><Trash2 size={16} /></button>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Review?" message="This will permanently delete this review. This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
