export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="td-style">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-2xl border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="animate-pulse bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-80 bg-gray-200 rounded-lg"></div>
    </div>
  )
}