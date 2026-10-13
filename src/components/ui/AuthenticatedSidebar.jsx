import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

export default function AuthenticatedSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { const close = e => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  const items = [['Dashboard','/user-dashboard','LayoutDashboard'],['New Analysis','/new-analysis','PlusCircle'],['Analysis Results','/analysis-results','BarChart3'],['Business Studio','/business-plan','NotebookPen'],['Deal Box','/coupons','Gift'],['Subscription','/subscription-tiers','CreditCard']];
  return <>
    <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation menu" aria-expanded={open}><Icon name={open ? 'X' : 'Menu'} /></button>
    {open && <button className="fixed inset-0 bg-black/30 z-[90] lg:hidden" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <Link to="/" className="sidebar-header"><span className="sidebar-logo"><Icon name="ChefHat" color="white" /></span><span className="sidebar-logo-text">OriginBite<span className="block text-xs opacity-70 font-body">Mumbai restaurant intelligence</span></span></Link>
      <p className="px-7 pt-7 pb-2 text-[10px] tracking-[.2em] uppercase text-muted-foreground">Your workspace</p>
      <nav className="sidebar-nav" aria-label="Main navigation">{items.map(([label, path, icon]) => <Link key={path} to={path} aria-current={pathname === path ? 'page' : undefined} className={`sidebar-nav-item ${pathname === path ? 'active' : ''}`}><Icon name={icon} size={19} />{label}</Link>)}</nav>
      <div className="mx-5 mt-8 rounded-xl border border-border p-4 bg-secondary"><Icon name="Sprout" className="text-primary mb-2" /><p className="font-semibold text-sm">Big ideas. Better beginnings.</p><p className="text-xs text-muted-foreground mt-2 leading-relaxed">Turn Mumbai market signals into your next restaurant concept.</p><Link to="/new-analysis" className="text-primary text-sm inline-block mt-3 font-semibold">Explore a location →</Link></div>
      <Link to="/" className="block m-7 text-sm text-muted-foreground">← Back to homepage</Link>
    </aside>
  </>;
}
