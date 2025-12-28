'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HeroBanner from '@/components/HeroBanner'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, 
  Download, 
  Calendar,
  Award,
  Users,
  Clock,
  FileCheck,
  Briefcase,
  ClipboardList,
  Shield,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Loader2
} from 'lucide-react'

type PublishedDocument = {
  id: number
  title: string
  category: string
  description: string | null
  uploaded_by: string
  uploaded_at: string
  file_url: string
  file_size: string | null
  page_count: number | null
  status: string
  is_featured: boolean
  published_month: string | null
  published_year: string | null
}

type HelpfulResource = {
  id: number
  title: string
  description: string | null
  category: string
  download_count: number
  file_url: string
  status: string
  created_at: string
}

type PolicyDocument = {
  id: number
  title: string
  description: string | null
  policy_type: string
  last_updated: string
  page_count: number | null
  file_size: string | null
  file_url: string
  status: string
  created_at: string
}


const CATEGORIES = ['All', 'Guide', 'Handbook', 'Report', 'Policy', 'Success Stories', 'Annual Report', 'Resource']

export default function PublicationsPage() {
  const [documents, setDocuments] = useState<PublishedDocument[]>([])
  const [featuredPublications, setFeaturedPublications] = useState<PublishedDocument[]>([])
  const [helpfulResources, setHelpfulResources] = useState<HelpfulResource[]>([])
  const [policyDocuments, setPolicyDocuments] = useState<PolicyDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<PublishedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [resourcesLoading, setResourcesLoading] = useState(true)
  const [policiesLoading, setPoliciesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPublications, setTotalPublications] = useState(0)
  const totalDownloads = 1000
  
  const PAGE_SIZE = 50

  useEffect(() => {
    fetchDocuments()
    fetchFeaturedPublications()
    fetchHelpfulResources()
    fetchPolicyDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, searchQuery, selectedCategory])

  const fetchDocuments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('published_documents')
        .select('*')
        .eq('status', 'Active')
        .order('uploaded_at', { ascending: false })

      if (error) {
        // Check if table doesn't exist
        if (error.message.includes('relation') || error.code === '42P01') {
          console.warn('Publications table not set up yet. Please run the SQL setup from PUBLICATIONS_SUPABASE_SETUP.md')
          setDocuments([])
          setTotalPublications(0)
          setLoading(false)
          return
        }
        throw error
      }
      
      setDocuments(data || [])
      setTotalPublications(data?.length || 0)
    } catch (error) {
      console.error('Error fetching documents:', error)
      // Don't show error to user if table doesn't exist yet
      setDocuments([])
      setTotalPublications(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPublications = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('published_documents')
        .select('*')
        .eq('status', 'Active')
        .eq('is_featured', true)
        .order('published_year', { ascending: false })
        .order('published_month', { ascending: false })
        .limit(4)

      if (error) {
        console.warn('Error fetching featured publications:', error)
        setFeaturedPublications([])
        setFeaturedLoading(false)
        return
      }
      
      setFeaturedPublications(data || [])
    } catch (error) {
      console.error('Error fetching featured publications:', error)
      setFeaturedPublications([])
    } finally {
      setFeaturedLoading(false)
    }
  }

  const fetchHelpfulResources = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('helpful_resources')
        .select('*')
        .eq('status', 'Active')
        .order('download_count', { ascending: false })

      if (error) {
        console.warn('Error fetching helpful resources:', error)
        setHelpfulResources([])
        setResourcesLoading(false)
        return
      }
      
      setHelpfulResources(data || [])
    } catch (error) {
      console.error('Error fetching helpful resources:', error)
      setHelpfulResources([])
    } finally {
      setResourcesLoading(false)
    }
  }

  const handleResourceDownload = async (resourceId: number, fileUrl: string) => {
    try {
      const supabase = createClient()
      
      // Increment download count
      const { error } = await supabase.rpc('increment_download_count', {
        resource_id: resourceId
      })

      if (error) {
        console.error('Error updating download count:', error)
      }

      // Refresh resources to show updated count
      fetchHelpfulResources()

      // Open file in new tab
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error('Error handling download:', error)
      // Still allow download even if count update fails
      window.open(fileUrl, '_blank')
    }
  }

  const fetchPolicyDocuments = async () => {
    try {
      const supabase = createClient()
      const { data, error} = await supabase
        .from('policy_documents')
        .select('*')
        .eq('status', 'Active')
        .order('last_updated', { ascending: false })

      if (error) {
        console.warn('Error fetching policy documents:', error)
        setPolicyDocuments([])
        setPoliciesLoading(false)
        return
      }
      
      setPolicyDocuments(data || [])
    } catch (error) {
      console.error('Error fetching policy documents:', error)
      setPolicyDocuments([])
    } finally {
      setPoliciesLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        (doc.description && doc.description.toLowerCase().includes(query))
      )
    }

    setFilteredDocuments(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE)

  const stats = [
    { label: 'Publications', value: `${totalPublications}+` },
    { label: 'Downloads', value: `${totalDownloads}+` },
    { label: 'Resource Access', value: '24/7' },
  ]

  return (
    <div className="bg-[#0F172A]">
      {/* Hero Banner */}
      <HeroBanner 
        title="Publications" 
        subtitle="Access comprehensive guides, reports, and resources for FODE and TVET students pursuing global opportunities."
      />

      {/* Stats Section */}
      <section className="py-16 bg-[#1E293B]">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Published Documents Section */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Document Library</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Published Documents</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 bg-[#1E293B] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-green-500 focus:outline-none appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="font-semibold text-white">{paginatedDocuments.length}</span> of{' '}
              <span className="font-semibold text-white">{filteredDocuments.length}</span> documents
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-400">
                Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
                <span className="font-semibold text-white">{totalPages}</span>
              </p>
            )}
          </div>

          {/* Documents Table */}
          <div className="rounded-xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
                <p className="mt-4 text-sm text-gray-400">Loading documents...</p>
              </div>
            ) : paginatedDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto" />
                <p className="mt-4 text-sm text-gray-400">No documents found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-[#0F172A]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pages</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedDocuments.map((doc, index) => (
                      <tr key={doc.id} className={index % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#0F172A]/50'}>
                        <td className="px-6 py-4 text-sm font-medium text-white">{doc.title}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400 ring-1 ring-blue-500/20">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                          {doc.description || 'No description'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{doc.page_count || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{doc.file_size || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors text-xs font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ring-1 ring-white/10"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-green-500 text-white'
                          : 'bg-[#1E293B] text-gray-400 hover:bg-white/5 ring-1 ring-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ring-1 ring-white/10"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Latest Updates</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Featured Publications</p>
          </div>
          
          {featuredLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden animate-pulse">
                  <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPublications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No featured publications available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPublications.map((pub) => {
                const getCategoryIcon = (category: string) => {
                  switch (category) {
                    case 'Success Stories': return { icon: Award, color: 'bg-green-500' }
                    case 'Guide': return { icon: FileCheck, color: 'bg-blue-500' }
                    case 'Handbook': return { icon: ClipboardList, color: 'bg-purple-500' }
                    case 'Annual Report': return { icon: FileCheck, color: 'bg-orange-500' }
                    case 'Report': return { icon: FileText, color: 'bg-yellow-500' }
                    case 'Policy': return { icon: Shield, color: 'bg-red-500' }
                    default: return { icon: FileText, color: 'bg-gray-500' }
                  }
                }
                
                const { icon: Icon, color } = getCategoryIcon(pub.category)
                const publicationDate = `${pub.published_month || ''} ${pub.published_year || ''}`.trim() || 'Date not specified'
                
                return (
                  <div key={pub.id} className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden hover:ring-green-500/50 transition-all">
                    <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{pub.category}</span>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" /> {publicationDate}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-white mb-2">{pub.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{pub.description || 'No description available'}</p>
                      <a
                        href={pub.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Helpful Materials</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Additional Resources</p>
          </div>
          
          {resourcesLoading ? (
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10 text-center animate-pulse">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-700 mb-4"></div>
                  <div className="h-5 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-10 bg-gray-700 rounded w-32 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : helpfulResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No resources available at this time</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {helpfulResources.map((resource) => {
                const getCategoryIcon = (category: string) => {
                  switch (category) {
                    case 'Forms': return ClipboardList
                    case 'Guidelines': return Users
                    case 'Career Resources': return Briefcase
                    default: return FileText
                  }
                }
                
                const Icon = getCategoryIcon(resource.category)
                
                return (
                  <div key={resource.id} className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10 text-center hover:ring-green-500/50 transition-all">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20 mb-4">
                      <Icon className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{resource.description || 'No description available'}</p>
                    <p className="text-xs text-gray-500 mb-4">{resource.download_count}+ downloads</p>
                    <button 
                      onClick={() => handleResourceDownload(resource.id, resource.file_url)}
                      className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors ring-1 ring-white/10"
                    >
                      Download Now
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Policy Documents */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Official Documents</h2>
              <p className="text-2xl font-bold text-white">Policy Documents</p>
            </div>
          </div>
          
          {policiesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 border-l-4 border-l-gray-700 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                      <div className="flex gap-4 mb-4">
                        <div className="h-3 bg-gray-700 rounded w-24"></div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                      </div>
                      <div className="h-10 bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : policyDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No policy documents available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {policyDocuments.map((doc, index) => {
                const borderColors = [
                  'border-l-blue-500',
                  'border-l-orange-500',
                  'border-l-purple-500',
                  'border-l-green-500'
                ]
                const borderColor = borderColors[index % borderColors.length]
                
                // Format date
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString)
                  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
                
                return (
                  <div key={doc.id} className={`rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 border-l-4 ${borderColor}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{doc.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{doc.description || 'No description available'}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Updated {formatDate(doc.last_updated)}
                          </span>
                          {doc.page_count && <span>{doc.page_count} pages</span>}
                          {doc.file_size && <span>{doc.file_size}</span>}
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 transition-colors"
                        >
                          <Download className="h-4 w-4" /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Important Notices */}
      <section className="py-12 bg-[#0F172A]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto rounded-xl bg-green-500/10 p-6 ring-1 ring-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-white">Important Notices</h3>
            </div>
            <ul className="space-y-2">
              {[
                'All policy documents are officially authorized by the Hela Province Education Department.',
                'Documents are available in PDF format for offline reference.',
                'Policies are reviewed and updated annually to reflect current educational standards.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-20 lg:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://i.ibb.co/b52mj7SF/magic-night-land.jpg)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Need More Resources?
            </h2>
            <p className="text-gray-100 text-lg mb-10 max-w-xl mx-auto">
              Contact our office for additional guides and information about FODE and TVET programs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/profiles" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                <Users className="h-4 w-4" /> View Student Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
