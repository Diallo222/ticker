export function DeskSkeleton() {
  return (
    <div
      className="grid min-h-[280px] flex-1 grid-cols-1 border-b border-ink md:grid-cols-[minmax(200px,0.95fr)_minmax(280px,1.55fr)_minmax(180px,0.85fr)] md:border-b-0"
      aria-hidden
    >
      <div className="border-b border-ink md:border-b-0 md:border-r">
        <div className="border-b border-ink/20 px-4 py-2.5 md:px-5">
          <div className="skeleton-line h-2.5 w-16" />
        </div>
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-ink/10 px-4 py-3 md:px-5"
            >
              <div className="skeleton-line h-2.5 w-12" />
              <div className="skeleton-line h-2.5 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col border-b border-ink md:border-b-0 md:border-r">
        <div className="flex justify-between border-b border-ink/20 px-4 py-3 md:px-5">
          <div>
            <div className="skeleton-line h-6 w-20" />
            <div className="skeleton-line mt-2 h-2.5 w-36" />
          </div>
          <div className="flex flex-col items-end">
            <div className="skeleton-line h-5 w-16" />
            <div className="skeleton-line mt-2 h-2.5 w-20" />
          </div>
        </div>
        <div className="flex flex-1 items-end px-4 py-6 md:px-5">
          <div className="skeleton-line h-[140px] w-full opacity-40" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="border-b border-ink/20 px-4 py-2.5 md:px-5">
          <div className="skeleton-line h-2.5 w-14" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-px bg-ink/12 p-px">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-paper px-3 py-4">
              <div className="skeleton-line h-2 w-10" />
              <div className="skeleton-line mt-4 h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
