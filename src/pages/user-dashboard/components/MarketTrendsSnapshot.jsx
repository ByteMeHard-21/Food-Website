import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const MarketTrendsSnapshot = () => {
  const monthlyTrends = [
    { month: 'Aug', demand: 65 },
    { month: 'Sep', demand: 72 },
    { month: 'Oct', demand: 78 },
    { month: 'Nov', demand: 85 },
    { month: 'Dec', demand: 92 },
    { month: 'Jan', demand: 88 }
  ];

  const cuisinePopularity = [
    { cuisine: 'North Indian', popularity: 85 },
    { cuisine: 'Fast Food', popularity: 78 },
    { cuisine: 'Cafe', popularity: 72 },
    { cuisine: 'Maharashtrian', popularity: 65 }
  ];

  const insights = [
    {
      icon: 'TrendingUp',
      title: 'Market Growth',
      value: '+12%',
      description: 'Compared to last quarter',
      color: 'text-success'
    },
    {
      icon: 'Users',
      title: 'New Restaurants',
      value: '47',
      description: 'Opened in Mumbai this month',
      color: 'text-primary'
    },
    {
      icon: 'DollarSign',
      title: 'Avg Investment',
      value: '₹42L',
      description: 'For successful ventures',
      color: 'text-accent'
    }
  ];

  return (
    <div id="market-trends" className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Mumbai Market Trends · Sample
        </h2>
        <Icon name="Activity" size={24} className="text-primary" />
      </div>
      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {insights?.map((insight, index) => (
          <div key={index} className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-background ${insight?.color}`}>
                <Icon name={insight?.icon} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{insight?.title}</p>
                <p className={`text-xl md:text-2xl font-bold ${insight?.color}`}>
                  {insight?.value}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{insight?.description}</p>
          </div>
        ))}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Demand Trend */}
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
            Monthly Demand Trend
          </h3>
          <div className="w-full h-48 md:h-56 lg:h-64" aria-label="Monthly demand trend line chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cuisine Popularity */}
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
            Cuisine Popularity Index
          </h3>
          <div className="w-full h-48 md:h-56 lg:h-64" aria-label="Cuisine popularity bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cuisinePopularity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="cuisine" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="popularity" 
                  fill="var(--color-accent)" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Seasonal Note */}
      <div className="mt-6 bg-accent bg-opacity-10 border border-accent rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Monsoon Season Impact
            </p>
            <p className="text-xs text-muted-foreground">
              Historical data shows 15-20% revenue fluctuation during monsoon months (June-September). Consider this in your planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsSnapshot;