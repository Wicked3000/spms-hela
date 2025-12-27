'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import HeroBanner from '@/components/HeroBanner'
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  ShieldCheck, 
  Globe,
  CheckCircle,
  ArrowRight,
  Handshake,
  FileCheck,
  HeartHandshake
} from 'lucide-react'

const stats = [
  { label: 'Students Helped', value: '500+' },
  { label: 'Success Rate', value: '98%' },
  { label: 'Partner Universities', value: '15+' },
]

const coreValues = [
  {
    name: 'Excellence',
    description: 'Maintaining the highest standards in documentation and verification processes.',
    icon: Award,
    color: 'bg-yellow-500',
  },
  {
    name: 'Accessibility',
    description: 'Ensuring educational opportunities are within reach for all students in Hela Province.',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    name: 'Integrity',
    description: 'Upholding accuracy, verification, and authenticity in every student record.',
    icon: ShieldCheck,
    color: 'bg-green-500',
  },
]

const whatWeProvide = [
  { name: 'Professional student profiles', icon: FileCheck },
  { name: 'Verified academic records', icon: ShieldCheck },
  { name: 'International standard documentation', icon: Globe },
  { name: 'Scholarship and employment support', icon: HeartHandshake },
]

const impactStats = [
  { name: 'Successful Applications', description: 'Hundreds of students have successfully applied to overseas institutions' },
  { name: 'Education Office Partnership', description: 'Direct collaboration with the Hela Education Office' },
  { name: 'Pacific Recognition', description: 'Recognition across the Pacific region for quality credentials' },
  { name: 'Ongoing Support', description: 'Continuous student support throughout their educational journey' },
]


export default function AboutPage() {
  // Handle smooth scroll to hash anchor on page load
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [])

  return (
    <div className="bg-[#0F172A]">
      {/* Hero Banner */}
      <HeroBanner 
        title="About Us" 
        subtitle="Bridging the gap between education and opportunity for FODE and TVET students in Hela Province"
      />

      {/* Stats Section */}
      <section className="py-16 bg-[#1E293B]">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 ring-1 ring-green-500/20 mb-6">
              <Target className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Our Purpose</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Empowering students through innovative credentialing solutions
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              We believe every student deserves the chance to showcase their achievements on a global stage. 
              Our platform makes this possible by providing verified, professional academic profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section id="mission-vision" className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Guiding Principles</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Mission & Vision</p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0F172A]/80 p-8 ring-1 ring-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                To empower every <span className="text-green-400 font-semibold">FODE</span> and <span className="text-green-400 font-semibold">TVET</span> student 
                in Hela Province with accurate, professional, and globally recognized academic profiles, 
                unlocking doors to higher education, scholarships, and meaningful employment worldwide.
              </p>
            </div>
            
            {/* Vision */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-green-50 leading-relaxed">
                To be the leading national platform for student credentialing in Papua New Guinea, 
                ensuring learners from remote provinces like Hela have a digital identity that 
                commands global respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">What We Stand For</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Core Values</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {coreValues.map((value) => (
              <div key={value.name} className="rounded-2xl bg-[#0F172A] p-8 ring-1 ring-white/10 text-center">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${value.color} mb-6`}>
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{value.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Program Section */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">The Platform</h2>
              <p className="text-3xl font-bold text-white sm:text-4xl mb-6">About the Program</p>
              
              {/* Main Description */}
              <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
                <p>
                  The <strong className="text-white">Student Profile Management System</strong> is a comprehensive digital platform developed to support{' '}
                  <strong className="text-green-400">FODE (Flexible Open Distance Education)</strong> and{' '}
                  <strong className="text-green-400">TVET (Technical and Vocational Education and Training)</strong> students in Hela Province, particularly in Tari.
                </p>
                <p>
                  The system enables students to create secure, professionally structured digital profiles that meet national and international standards for university admissions, scholarship applications, and employment opportunities.
                </p>
                <p>
                  Each student profile contains verified academic records, personal identification details, family and educational background information, and officially endorsed supporting documents.
                </p>
                <p>
                  The platform works in close collaboration with <strong className="text-white">Hela Education Services</strong> and relevant authorities to ensure all information is accurate, current, and formally validated.
                </p>
                <p className="text-green-300 font-medium">
                  Through this system, hundreds of students have successfully applied to universities and scholarship programmes across Australia, New Zealand, and the Pacific region.
                </p>
              </div>
              
              {/* What We Provide */}
              <h3 className="text-lg font-semibold text-white mb-6">What We Provide</h3>
              <ul className="space-y-4">
                {whatWeProvide.map((item) => (
                  <li key={item.name} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                      <item.icon className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-gray-300">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Impact */}
            <div className="rounded-2xl bg-[#0F172A] p-8 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-green-400 mb-8">Our Impact</h3>
              <ul className="space-y-6">
                {impactStats.map((item, index) => (
                  <li key={item.name} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500 mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Trusted & Verified</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl mb-6">Verification & Success</p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Our system works directly with the <strong className="text-white">Hela Province Education Office</strong> to 
              guarantee all information is officially validated. We have successfully assisted students in applying 
              to universities in <span className="text-yellow-400">Australia</span>, <span className="text-yellow-400">New Zealand</span>, and the <span className="text-yellow-400">Pacific region</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-white/10">
                <Handshake className="h-4 w-4 text-green-400" /> Official Partnership
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-white/10">
                <Globe className="h-4 w-4 text-green-400" /> Global Recognition
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-20 lg:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://i.ibb.co/fdmXvRFz/magic-forest-landscape.avif)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Empower Your Future Today
            </h2>
            <p className="text-gray-100 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of students who have transformed their educational journey through our verified profile system.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['Professional Profiles', 'Global Recognition', 'Ongoing Support'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30">
                  <CheckCircle className="h-4 w-4" /> {item}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/profiles"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
              >
                Browse Student Profiles <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
