import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <div className="rounded-2xl bg-[#1E293B] p-8 ring-1 ring-white/10 flex flex-col items-center shadow-xl">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-lg font-medium text-white">Loading Dashboard</h2>
        <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full w-1/2 animate-[shimmer_1s_infinite] bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
