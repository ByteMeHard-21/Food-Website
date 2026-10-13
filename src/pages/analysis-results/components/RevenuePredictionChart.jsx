import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenuePredictionChart = ({ revenueData, monsoonData }) => {
  const [showMonsoon, setShowMonsoon] = useState(false);

  const displayData = showMonsoon ? monsoonData : revenueData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm">
          <p className="text-sm font-semibold text-foreground mb-2">{payload?.[0]?.payload?.month}</p>
          <p className="text-xs text-muted-foreground">
            Revenue: <span className="font-semibold text-primary">₹{payload?.[0]?.value?.toLocaleString('en-IN')}</span>
          </p>
          {showMonsoon && (
            <p className="text-xs text-warning mt-1">
              Monsoon impact included
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-warm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            12-Month Revenue Prediction
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered financial forecasting with seasonal variations
          </p>
        </div>

        <button
          onClick={() => setShowMonsoon(!showMonsoon)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
            showMonsoon
              ? 'bg-warning text-white shadow-warm-sm'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="CloudRain" size={16} />
          <span>Monsoon Impact</span>
        </button>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Revenue Prediction Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', fill: 'var(--color-foreground)' }}
              tickFormatter={(value) => `₹${(value / 100000)?.toFixed(1)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#18503F"
              strokeWidth={3}
              dot={{ fill: '#18503F', r: 4 }}
              activeDot={{ r: 6 }}
              name="Projected Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">First Month</p>
            <p className="text-lg font-bold text-foreground">
              ₹{(displayData?.[0]?.revenue / 100000)?.toFixed(1)}L
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Peak Month</p>
            <p className="text-lg font-bold text-success">
              ₹{(Math.max(...displayData?.map(d => d?.revenue)) / 100000)?.toFixed(1)}L
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Annual Total</p>
            <p className="text-lg font-bold text-primary">
              ₹{(displayData?.reduce((acc, d) => acc + d?.revenue, 0) / 10000000)?.toFixed(2)}Cr
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
            <p className="text-lg font-bold text-accent">+18%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePredictionChart;