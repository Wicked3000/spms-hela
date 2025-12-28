import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#0F172A]">
      <LoadingSpinner size="xl" />
      <h2 className="mt-4 text-lg font-medium text-white animate-pulse">Loading...</h2>
      <p className="mt-2 text-sm text-gray-400">Please wait while we prepare the content</p>
    </div>
  )
}
