'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroBanner from '@/components/HeroBanner'
import ScrollReveal from '@/components/layout/ScrollReveal'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Send,
  Loader2,
  Globe,
  GraduationCap,
  HelpCircle,
  FileText,
  Users,
  Building
} from 'lucide-react'

const contactInfo = [
  {
    icon: Building,
    title: 'Office Address',
    details: 'Hela Province Education Office\nTari, Hela Province\nPapua New Guinea',
    color: 'bg-blue-500'
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    details: '+675 XXX XXXX\n+675 XXX XXXX',
    color: 'bg-green-500'
  },
  {
    icon: Mail,
    title: 'Email Address',
    details: 'education@helaprovince.gov.pg\ninfo@helaspms.edu.pg',
    color: 'bg-purple-500'
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: 'Monday - Friday\n8:00 AM - 4:00 PM\nClosed on Public Holidays',
    color: 'bg-orange-500'
  },
]


const commonInquiries = [
  { title: 'Student Profile Creation', description: 'How to create and verify your student profile', icon: Users },
  { title: 'Document Verification', description: 'Academic document authentication process', icon: FileText },
  { title: 'Program Information', description: 'Details about FODE and TVET programs', icon: GraduationCap },
  { title: 'Technical Support', description: 'Help with platform access and usage', icon: HelpCircle },
]

const educationOfficers = [
  {
    name: 'Mr. James Tari',
    role: 'Senior Education Officer',
    email: 'j.tari@helaprovince.gov.pg',
    image: '/images/officers/senior_officer.png',
    department: 'Hela Education Office'
  },
  {
    name: 'Ms. Sarah Kila',
    role: 'FODE Coordinator',
    email: 's.kila@helaprovince.gov.pg',
    image: '/images/officers/fode_coordinator.png',
    department: 'FODE Tari'
  },
  {
    name: 'Mr. David Hela',
    role: 'TVET Specialist',
    email: 'd.hela@helaprovince.gov.pg',
    image: '/images/officers/tvet_specialist.png',
    department: 'TVET Support'
  },
  {
    name: 'Mrs. Mary Mondo',
    role: 'Verification Officer',
    email: 'm.mondo@helaprovince.gov.pg',
    image: '/images/officers/verification_officer.png',
    department: 'Records & Admissions'
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('messages')
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'New'
        }])

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Messages table not set up. Please run messages_setup.sql')
          setSubmitting(false)
          return
        }
        throw error
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.')
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#0F172A]">
      {/* Hero Banner */}
      <HeroBanner 
        title="Contact Us" 
        subtitle="Get in touch with us for support, information, or assistance regarding FODE and TVET programs."
      />

      {/* Contact Information Section */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Get In Touch</h2>
              <p className="text-3xl font-bold text-white sm:text-4xl">Contact Information</p>
            </div>
          </ScrollReveal>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <ScrollReveal key={info.title} delay={index * 0.1} direction="up" distance={20}>
                <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 text-center h-full hover:ring-green-500/50 transition-all">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${info.color} mb-4 shadow-lg shadow-white/5`}>
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-line leading-relaxed">{info.details}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* Education Officers Section */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Our Team</h2>
              <p className="text-3xl font-bold text-white sm:text-4xl">Education Officers</p>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Our dedicated officers are here to assist with student verification, admissions, and program support across Hela Province.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {educationOfficers.map((officer, index) => (
              <ScrollReveal key={officer.name} delay={index * 0.1} direction="up">
                <div 
                  className="group relative rounded-2xl bg-[#1E293B] p-2 ring-1 ring-white/10 overflow-hidden transition-all hover:-translate-y-2 hover:ring-green-500/50 h-full"
                >
                  {/* Image container with overlay */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0F172A]">
                    <Image
                      src={officer.image}
                      alt={officer.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <p className="text-xs font-medium text-green-400 mb-1">{officer.role}</p>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {officer.name}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Building className="h-3 w-3" /> {officer.department}
                      </p>
                      <a 
                        href={`mailto:${officer.email}`}
                        className="text-xs text-gray-300 flex items-center gap-2 hover:text-green-400 transition-colors"
                      >
                        <Mail className="h-3 w-3" /> {officer.email}
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Side Info Section */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <ScrollReveal direction="left">
                <div>
                  <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Send a Message</h2>
                  <p className="text-3xl font-bold text-white sm:text-4xl mb-6">Contact Form</p>
                  <p className="text-gray-400 mb-8">
                    Fill out the form below and we&apos;ll respond as soon as possible.
                  </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="Your full name"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="your.email@example.com"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="+675 XXX XXXX"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="What is this regarding?"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none resize-none"
                      placeholder="Please provide details about your inquiry..."
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
              </ScrollReveal>

              {/* Common Inquiries & Map Side */}
              <ScrollReveal direction="right">
                <div className="space-y-6">
                <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-white">Common Inquiries</h3>
                  </div>
                  <ul className="space-y-4">
                    {commonInquiries.map((inquiry) => (
                      <li key={inquiry.title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                          <inquiry.icon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{inquiry.title}</h4>
                          <p className="text-xs text-gray-500">{inquiry.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Google Map */}
                <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-white">Our Location</h3>
                  </div>
                  <div className="rounded-lg overflow-hidden ring-1 ring-white/10">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63680.89847892!2d142.9!3d-5.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x699f1c8b8b8b8b8b%3A0x1!2sTari%2C%20Hela%20Province%2C%20Papua%20New%20Guinea!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="300"
                      className="border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hela Province Education Office Location"
                    ></iframe>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Hela Province Education Office, Tari, Hela Province, Papua New Guinea
                  </p>
                </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-20 lg:py-24 bg-cover bg-center bg-no-repeat bg-[url('https://i.ibb.co/wZ8HqgQG/magic-moon.jpg')]"
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Supporting Your Educational Journey
            </h2>
            <p className="text-gray-100 text-lg mb-10 max-w-xl mx-auto">
              We&apos;re committed to helping FODE and TVET students achieve global education opportunities.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['FODE & TVET Support', 'Official Verification', 'Global Opportunities'].map((item) => (
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
                <Globe className="h-4 w-4" /> Browse Student Profiles
              </Link>
              <Link 
                href="/admission" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                <GraduationCap className="h-4 w-4" /> Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
