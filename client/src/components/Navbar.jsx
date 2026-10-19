import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, User, X, LogOut, LayoutDashboard, ReceiptText, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'My Orders' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (to) => {
    setMobileOpen(false);
    if (to.includes('#')) {
      const id = to.split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D2319] text-[#FBF9F3] transition-colors">
      <nav className="container-x flex h-[76px] items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col items-start leading-none" aria-label="Scarcy">
          <span className="font-display text-[26px] font-semibold tracking-tight text-white transition-colors group-hover:text-[#DE9E36]">
            Scarcy
          </span>
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.34em] text-[#C5D2C9] mt-0.5">
            SAVOR THE EXTRAORDINARY
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((item) => {
            const isHome = item.to === '/' && location.pathname === '/' && !location.hash;
            const isCurrentPage =
              location.pathname === item.to ||
              (item.to === '/orders' &&
                (location.pathname === '/orders' ||
                  location.pathname === '/my-orders' ||
                  location.pathname.startsWith('/order/')));
            const isActive = isHome || isCurrentPage;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => handleLinkClick(item.to)}
                className={`relative py-1 text-[15px] font-medium transition-colors duration-200 hover:text-[#DE9E36] ${
                  isActive ? 'text-[#DE9E36]' : 'text-[#C5D2C9]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-line"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#DE9E36]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
          {user?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-[15px] font-medium transition-colors duration-200 hover:text-[#DE9E36] ${
                  isActive ? 'text-[#DE9E36]' : 'text-[#C5D2C9]'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Book a Table CTA (Exact match from target image) */}
          <a
            href="#reserve"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                const el = document.getElementById('reserve');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D6E898] px-4 py-2 text-[13px] font-semibold text-[#12281D] transition-all duration-300 hover:bg-[#c9dd86] hover:shadow-[0_4px_14px_rgba(214,232,152,0.35)] active:scale-[0.97]"
          >
            <span>Book a Table</span>
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative rounded-full border border-white/15 p-2 text-white/80 transition hover:border-[#D6E898] hover:text-[#D6E898]"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6E898] text-[10px] font-bold text-[#12281D]"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User Auth / Account */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/20 py-1 pl-1 pr-2.5 transition hover:border-[#D6E898]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D6E898] font-display text-xs font-bold text-[#12281D]">
                  {user.name[0].toUpperCase()}
                </span>
                <span className="hidden text-xs sm:block">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-sand bg-white p-1.5 text-ink shadow-lift"
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-creamdeep">
                      <ReceiptText size={15} /> My orders
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-creamdeep">
                        <LayoutDashboard size={15} /> Admin panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserOpen(false); navigate('/'); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ember hover:bg-ember/10"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:border-[#D6E898] hover:text-[#D6E898] md:inline-flex"
            >
              <User size={14} />
              <span>Sign in</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-full border border-white/20 p-2 text-white/80 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#0D2319] lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => handleLinkClick(item.to)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-[#DE9E36]' : 'text-[#C5D2C9] hover:bg-white/5 hover:text-[#DE9E36]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-xl px-3 py-2 text-sm font-medium text-[#DE9E36] hover:bg-white/5"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
