import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Wheat, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-coal/60">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Wheat className="text-gold" size={24} strokeWidth={1.6} />
            <span className="font-display text-2xl font-bold">Zaiqa<span className="text-gold">.</span></span>
          </div>
          <p className="mt-1 font-script text-2xl text-gold/80">Taste of Lahore</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Slow-cooked desi classics, charcoal BBQ and comfort food — made fresh and delivered hot across the city since 1998.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link to="/menu" className="transition hover:text-gold">Full menu</Link></li>
            <li><Link to="/menu" className="transition hover:text-gold">Today's specials</Link></li>
            <li><Link to="/orders" className="transition hover:text-gold">Track your order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Visit us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> 14-B MM Alam Road, Gulberg III, Lahore</li>
            <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-gold" /> 042-111-924-72</li>
            <li className="flex items-center gap-2"><Clock size={16} className="shrink-0 text-gold" /> Daily 11:00 am – 2:00 am</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Follow the aroma</h4>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full border border-white/10 p-2.5 transition hover:border-gold hover:text-gold"><Facebook size={17} /></a>
            <a href="#" aria-label="Instagram" className="rounded-full border border-white/10 p-2.5 transition hover:border-gold hover:text-gold"><Instagram size={17} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Zaiqa. All rights reserved. Crafted with fire & flour.
      </div>
    </footer>
  );
}
