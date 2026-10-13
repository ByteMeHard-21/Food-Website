import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedSidebar from '../../components/ui/AuthenticatedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import UserContextMenu from '../../components/ui/UserContextMenu';
import BillingToggle from './components/BillingToggle';
import PlanCard from './components/PlanCard';
import FeatureComparison from './components/FeatureComparison';
import SubscriptionFAQ from './components/SubscriptionFAQ';
import TrustSignals from './components/TrustSignals';
import Icon from '../../components/AppIcon';

import { getPlan, writeLocal } from '../../lib/storage';

const SubscriptionTiers = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(() => getPlan().tier.toLowerCase());

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for exploring Mumbai\'s restaurant market',
      monthlyPrice: 0,
      yearlyPrice: 0,
      isPro: false,
      features: [
        { 
          name: '3 location analyses per month', 
          description: 'Analyze potential restaurant locations in Mumbai',
          included: true 
        },
        { 
          name: 'Basic revenue predictions (6 months)', 
          description: 'Get fundamental revenue forecasts',
          included: true 
        },
        { 
          name: 'Cuisine demand analysis', 
          description: 'Understand what cuisines work in your area',
          included: true 
        },
        { 
          name: 'Weekly market trends', 
          description: 'Stay updated with Mumbai food market',
          included: true 
        },
        { 
          name: 'Email support (48h response)', 
          description: 'Get help when you need it',
          included: true 
        },
        { 
          name: 'Competitor radar', 
          description: 'Advanced competitor analysis',
          included: false 
        },
        { 
          name: 'PDF & CSV exports', 
          description: 'Download professional reports',
          included: false 
        },
        { 
          name: 'Menu suggestions', 
          description: 'AI-powered menu recommendations',
          included: false 
        }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious restaurateurs ready to dominate Mumbai',
      monthlyPrice: 999,
      yearlyPrice: 9590,
      isPro: true,
      features: [
        { 
          name: 'Unlimited location analyses', 
          description: 'Analyze as many locations as you need',
          included: true 
        },
        { 
          name: 'Advanced revenue predictions (12 months)', 
          description: 'Detailed year-long revenue forecasts',
          included: true 
        },
        { 
          name: 'Competitor radar with pricing', 
          description: 'See exactly what competitors charge',
          included: true 
        },
        { 
          name: 'AI menu suggestions', 
          description: 'Get dish recommendations with revenue impact',
          included: true 
        },
        { 
          name: 'Disaster simulation (monsoon impact)', 
          description: 'Plan for seasonal revenue fluctuations',
          included: true 
        },
        { 
          name: 'PDF & CSV exports', 
          description: 'Professional reports for investors',
          included: true 
        },
        { 
          name: 'Real-time market updates', 
          description: 'Instant notifications on market changes',
          included: true 
        },
        { 
          name: 'Priority support (24h response)', 
          description: 'Get faster help with chat & phone',
          included: true 
        }
      ]
    }
  ];

  const handleUpgrade = (plan) => {
    if (!plan?.isPro) { writeLocal('subscription', { tier: 'Free' }); setCurrentPlan('free'); }
    if (plan?.isPro) {
      navigate('/payment-processing', { state: { plan, isYearly } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedSidebar />
      <div className="lg:ml-[280px] min-h-screen">
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-warm-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Subscription Plans
              </h1>
              <NavigationBreadcrumbs />
            </div>
            <UserContextMenu />
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Choose Your Plan · Test Mode
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock powerful AI-driven insights to dominate Mumbai's competitive restaurant market
              </p>
            </div>

            <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {plans?.map((plan) => (
                <PlanCard
                  key={plan?.id}
                  plan={plan}
                  isYearly={isYearly}
                  onUpgrade={handleUpgrade}
                  isCurrentPlan={currentPlan === plan?.id}
                />
              ))}
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" size={32} color="#FFFFFF" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    7-Day Money-Back Guarantee
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Try Pro risk-free. If you're not satisfied within the first week, we'll refund your full payment—no questions asked.
                  </p>
                </div>
              </div>
            </div>

            <FeatureComparison />

            <TrustSignals />

            <SubscriptionFAQ />

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-8 md:p-12 text-center">
              <Icon name="HelpCircle" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Still Have Questions?
              </h3>
              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our team is here to help you choose the right plan for your restaurant business in Mumbai.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/help"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-250"
                >
                  <Icon name="Mail" size={20} />
                  <span>Email Support</span>
                </a>
                <a 
                  href="/help"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Phone" size={20} />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-border bg-card mt-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date()?.getFullYear()} OriginBite. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-250">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-250">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-250">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SubscriptionTiers;