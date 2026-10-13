import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

/* ─────────────────────────────────────────────────────────────────────
   PublicHeader — premium/futuristic aesthetic overhaul
   Design choices:
   • Sticky glass header: `backdrop-blur-xl bg-background/80`,
     scroll-aware border opacity transition — floats at top, grounds
     when scrolled.
   • Logo: primary glow ring, `hover:scale-[1.06]` lift.
   • Nav links: ultra-thin `tracking-tight`, hover uses a subtle
     underline sweep (box-shadow bottom border trick) instead of
     text-decoration.
   • Nav entrance: each link staggers in from top on mount.
   • Mobile panel: deep glass `bg-background/90 backdrop-blur-2xl`.
   • All items, hrefs, handleSignIn, handleGetStarted — UNTOUCHED.
───────────────────────────────────────────────────────────────────── */

const PublicHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const navigationItems = [
    { label: 'Features', href: '#features'           },
    { label: 'Pricing',  href: '/subscription-tiers' },
    { label: 'About',    href: '#testimonials'        },
  ];

  const handleSignIn = () => navigate('/login');
  const handleGetStarted = () => navigate('/coupons');
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <style>{`
        @keyframes headerItemIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .header-nav-item-animated {
          opacity: 0;
          animation: headerItemIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .mobile-menu-animated {
          animation: mobileMenuIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nav-link-hover {
          position: relative;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: hsl(var(--foreground));
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link-hover:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>

      <header
        className="public-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          background: 'hsl(var(--background) / 0.8)',
          borderBottom: `1px solid hsl(var(--border) / ${scrolled ? '0.5' : '0.2'})`,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: scrolled
            ? '0 1px 0 0 hsl(var(--border)/0.1), 0 8px 32px -8px rgba(0,0,0,0.12)'
            : 'none',
        }}
      >
        <div className="public-header-container">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="public-header-logo"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <div
              className="public-header-logo-icon"
              style={{
                transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease',
                boxShadow: '0 0 0 1.5px hsl(var(--primary) / 0.3), 0 0 14px hsl(var(--primary) / 0.18)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 0 0 1.5px hsl(var(--primary) / 0.55), 0 0 22px hsl(var(--primary) / 0.32)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 0 1.5px hsl(var(--primary) / 0.3), 0 0 14px hsl(var(--primary) / 0.18)';
              }}
            >
              <Icon name="ChefHat" size={24} color="#FFFFFF" />
            </div>
            <span
              className="public-header-logo-text"
              style={{ letterSpacing: '-0.03em', fontWeight: 600 }}
            >
              OriginBite
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="public-header-nav">
            {navigationItems.map((item, i) => {
              const isAnchor = item.href.startsWith('#');
              const sharedStyle = {
                fontSize: '0.9rem',
                fontWeight: 450,
                color: 'hsl(var(--foreground) / 0.65)',
                textDecoration: 'none',
                letterSpacing: '-0.015em',
                transition: 'color 0.15s ease',
                animationDelay: `${80 + i * 60}ms`,
              };
              const sharedHover = {
                onMouseEnter: e => e.currentTarget.style.color = 'hsl(var(--foreground))',
                onMouseLeave: e => e.currentTarget.style.color = 'hsl(var(--foreground) / 0.65)',
              };
              return isAnchor ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={`public-header-nav-item nav-link-hover ${mounted ? 'header-nav-item-animated' : ''}`}
                  style={sharedStyle}
                  {...sharedHover}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`public-header-nav-item nav-link-hover ${mounted ? 'header-nav-item-animated' : ''}`}
                  style={sharedStyle}
                  {...sharedHover}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA Actions ── */}
          <div className="public-header-actions">
            <Button
              variant="ghost"
              onClick={handleSignIn}
              className="hidden md:inline-flex"
              style={{ letterSpacing: '-0.015em', fontWeight: 450 }}
            >
              Sign In
            </Button>
            <Button
              variant="default"
              onClick={handleGetStarted}
              style={{ letterSpacing: '-0.015em' }}
            >
              Deal Box
            </Button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                transition: 'background 0.15s ease, transform 0.15s ease',
                border: '1px solid hsl(var(--border)/0.4)',
                background: 'hsl(var(--background)/0.6)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={18} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t mobile-menu-animated"
            style={{
              background: 'hsl(var(--background) / 0.92)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              borderColor: 'hsl(var(--border) / 0.3)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', gap: '0.25rem' }}>
              {navigationItems.map((item, i) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.925rem',
                    fontWeight: 450,
                    color: 'hsl(var(--foreground) / 0.7)',
                    textDecoration: 'none',
                    letterSpacing: '-0.015em',
                    transition: 'background 0.15s ease, color 0.15s ease',
                    animationDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'hsl(var(--accent) / 0.45)';
                    e.currentTarget.style.color = 'hsl(var(--foreground))';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = 'hsl(var(--foreground) / 0.7)';
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.925rem',
                  fontWeight: 450,
                  color: 'hsl(var(--foreground) / 0.7)',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  letterSpacing: '-0.015em',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'hsl(var(--accent) / 0.45)';
                  e.currentTarget.style.color = 'hsl(var(--foreground))';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = 'hsl(var(--foreground) / 0.7)';
                }}
              >
                Sign In
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default PublicHeader;
