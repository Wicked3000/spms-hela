
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Student Profiles', href: '/profiles' },
    { name: 'Contact Us', href: '/contact' },
  ],
  education: [
    { name: 'Admission & Guidance', href: '/admission' },
    { name: 'Curriculum & Trades', href: '/curriculum' },
    { name: 'Publications', href: '/publications' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Branding */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Image 
                src="https://i.ibb.co/Kzb2wbx1/Hela-SPMS-Logo.png" 
                alt="Hela Province Logo" 
                width={40}
                height={40}
                className="h-10 w-10 object-contain rounded-lg"
              />
              <div>
                <span className="font-bold text-lg text-white">SPMS - </span>
                <span className="font-bold text-lg text-yellow-400">Hela</span>
                <p className="text-xs text-gray-500">Student Profile Management System</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-gray-400">
              Serving <strong className="text-green-400">FODE</strong> and <strong className="text-green-400">TVET</strong> students from Hela Province, Tari, Papua New Guinea. 
              Empowering the next generation with verified academic profiles for global opportunities.
            </p>
            <div className="flex space-x-6 text-gray-400">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Tari, Hela Province, PNG</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-green-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Education</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.education.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-green-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="h-4 w-4 text-green-400" />
                    <a href="mailto:info@education.hela.gov.pg" className="hover:text-green-400 transition-colors">info@education.hela.gov.pg</a>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="h-4 w-4 text-green-400" />
                    <a href="tel:+67512345678" className="hover:text-green-400 transition-colors">(+675) 1234 5678</a>
                  </li>
                </ul>
                <div className="mt-6">
                    <Link
                      href="/admin/login"
                      className="text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
                    >
                      Admin Sign In →
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Hela Provincial Education Division. All rights reserved.
            </p>
            <p className="text-xs leading-5 text-gray-500">
              Built for <span className="text-green-400">FODE</span> & <span className="text-green-400">TVET</span> Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
