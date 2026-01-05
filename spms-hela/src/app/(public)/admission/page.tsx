
import Link from 'next/link'
import HeroBanner from '@/components/HeroBanner'
import ScrollReveal from '@/components/layout/ScrollReveal'
import {
  CheckCircle, 
  FileText,
  Camera,
  CreditCard,
  User,
  Phone,
  Shield,
  Zap,
  RefreshCw,
  HeadphonesIcon,
  ArrowRight,
  GraduationCap,
  AlertCircle
} from 'lucide-react'

const stats = [
  { label: 'Successful Profiles', value: '500+' },
  { label: 'Processing Time', value: '5-7 Days' },
  { label: 'Free Service', value: '100%' },
]

const eligibilityRequirements = [
  { name: 'Valid Student Enrollment', description: 'Must be enrolled in a FODE or TVET program.', icon: GraduationCap },
  { name: 'Recent Photograph', description: 'A passport-size photograph for your profile.', icon: Camera },
  { name: 'Academic Documents', description: 'Transcripts, certificates, and records.', icon: FileText },
  { name: 'National ID', description: 'Valid national identification documents.', icon: User },
  { name: 'Contact Information', description: 'Contact details and family information.', icon: Phone },
  { name: 'Bank Account', description: 'Bank information for scholarship purposes.', icon: CreditCard },
]

const applicationSteps = [
  { step: 1, title: 'Submit Application', description: 'Contact the Hela Province education office to register.', color: 'bg-blue-500' },
  { step: 2, title: 'Provide Documentation', description: 'Submit all required documents for verification.', color: 'bg-purple-500' },
  { step: 3, title: 'Verification Process', description: 'Our team verifies information with authorities.', color: 'bg-orange-500' },
  { step: 4, title: 'Profile Activation', description: 'Your verified profile is activated and ready.', color: 'bg-green-500' },
]

const whyChooseUs = [
  { name: 'Verified & Secure', description: 'Officially verified by education authorities.', icon: Shield },
  { name: 'Fast Processing', description: 'Completed within 5-7 business days.', icon: Zap },
  { name: 'Free Updates', description: 'Update profiles as you progress.', icon: RefreshCw },
  { name: 'Dedicated Support', description: 'Assistance throughout the process.', icon: HeadphonesIcon },
]

export default function AdmissionPage() {
  return (
    <div className="bg-[#0F172A]">
      {/* Hero Banner */}
      <HeroBanner 
        title="Admission" 
        subtitle="Join hundreds of students with verified profiles. FODE and TVET students from Tari can now access global educational opportunities. Registration is completely free."
      />

      {/* Stats Section */}
      <section className="py-16 bg-[#1E293B]">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={0.1 * index} direction="up" distance={20}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Before You Apply</h2>
              <p className="text-3xl font-bold text-white sm:text-4xl">Eligibility Requirements</p>
            </div>
          </ScrollReveal>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {eligibilityRequirements.map((req, index) => (
              <ScrollReveal key={req.name} delay={0.05 * index} direction="up" distance={20}>
                <div className="flex items-start gap-4 rounded-xl bg-[#1E293B] p-5 ring-1 ring-white/10 h-full hover:ring-green-500/50 transition-all">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <req.icon className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{req.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{req.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 lg:py-28 bg-[#1E293B]">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Simple & Straightforward</h2>
              <p className="text-3xl font-bold text-white sm:text-4xl">Application Process</p>
            </div>
          </ScrollReveal>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {applicationSteps.map((step, index) => (
              <ScrollReveal key={step.step} delay={0.1 * index} direction="right">
                <div className="relative h-full">
                  <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 h-full hover:ring-green-500/30 transition-all">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${step.color} text-white font-bold text-lg mb-4 shadow-lg shadow-white/5`}>
                      {step.step}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Benefits</h2>
            <p className="text-3xl font-bold text-white sm:text-4xl">Why Choose Our Service</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {whyChooseUs.map((item) => (
              <div key={item.name} className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 ring-1 ring-green-500/20 mb-4">
                  <item.icon className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-12 bg-[#1E293B]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto rounded-xl bg-green-500/10 p-6 ring-1 ring-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-white">Important Information</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Profile creation is completely FREE for all eligible students.',
                'Processing time is 5-7 business days after document submission.',
                'All profiles are verified by the Hela Province education office.'
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
        style={{ backgroundImage: 'url(https://i.ibb.co/0yBKXhRQ/magic-forest-wetland.jpg)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-100 text-lg mb-10 max-w-xl mx-auto">
              Contact the Hela Province education office today to begin your registration.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['Free Service', 'Official Verification', 'Ongoing Support'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30">
                  <CheckCircle className="h-4 w-4" /> {item}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Phone className="h-4 w-4" /> Contact Education Office
              </Link>
              <Link 
                href="/profiles" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors ring-1 ring-white/30"
              >
                View Profiles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
