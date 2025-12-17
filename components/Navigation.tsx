'use client'

// Main site navigation component.
// - Desktop/laptop: horizontal menu across the top.
// - Mobile: hamburger menu that expands / collapses.
// - Sticky header so navigation stays visible while scrolling.
// The code is heavily commented to help beginners understand each part.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()

  // Controls whether the mobile menu is open or closed.
  const [isOpen, setIsOpen] = useState(false)

  // Whenever the route/pathname changes (user clicks a link),
  // automatically close the mobile menu for a clean UX.
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Navigation items used in both desktop and mobile menus.
  // "Services" reuses the existing "How It Works" page.
  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
    { href: '/how-it-works', label: 'Services', icon: '🛠️' },
    { href: '/industries', label: 'Industries', icon: '🎬' },
    { href: '/genres', label: 'Genres', icon: '🎭' },
    { href: '/contact', label: 'Contact', icon: '✉️' },
    { href: '/credits', label: 'Credits', icon: '🏆' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / logo area */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-xl font-bold text-primary-600 hover:text-primary-700"
            >
              {/* Simple emoji icon for a friendly logo */}
              🎬 AI Movie Rec
            </Link>
          </div>

          {/* Desktop navigation (visible on md and larger screens) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger button (shown only on small screens) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Three lines that animate into an X when open */}
              <div className="space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-current transform transition duration-200 ${
                    isOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transform transition duration-200 ${
                    isOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {/* Uses max-height animation so it appears to slide open/closed. */}
      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-1 bg-white shadow-inner border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
              }`}
            >
              {/* Icon for better mobile UX; aria-hidden so screen readers read only the text label. */}
              <span aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}


