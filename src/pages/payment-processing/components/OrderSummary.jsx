import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ selectedPlan, billingCycle }) => {
  const planDetails = {
    monthly: {
      price: 999,
      duration: 'month',
      savings: 0
    },
    yearly: {
      price: 9990,
      duration: 'year',
      savings: 2998
    }
  };

  const plan = planDetails?.[billingCycle];
  const gst = Math.round(plan?.price * 0.18);
  const total = plan?.price + gst;

  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-warm h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Receipt" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Order Summary</h2>
      </div>
      <div className="space-y-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-foreground">OriginBite Pro</p>
            <p className="text-sm text-muted-foreground capitalize">{billingCycle} Subscription</p>
          </div>
          <p className="font-semibold text-foreground">{formatIndianCurrency(plan?.price)}</p>
        </div>

        {billingCycle === 'yearly' && (
          <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-2 rounded-lg">
            <Icon name="Tag" size={16} />
            <span className="text-sm font-medium">Save {formatIndianCurrency(plan?.savings)} with yearly plan</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatIndianCurrency(plan?.price)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="text-foreground">{formatIndianCurrency(gst)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-foreground">Total Amount</span>
        <span className="text-2xl font-bold text-primary">{formatIndianCurrency(total)}</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Icon name="CheckCircle2" size={16} className="text-success mt-0.5 flex-shrink-0" />
          <span>Unlimited AI-powered restaurant analysis</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Icon name="CheckCircle2" size={16} className="text-success mt-0.5 flex-shrink-0" />
          <span>Advanced revenue prediction models</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Icon name="CheckCircle2" size={16} className="text-success mt-0.5 flex-shrink-0" />
          <span>Competitor radar with real-time updates</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Icon name="CheckCircle2" size={16} className="text-success mt-0.5 flex-shrink-0" />
          <span>Priority customer support</span>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Secure payment powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;