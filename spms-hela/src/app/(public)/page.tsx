'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  FileSpreadsheet, 
  FileText, 
  FolderOpen, 
  ShieldCheck,
  Users,
  School,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Award,
  Target,
  Eye,
  ArrowRight
} from 'lucide-react'

const heroImages = [
  'https://i.ibb.co/JF020Pxc/img-02.jpg',
  'https://i.ibb.co/B5C0nLM1/img-01.jpg',
  'https://i.ibb.co/ZzWZCj2G/magic-night.avif',
  'https://i.ibb.co/b52mj7SF/magic-night-land.jpg',
]

const stats = [
  { name: 'Student Profiles', value: '500+', icon: Users },
  { name: 'Partner Universities', value: '50+', icon: Globe },
  { name: 'Free Access', value: '100%', icon: CheckCircle },
]

const features = [
  {
    name: 'FODE & TVET Student Profiles',
    description: 'Complete profiles for Flexible Open Distance Education and Technical & Vocational Education students from Hela Province.',
    icon: Users,
  },
  {
    name: 'Bulk Import from Excel',
    description: 'Efficiently import multiple student records from Excel or CSV files with our streamlined admin tools.',
    icon: FileSpreadsheet,
  },
  {
    name: 'Global Sharing',
    description: 'Generate unique public profile URLs to share with universities worldwide for seamless applications.',
    icon: Globe,
  },
  {
    name: 'Professional PDF Export',
    description: 'Download beautifully formatted PDF profiles ready for university applications and official submissions.',
    icon: FileText,
  },
  {
    name: 'Document Management',
    description: 'Upload and manage certificates, transcripts, and verification documents securely in one place.',
    icon: FolderOpen,
  },
  {
    name: 'Secure Admin Access',
    description: 'Platform managed by authorized administrators from the Hela Province Education Division.',
    icon: ShieldCheck,
  },
]

const universities = [
  { 
    name: 'University of Melbourne', 
    country: 'Australia', 
    flag: 'https://flagcdn.com/w160/au.png', 
    flagAlt: 'Australia flag',
    website: 'https://www.unimelb.edu.au/study/international-students'
  },
  { 
    name: 'University of Auckland', 
    country: 'New Zealand', 
    flag: 'https://flagcdn.com/w160/nz.png', 
    flagAlt: 'New Zealand flag',
    website: 'https://www.auckland.ac.nz/en/study/international-students.html'
  },
  { 
    name: 'University of the South Pacific', 
    country: 'Fiji', 
    flag: 'https://flagcdn.com/w160/fj.png', 
    flagAlt: 'Fiji flag',
    website: 'https://www.usp.ac.fj/admissions/'
  },
  { 
    name: 'Griffith University', 
    country: 'Australia', 
    flag: 'https://flagcdn.com/w160/au.png', 
    flagAlt: 'Australia flag',
    website: 'https://www.griffith.edu.au/international'
  },
  { 
    name: 'Massey University', 
    country: 'New Zealand', 
    flag: 'https://flagcdn.com/w160/nz.png', 
    flagAlt: 'New Zealand flag',
    website: 'https://www.massey.ac.nz/study/international-students/'
  },
  { 
    name: 'Parul University', 
    country: 'India', 
    flag: 'https://flagcdn.com/w160/in.png', 
    flagAlt: 'India flag',
    website: 'https://paruluniversity.ac.in/international-admissions'
  },
]

const scholarships = [
  {
    name: 'Australia Awards Scholarships',
    description: 'For PNG students to study in Australia with full funding.',
    icon: Award,
    color: 'bg-blue-500',
  },
  {
    name: 'NZ Scholarships',
    description: 'New Zealand government scholarships for Pacific students.',
    icon: Award,
    color: 'bg-green-500',
  },
  {
    name: 'USP Scholarships',
    description: 'University of the South Pacific programs for regional students.',
    icon: Award,
    color: 'bg-purple-500',
  },
  {
    name: 'Application Resources',
    description: 'Essential guides and resources for student applications.',
    icon: BookOpen,
    color: 'bg-orange-500',
  },
]

const benefits = [
  { name: 'Comprehensive Profiles', description: 'For overseas applications', icon: GraduationCap },
  { name: 'Academic Tracking', description: 'History and performance monitoring', icon: School },
  { name: 'Mobile-Friendly', description: 'Accessible for all stakeholders', icon: Smartphone },
  { name: 'Verified Records', description: 'Official education records for Tari students', icon: CheckCircle },
]

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0F172A]">
      {/* Hero Section with Image Slider */}
      <div className="relative isolate overflow-hidden h-screen min-h-[600px]">
        {/* Background Image Slider */}
        <div className="absolute inset-0 -z-10">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-start pt-32 sm:pt-40 md:flex-row md:items-center md:justify-center md:pt-0 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 sm:mb-8 inline-flex items-center space-x-2 rounded-full bg-green-500/20 backdrop-blur-sm px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold text-green-300 ring-1 ring-green-500/30">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>FODE & TVET Education Portal</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Building Futures in <span className="text-yellow-400">Hela Province</span>, Tari
            </h1>

            {/* Subheading */}
            <p className="text-xl leading-8 text-gray-200 mb-12 max-w-3xl mx-auto">
              Empowering students from Tari with professional profiles to unlock overseas education and career opportunities worldwide.
            </p>

            {/* Mission & Vision Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/about#mission-vision"
                className="group inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100 transition-all"
              >
                <Target className="h-5 w-5" />
                Our Mission
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about#mission-vision"
                className="group inline-flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all ring-1 ring-white/20"
              >
                <Eye className="h-5 w-5" />
                Our Vision
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="rounded-xl bg-white/10 backdrop-blur-md p-6 ring-1 ring-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-24 sm:py-32 bg-[#1E293B]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-400">Platform Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Core Features
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Our platform provides everything needed to showcase and share student achievements with educational institutions worldwide.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col bg-[#0F172A] rounded-2xl p-6 ring-1 ring-white/5 hover:ring-green-500/50 transition-all">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* University Opportunities Section */}
      <div className="py-24 sm:py-32 bg-[#0F172A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-green-400">Global Reach</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              University Opportunities
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Partner universities accepting international students from Papua New Guinea.
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            {universities.map((university, index) => (
              <Link
                key={university.name}
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 ring-1 ring-white/10 hover:ring-green-500/50 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Flag */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 group-hover:ring-green-500/30 transition-all overflow-hidden">
                    <Image
                      src={university.flag}
                      alt={university.flagAlt}
                      width={60}
                      height={45}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* University Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors mb-2">
                    {university.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">{university.country}</p>
                </div>

                {/* External Link Icon */}
                <div className="absolute top-6 right-6">
                  <ExternalLink className="h-5 w-5 text-gray-600 group-hover:text-green-400 transition-colors" />
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarships & Resources Section */}
      <div className="py-24 sm:py-32 bg-[#1E293B]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-yellow-400">Funding Your Future</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Scholarships & Resources
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Explore scholarship opportunities and resources to support your educational journey.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-4">
            {scholarships.map((item) => (
              <div
                key={item.name}
                className="group relative rounded-2xl bg-[#0F172A] p-6 ring-1 ring-white/5 hover:ring-yellow-500/50 transition-all"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-6 text-white group-hover:text-yellow-400 transition-colors">{item.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Benefits Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-br from-green-500/10 to-[#0F172A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-400">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Platform Benefits
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                  <benefit.icon className="h-8 w-8 text-green-400" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-base font-semibold leading-7 text-white">{benefit.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://i.ibb.co/ZRWrxXN1/img-03.avif)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to discover talented students from <span className="text-yellow-300">Hela Province</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-100">
              Browse our verified student profiles and connect with the next generation of leaders from Tari.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/profiles"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-lg hover:bg-gray-100 transition-colors"
              >
                Browse Student Profiles
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
