import { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import ErrandCard from '../components/ErrandCard';
import { BrowseMap } from '../components/ErrandMap';
import { CardSkeleton } from '../components/Skeleton';
import { Map, Grid3X3, Search, SlidersHorizontal, X } from 'lucide-react';

const categories = ['Grocery Run', 'Parcel Drop', 'Pet Care', 'Home Help', 'Tech Help', 'Other'];
const urgencies = ['Low', 'Medium', 'High'];
const neighbourhoods = ['Kuniyamuthur', 'Sugunapuram', 'Vadavalli', 'Kovaipudur', 'R.S. Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Ganapathy'];

export default function Browse() {
  const [errands, setErrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', urgency: '', neighbourhood: '', minReward: '', maxReward: '' });

  const fetchErrands = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.category) params.append('category', filters.category);
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.neighbourhood) params.append('neighbourhood', filters.neighbourhood);
      if (filters.minReward) params.append('minReward', filters.minReward);
      if (filters.maxReward) params.append('maxReward', filters.maxReward);
      const res = await api.get(`/errands?${params}`);
      setErrands(res.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [search, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchErrands, 300);
    return () => clearTimeout(timer);
  }, [fetchErrands]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Errands</h1>
          <p className="text-gray-500 text-sm mt-1">Find errands to run in your neighbourhood</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button onClick={() => setShowMap(!showMap)} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition ${showMap ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {showMap ? <Grid3X3 size={16} /> : <Map size={16} />} {showMap ? 'Grid' : 'Map'}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search errands..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white" />
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select value={filters.category} onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.urgency} onChange={e => setFilters(prev => ({ ...prev, urgency: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All Urgency</option>
              {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select value={filters.neighbourhood} onChange={e => setFilters(prev => ({ ...prev, neighbourhood: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All Areas</option>
              {neighbourhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <input type="number" value={filters.minReward} onChange={e => setFilters(prev => ({ ...prev, minReward: e.target.value }))} placeholder="Min ₹" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="number" value={filters.maxReward} onChange={e => setFilters(prev => ({ ...prev, maxReward: e.target.value }))} placeholder="Max ₹" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button onClick={() => setFilters({ category: '', urgency: '', neighbourhood: '', minReward: '', maxReward: '' })} className="mt-3 text-sm text-gray-500 hover:text-primary flex items-center gap-1">
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {showMap && !loading && (
        <div className="mb-6">
          <BrowseMap errands={errands} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : errands.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No errands found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {errands.map(e => <ErrandCard key={e.id} errand={e} />)}
        </div>
      )}
    </div>
  );
}
