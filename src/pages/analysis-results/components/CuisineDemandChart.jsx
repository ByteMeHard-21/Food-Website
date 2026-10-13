import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#18503F", "#BB8A46", "#E5EBDD", "#A8A29E", "#57534E", "#2f2f2f"];

const CuisineDemandChart = ({ demandData }) => {
  const safeData = useMemo(() => (Array.isArray(demandData) ? demandData : []), [demandData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm">
          <p className="text-sm font-semibold text-foreground">{payload?.[0]?.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload?.[0]?.value}% demand share
          </p>
        </div>
      );
    }
    return null;
  };

  const hasData = safeData.length > 0 && safeData.some((d) => Number(d.value) > 0);

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-warm">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          Cuisine Demand Distribution
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Market preference analysis for your selected area
        </p>
      </div>

      {!hasData ? (
        <div className="bg-muted rounded-lg p-6 text-sm text-muted-foreground">
          No cuisine demand data available for this selection.
        </div>
      ) : (
        <>
          <div className="w-full h-64 md:h-80" aria-label="Cuisine Demand Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {safeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={42}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {safeData.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <p className="text-xs font-medium text-foreground">{item?.name}</p>
                  <p className="text-lg font-bold text-primary">{item?.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CuisineDemandChart;
