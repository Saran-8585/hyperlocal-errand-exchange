import { Star } from 'lucide-react';

export function StarRatingDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16} className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
      ))}
      <span className="text-sm text-gray-500 ml-1">({Number(rating).toFixed(1)})</span>
    </div>
  );
}

export function StarRatingInput({ rating, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className="transition hover:scale-110">
          <Star size={24} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
}
