'use client'

import { useRouter } from 'next/navigation'
import { Search, RefreshCw } from 'lucide-react'
import Link from 'next/link'

type SearchFormProps = {
  query: string
  stream?: string
  province?: string
  gender?: string
  tvet_trade?: string
}

export default function SearchForm({ query, stream, province, gender, tvet_trade }: SearchFormProps) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const params = new URLSearchParams()
    
    formData.forEach((value, key) => {
      if (value && value !== 'all') {
        params.set(key, value.toString())
      }
    })
    
    // Always reset to page 1 on new search
    params.set('page', '1')
    
    router.push(`/profiles?${params.toString()}`)
  }

  return (
    <form 
      className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search Bar */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">Search</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="search"
              name="q"
              id="search"
              defaultValue={query}
              placeholder="Search by name, phone, village, ward, school..."
              className="block w-full rounded-lg border-0 bg-[#0F172A] py-2.5 pl-10 pr-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Stream Filter */}
        <div>
          <label htmlFor="stream" className="block text-sm font-medium text-gray-400 mb-1">Stream</label>
          <select 
            name="stream" 
            id="stream"
            defaultValue={stream}
            className="block w-full rounded-lg border-0 bg-[#0F172A] py-2.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
          >
            <option value="all">All Streams</option>
            <option value="Academic">FODE (Academic)</option>
            <option value="TVET">TVET</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
          <select 
            name="gender" 
            id="gender"
            defaultValue={gender}
            className="block w-full rounded-lg border-0 bg-[#0F172A] py-2.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-400 mb-1">Province</label>
          <select 
            name="province" 
            id="province"
            defaultValue={province}
            className="block w-full rounded-lg border-0 bg-[#0F172A] py-2.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
          >
            <option value="all">All Provinces</option>
            <option value="Hela">Hela</option>
            <option value="Southern Highlands">Southern Highlands</option>
            <option value="Western Highlands">Western Highlands</option>
          </select>
        </div>

        {/* TVET Trade Filter */}
        <div>
          <label htmlFor="tvet_trade" className="block text-sm font-medium text-gray-400 mb-1">TVET Trade</label>
          <select 
            name="tvet_trade" 
            id="tvet_trade"
            defaultValue={tvet_trade}
            className="block w-full rounded-lg border-0 bg-[#0F172A] py-2.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
          >
            <option value="all">All Trades</option>
            <option value="Office Admin-ICT">Office Admin-ICT</option>
            <option value="Commercial Cookery">Commercial Cookery</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Automotive">Automotive</option>
            <option value="Welding">Welding</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-end gap-2 lg:col-span-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 transition-colors"
          >
            Apply Filters
          </button>
          <Link
            href="/profiles"
            className="inline-flex items-center justify-center rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-gray-300 ring-1 ring-white/10 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Link>
        </div>
      </div>
    </form>
  )
}
