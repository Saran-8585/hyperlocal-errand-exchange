export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}
