import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, TicketPercent, UtensilsCrossed } from 'lucide-react';
import Page from '../../components/Page';

const links = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders', icon: ReceiptText, label: 'Orders' },
  { to: '/admin/products', icon: UtensilsCrossed, label: 'Menu items' },
  { to: '/admin/promos', icon: TicketPercent, label: 'Promo codes' },
];

export default function AdminLayout() {
  return (
    <Page className="container-x py-10">
      <div className="flex items-baseline gap-2.5">
        <h1 className="font-display text-2xl font-bold text-forest">
          Scarcy <span className="italic text-forestsoft">Back of House</span>
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px,1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin sections">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                  isActive ? 'bg-forest font-medium text-cream shadow-soft' : 'text-muted hover:bg-white hover:text-forest'
                }`
              }
            >
              <l.icon size={17} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0"><Outlet /></div>
      </div>
    </Page>
  );
}
