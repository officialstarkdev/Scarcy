import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Clock, Mail, Twitter, Linkedin } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Our Menu' },
  { to: '/orders', label: 'Track an Order' },
  { to: '/login', label: 'Sign In' },
];

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest text-cream">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-bold tracking-tight">Scarcy</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">
            Savor the extraordinary. From carefully curated ingredients to unforgettable culinary craft, every dish is an invitation to taste perfection.
          </p>
          <div className="mt-6 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="rounded-full border border-cream/20 p-2.5 text-cream/80 transition hover:border-sage hover:bg-sage hover:text-forest"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Quick Links</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/65">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition hover:text-sage">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Opening Hours</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/65">
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0 text-sage" />
              <span>Mon – Fri<br /><span className="text-cream/90">11:00 am – 2:00 am</span></span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0 text-sage" />
              <span>Sat – Sun<br /><span className="text-cream/90">10:00 am – 3:00 am</span></span>
            </li>
            <li className="text-cream/50">We are open all days of the week</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Contact Us</h4>
          <ul className="mt-5 space-y-3.5 text-sm text-cream/65">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-sage" />
              14-B MM Alam Road, Gulberg III, Lahore
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-sage" />
              <a href="tel:04211192472" className="transition hover:text-sage">042-111-924-72</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-sage" />
              <a href="mailto:hello@scarcy.com" className="transition hover:text-sage">hello@scarcy.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Scarcy. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <a href="#" className="transition hover:text-sage">Privacy Policy</a>
            <span className="h-3 w-px bg-cream/20" />
            <a href="#" className="transition hover:text-sage">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
