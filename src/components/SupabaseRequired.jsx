import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { supabaseConfigurationError } from '../lib/supabase';

export default function SupabaseRequired() {
  if (!supabaseConfigurationError) return <Outlet />;

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <section className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-8" role="alert">
        <h1 className="text-2xl font-bold">Connect Supabase to use this page</h1>
        <p>{supabaseConfigurationError}</p>
        <p>Use the URL and legacy anon public key from your own Supabase project. See LOCAL_SETUP.md for database and function setup.</p>
        <Link to="/" className="inline-block text-primary underline">Back to homepage</Link>
      </section>
    </main>
  );
}
