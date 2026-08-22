import { Link } from 'react-router-dom'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import {
  FiTwitter, FiInstagram, FiGithub, FiLinkedin,
} from 'react-icons/fi'

const footerLinks = {
  Product: [
    { label: 'Features',      href: '/#features' },
    { label: 'Destinations',  href: '/#destinations' },
    { label: 'How it works',  href: '/#how-it-works' },
    { label: 'Pricing',       href: '/pricing' },
    { label: 'Changelog',     href: '/changelog' },
  ],
  Company: [
    { label: 'About',        href: '/about' },
    { label: 'Blog',         href: '/blog' },
    { label: 'Careers',      href: '/careers' },
    { label: 'Press',        href: '/press' },
    { label: 'Contact',      href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
    { label: 'Cookie Policy',     href: '/cookies' },
    { label: 'GDPR',              href: '/gdpr' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API',           href: '/api' },
    { label: 'Community',     href: '/community' },
    { label: 'Support',       href: '/support' },
  ],
}

const socials = [
  { Icon: FiTwitter,   href: '#', label: 'Twitter' },
  { Icon: FiInstagram, href: '#', label: 'Instagram' },
  { Icon: FiGithub,    href: '#', label: 'GitHub' },
  { Icon: FiLinkedin,  href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group mb-5">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Globe<span className="text-primary-400">Trotter</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500 mb-6">
              Plan smarter, travel better. Your all-in-one platform for building perfect multi-city adventures.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-600 hover:text-white transition-all duration-150"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-4">
                  {group}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        to={href}
                        className="text-sm text-neutral-500 hover:text-white transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} GlobeTrotter. All rights reserved. Built for the Odoo Hackathon.
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <span>Made with</span>
            <span className="text-primary-500">♥</span>
            <span>by the GlobeTrotter Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
