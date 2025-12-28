'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HeroBanner from '@/components/HeroBanner'
import { createClient } from '@/lib/supabase/client'
import { 
  Globe, 
  Clock, 
  BarChart3,
  Wrench,
  GraduationCap,
  Award,
  ArrowRight,
  Shield,
  BookOpen
} from 'lucide-react'

type CurriculumProgram = {
  id: number
  pathway: 'Academic' | 'Vocational'
  program_type: 'FODE' | 'TVET'
  title: string
  duration: string
  description: string | null
  subjects_or_skills: string[]
  certification: string | null
  status: string
  created_at: string
}

const stats = [
  { label: 'Programs Offered', value: '15+' },
  { label: 'Global Recognition', value: '100%' },
  { label: 'Graduates', value: '500+' },
]

const programFeatures = [
  { name: 'Global Standards', description: 'Curriculum aligned with international education standards.', icon: Globe },
  { name: 'Verified Content', description: 'Materials reviewed and approved by education experts.', icon: Shield },
  { name: 'Flexible Schedule', description: 'Self-paced learning with dedicated tutor support.', icon: Clock },
  { name: 'Progress Tracking', description: 'Regular assessments and performance feedback.', icon: BarChart3 },
]

const gradientColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-red-500 to-red-600',
  'from-teal-500 to-teal-600',
]

export default function CurriculumPage() {
  const [fodePrograms, setFodePrograms] = useState<CurriculumProgram[]>([])
  const [tvetPrograms, setTvetPrograms] = useState<CurriculumProgram[]>([])
  const [fodeLoading, setFodeLoading] = useState(true)
  const [tvetLoading, setTvetLoading] = useState(true)

  useEffect(() => {
    fetchFodePrograms()
    fetchTvetPrograms()
  }, [])

  const fetchFodePrograms = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('curriculum_programs')
        .select('*')
        .eq('pathway', 'Academic')
        .eq('program_type', 'FODE')
        .eq('status', 'Active')
        .order('id', { ascending: true })

      if (error) {
        console.warn('Error fetching FODE programs:', error)
        setFodePrograms([])
        setFodeLoading(false)
        return
      }
      
      setFodePrograms(data || [])
    } catch (error) {
      console.error('Error fetching FODE programs:', error)
      setFodePrograms([])
    } finally {
      setFodeLoading(false)
    }
  }

  const fetchTvetPrograms = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('curriculum_programs')
        .select('*')
        .eq('pathway', 'Vocational')
        .eq('program_type', 'TVET')
        .eq('status', 'Active')
        .order('id', { ascending: true })

      if (error) {
        console.warn('Error fetching TVET programs:', error)
        setTvetPrograms([])
        setTvetLoading(false)
        return
      }
      
      setTvetPrograms(data || [])
    } catch (error) {
      console.error('Error fetching TVET programs:', error)
      setTvetPrograms([])
    } finally {
      setTvetLoading(false)
    }
  }

  return (
    <div className="bg-[#0F172A]">
      {/* Hero Banner */}
      <HeroBanner 
        title="Curriculum" 
        subtitle="Comprehensive FODE and TVET programs designed for global recognition and student success, preparing you for international education standards."
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

      {/* Program Features */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Why Choose Our Programs</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Program Features</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {programFeatures.map((feature) => (
              <div key={feature.name} className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10 hover:ring-green-500/50 transition-all">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20 mb-4">
                  <feature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Pathway - FODE Programs */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Academic Pathway</h2>
            </div>
            <p className="text-3xl font-bold text-white sm:text-4xl">FODE Programs</p>
            <p className="mt-4 text-gray-400 max-w-3xl">
              Flexible Open Distance Education programs designed to meet international secondary education standards and prepare students for university entrance.
            </p>
          </div>

          {fodeLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : fodePrograms.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No FODE programs available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fodePrograms.map((program, index) => {
                const gradientColor = gradientColors[index % gradientColors.length]
                
                return (
                  <div key={program.id} className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 hover:ring-blue-500/50 transition-all group">
                    <div className={`inline-flex rounded-lg bg-gradient-to-r ${gradientColor} px-3 py-1 text-xs font-semibold text-white mb-4`}>
                      {program.duration}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{program.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{program.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects_or_skills.map((subject) => (
                          <span key={subject} className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400 ring-1 ring-blue-500/20">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {program.certification && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Award className="h-4 w-4 text-green-400" />
                          <span>{program.certification}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Vocational Pathway - TVET Programs */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Vocational Pathway</h2>
            </div>
            <p className="text-3xl font-bold text-white sm:text-4xl">TVET Programs</p>
            <p className="mt-4 text-gray-400 max-w-3xl">
              Technical and Vocational Education and Training programs providing hands-on skills and industry-recognized certifications for career success.
            </p>
          </div>

          {tvetLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : tvetPrograms.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No TVET programs available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tvetPrograms.map((program, index) => {
                const gradientColor = gradientColors[(index + 3) % gradientColors.length]
                
                return (
                  <div key={program.id} className="rounded-xl bg-[#1E293B] p-6 ring-1 ring-white/10 hover:ring-orange-500/50 transition-all group">
                    <div className={`inline-flex rounded-lg bg-gradient-to-r ${gradientColor} px-3 py-1 text-xs font-semibold text-white mb-4`}>
                      {program.duration}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{program.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{program.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects_or_skills.map((skill) => (
                          <span key={skill} className="inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400 ring-1 ring-orange-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {program.certification && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Award className="h-4 w-4 text-green-400" />
                          <span>{program.certification}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://i.ibb.co/ZzWZCj2G/magic-night.avif)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-100 mb-8">
              Explore our comprehensive programs and take the first step towards your educational and career goals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/profiles"
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                View Student Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
