import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getDemoUser, writeLocal } from '../lib/storage';
import Icon from './AppIcon';

export default function AuthPage() {
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false);
  const [form, setForm] = useState({ name: getDemoUser().name === 'Explorer' ? '' : getDemoUser().name, email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (!supabase) { writeLocal('profile', { name: form.name.trim() || 'Explorer', email: '' }); navigate('/user-dashboard'); return; }
      const result = signup ? await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { first_name: form.name } } }) : await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) setMessage('Check your email to confirm your account, then sign in.');
      else navigate('/user-dashboard');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main className="auth-view"><Link to="/" className="brand"><Icon name="ChefHat" />OriginBite</Link><div className="auth-grid"><section><p className="eyebrow">A BETTER START FOR YOUR NEXT BIG IDEA</p><h1>Your restaurant journey<br /><em>starts here.</em></h1><p>Explore the neighbourhood. Understand the competition. Build with confidence.</p><div className="auth-facts"><span><Icon name="MapPin" />Mumbai insights</span><span><Icon name="BarChart3" />Saved reports</span><span><Icon name="NotebookPen" />Business plans</span></div></section><section className="surface p-8 md:p-10"><h2 className="text-3xl mb-2">{!supabase ? 'Create your local workspace' : signup ? 'Create account' : 'Welcome back'}</h2><p className="text-muted-foreground mb-6">{!supabase ? 'Demo profile · no account or password required. Your work stays in this browser.' : 'Sign in to your OriginBite account.'}</p><form onSubmit={submit} className="space-y-5">
    {(!supabase || signup) && <label className="field-label">Your name<input required maxLength={60} autoComplete="given-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="field" placeholder="What should we call you?" /></label>}
    {supabase && <><label className="field-label">Email address<input className="field" required type="email" autoComplete="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label><label className="field-label">Password<input className="field" required minLength={6} type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label></>}
    {error && <p role="alert" className="text-red-700">{error}</p>}{message && <p role="status" className="text-primary">{message}</p>}
    <button disabled={busy} className="action w-full">{busy ? 'Please wait…' : !supabase ? 'Enter workspace →' : signup ? 'Create account' : 'Sign in'}</button>
    {supabase && <button type="button" className="text-primary w-full text-sm" onClick={() => setSignup(!signup)}>{signup ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>}
  </form><Link to="/" className="block text-center text-sm mt-6 text-muted-foreground">← Back to homepage</Link></section></div></main>;
}
