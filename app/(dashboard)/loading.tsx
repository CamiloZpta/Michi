export default function Loading() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-pulse">
      <div>
        <div className="h-8 w-40 bg-rose-100 rounded-full mb-2" />
        <div className="h-4 w-64 bg-rose-50 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 bg-rose-50 rounded-3xl" />
        ))}
      </div>
      <div className="h-40 bg-rose-50 rounded-3xl" />
    </div>
  )
}
