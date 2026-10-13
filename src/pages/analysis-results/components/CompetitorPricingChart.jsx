import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CompetitorPricingChart = ({ pricingData }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm">
          <p className="text-sm font-semibold text-foreground mb-2">{payload?.[0]?.payload?.category}</p>
          <p className="text-xs text-muted-foreground">
            Your Price: <span className="font-semibold text-primary">₹{payload?.[0]?.value}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Competitor Avg: <span className="font-semibold text-accent">₹{payload?.[1]?.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-warm">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          Competitor Pricing Analysis
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Compare your pricing strategy with local competitors
        </p>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Competitor Pricing Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pricingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="category"
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', fill: 'var(--color-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Bar dataKey="yourPrice" fill="#18503F" name="Your Price" radius={[8, 8, 0, 0]} />
            <Bar dataKey="competitorAvg" fill="#BB8A46" name="Competitor Average" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Your Average</p>
            <p className="text-2xl font-bold text-primary">
              ₹{Math.round(pricingData?.reduce((acc, item) => acc + item?.yourPrice, 0) / pricingData?.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Market Average</p>
            <p className="text-2xl font-bold text-accent">
              ₹{Math.round(pricingData?.reduce((acc, item) => acc + item?.competitorAvg, 0) / pricingData?.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Price Advantage</p>
            <p className="text-2xl font-bold text-success">-12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorPricingChart;