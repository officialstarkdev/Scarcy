import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, User, Wheat, X, LogOut, LayoutDashboard, ReceiptText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const links = [
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

  const navCls = ({ isActive }) =>
    `relative py-1 text-sm tracking-wide transition-colors hover:text-gold ${
      isActive ? 'text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold' : 'text-cream/80'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2">
          <Wheat className="text-gold transition-transform duration-500 group-hover:rotate-12" size={26} strokeWidth={1.6} />
          <span className="font-display text-2xl font-bold">
            Zaiqa<span className="text-gold">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navCls}>{l.label}</NavLink>
          ))}
          {user?.isAdmin && <NavLink to="/admin" className={navCls}>Admin</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="relative rounded-full border border-white/10 p-2.5 text-cream transition hover:border-gold/60 hover:text-gold"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 py-1.5 pl-1.5 pr-3 transition hover:border-gold/60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-ink">
                  {user.name[0].toUpperCase()}
                </span>
                <span className="hidden text-sm sm:block">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="card absolute right-0 mt-2 w-48 overflow-hidden p-1.5"
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                      <ReceiptText size={15} /> My orders
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                        <LayoutDashboard size={15} /> Admin panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserOpen(false); navigate('/'); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ember hover:bg-ember/10"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost hidden !px-5 !py-2 text-sm sm:inline-flex">
              <User size={16} /> Sign in
            </Link>
          )}

          <button
            className="rounded-full border border-white/10 p-2.5 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-3">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-white/5">
                  {l.label}
                </NavLink>
              ))}
              {user?.isAdmin && (
                <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-white/5">Admin</NavLink>
              )}
              {!user && (
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-gold hover:bg-white/5">Sign in</NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
