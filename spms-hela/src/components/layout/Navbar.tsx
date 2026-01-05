
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Facebook, Linkedin, MessageCircle } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Admission', href: '/admission' },
  { name: 'Curriculum', href: '/curriculum' },
  { name: 'Publications', href: '/publications' },
  { name: 'Student Profiles', href: '/profiles' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[#0F172A] border-b border-white/10 sticky top-0 z-50">
      <nav className="container-custom flex items-center justify-between py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <span className="sr-only">SPMS Hela</span>
            <Image 
              src="https://i.ibb.co/Kzb2wbx1/Hela-SPMS-Logo.png" 
              alt="Hela Province Logo" 
              width={48}
              height={48}
              className="h-12 w-12 object-contain rounded-lg"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-white">SPMS</span>
              <span className="text-sm text-yellow-400 ml-1">Hela</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-6">
          {navigation.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-sm font-medium leading-6 text-gray-300 hover:text-green-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div 
          className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-2"
          suppressHydrationWarning
        >
          <a
            href="https://wa.me/675XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="https://facebook.com/helaeducation"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Follow on Facebook"
            aria-label="Follow on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            title="Connect on LinkedIn"
            aria-label="Connect on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10">
          <div className="space-y-1 px-4 pb-4 pt-2 bg-[#1E293B]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-300 hover:bg-[#0F172A] hover:text-green-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div 
              className="flex items-center justify-around py-4 border-t border-white/5 mt-4"
              suppressHydrationWarning
            >
              <a
                href="https://wa.me/675XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com/helaeducation"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Follow on Facebook"
                aria-label="Follow on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Connect on LinkedIn"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
