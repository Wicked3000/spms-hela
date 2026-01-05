import UniversitySidebar from '@/components/university/UniversitySidebar'
import { getUserProfile } from '@/lib/auth/roles'

export default async function UniversityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()
  const hasAccess = profile && (profile.role === 'university' || profile.role === 'admin') && profile.is_active

  // If we have a profile and access, we show the sidebar layout
  // Otherwise, we just render the children (e.g., the login page)
  if (profile && hasAccess) {
    return (
      <div className="flex min-h-screen bg-[#0F172A]">
        <UniversitySidebar profile={profile} />
        <main className="flex-1 lg:ml-72 min-h-screen">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // No account or not university? Just show the children
  // Individual pages (like dashboard) will handle their own redirect
  return <>{children}</>
}
