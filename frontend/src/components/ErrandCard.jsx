import { Link } from 'react-router-dom';
import {MapPin, Clock, IndianRupee, User, Star} from 'lucide-react';

const urgencyColors = { High: 'bg-red-100 text-red-700', Medium: 'bg-orange-100 text-orange-700', Low: 'bg-green-100 text-green-700' };
const categoryColors = {
  'Grocery Run': 'bg-emerald-100 text-emerald-700',
  'Parcel Drop': 'bg-blue-100 text-blue-700',
  'Pet Care': 'bg-purple-100 text-purple-700',
  'Home Help': 'bg-amber-100 text-amber-700',
  'Tech Help': 'bg-indigo-100 text-indigo-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function ErrandCard({ errand }) {
  const deadline = new Date(errand.deadline);
  const now = new Date();
  const diff = deadline - now;
  const expired = diff < 0;
  const hoursLeft = Math.floor(diff / 3600000);
  const minsLeft = Math.floor((diff % 3600000) / 60000);

  return (
    <Link to={`/errand/${errand.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[errand.category] || 'bg-gray-100 text-gray-700'}`}>
            {errand.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${urgencyColors[errand.urgency] || 'bg-gray-100 text-gray-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${errand.urgency === 'High' ? 'bg-red-500' : errand.urgency === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
            {errand.urgency}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{errand.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{errand.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={14} /> {errand.location_name}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <User size={14} /> {errand.poster_name}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <IndianRupee size={14} className="text-gray-400" />
            <span className="font-semibold text-primary">{errand.reward > 0 ? `₹${errand.reward}` : errand.reward_type}</span>
          </div>
          {(errand.claimed_by && errand.runner_rating) && (
            <div className="flex items-center gap-1 text-sm text-amber-500">
              <Star size={14} fill="currentColor" /> {Number(errand.runner_rating).toFixed(1)}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1.5 text-xs ${expired ? 'text-red-500' : 'text-gray-400'}`}>
          <Clock size={12} />
          {expired ? 'Expired' : `${hoursLeft}h ${minsLeft}m left`}
        </div>
      </div>
    </Link>
  );
}
