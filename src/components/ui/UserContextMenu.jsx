import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getDemoUser, getPlan } from '../../lib/storage';
import Icon from '../AppIcon';

export default function UserContextMenu() {
  const [user, setUser] = useState(getDemoUser);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (supabase) supabase.auth.getUser().then(({ data }) => { if (data?.user) setUser({ name: data.user.user_metadata?.first_name || data.user.email.split('@')[0], email: data.user.email }); });
    const close = e => { if (e.key === 'Escape' || (e.type === 'pointerdown' && !ref.current?.contains(e.target))) setOpen(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, []);
  const logout = async () => {
    if (supabase) { const { error } = await supabase.auth.signOut(); if (error) { setError(error.message); return; } }
    localStorage.removeItem('originbite:profile'); navigate('/');
  };
  return <div className="relative ml-auto" ref={ref}>
    <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Account menu"><span className="rounded-full bg-primary text-white w-9 h-9 grid place-items-center">{user.name?.[0]?.toUpperCase() || 'E'}</span><span className="text-left hidden sm:block"><span className="block text-sm font-semibold">{user.name}</span><span className="block text-xs text-muted-foreground">{getPlan().tier} · {supabase ? 'Account' : 'Local workspace'}</span></span><Icon name="ChevronDown" size={16} /></button>
    {open && <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg p-3 z-[150] space-y-1">
      <p className="text-xs text-muted-foreground p-2 break-all">{user.email || 'Saved on this device'}</p>
      {[['Profile settings','/login'],['Subscription','/subscription-tiers'],['Help & support','/help']].map(([label,to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="block rounded-lg p-2 text-sm hover:bg-secondary">{label}</Link>)}
      <button onClick={logout} className="w-full text-left p-2 text-sm text-red-700">{supabase ? 'Sign out' : 'Leave demo profile'}</button>{error && <p role="alert">{error}</p>}
    </div>}
  </div>;
}
