import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { getReports } from '../../../lib/storage';

const UserStatistics = ({ subscriptionTier = 'Free' }) => {
  const navigate = useNavigate();

  const reports = getReports();
  const best = [...reports].sort((a,b)=>b.analysisResult.successRate-a.analysisResult.successRate)[0];
  const avg = reports.length ? Math.round(reports.reduce((n,r)=>n+r.analysisResult.successRate,0)/reports.length) : 0;
  const stats = [
    {
      icon: 'BarChart3',
      label: 'Total Analyses',
      value: String(reports.length),
      description: 'Saved on this device',
      color: 'text-primary'
    },
    {
      icon: 'Target',
      label: 'Avg Planning Score',
      value: avg + '/100',
      description: 'Across all analyses',
      color: 'text-success'
    },
    {
      icon: 'TrendingUp',
      label: 'Best Location',
      value: best?.analysisInput.location || '—',
      description: best ? best.analysisResult.successRate + '/100 planning score' : 'Run your first analysis',
      color: 'text-accent'
    }
  ];

  const handleUpgrade = () => {
    navigate('/subscription-tiers');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Your Statistics
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          subscriptionTier === 'Pro' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
        }`}>
          {subscriptionTier} Plan
        </div>
      </div>
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-background ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{stat?.label}</p>
                <p className={`text-xl md:text-2xl font-bold ${stat?.color}`}>
                  {stat?.value}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        ))}
      </div>
      {/* Upgrade Prompt for Free Users */}
      {subscriptionTier === 'Free' && (
        <div className="bg-gradient-to-r from-primary to-[#28765B] rounded-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Sparkles" size={20} />
                <h3 className="text-lg md:text-xl font-semibold">
                  Unlock Pro Features
                </h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Get unlimited analyses, advanced AI insights, competitor radar, and priority support for just ₹999/month
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={16} />
                  <span>Unlimited location analyses</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={16} />
                  <span>Advanced revenue predictions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={16} />
                  <span>Competitor intelligence reports</span>
                </li>
              </ul>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleUpgrade}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full md:w-auto"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      )}
      {/* Pro User Benefits */}
      {subscriptionTier === 'Pro' && (
        <div className="bg-success bg-opacity-10 border border-success rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Pro Member Benefits Active
              </p>
              <p className="text-xs text-muted-foreground">
                You have unlimited access to all premium features including advanced analytics, competitor insights, and priority support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatistics;