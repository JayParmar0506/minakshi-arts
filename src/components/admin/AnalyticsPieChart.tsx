"use client";

import React, { useState } from "react";
import { Sparkles, PieChart as PieIcon, Layers, TrendingUp } from "lucide-react";

interface CategorySalesData {
  category: string;
  unitsSold: number;
  revenue: number;
}

interface AnalyticsPieChartProps {
  data: CategorySalesData[];
  totalSoldUnits: number;
}

export const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({ data, totalSoldUnits }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const colors = [
    { fill: "#F59E0B", border: "#FBBF24", glow: "rgba(245, 158, 11, 0.4)" }, // Amber
    { fill: "#D4AF37", border: "#F6DF89", glow: "rgba(212, 175, 55, 0.4)" }, // Gold
    { fill: "#EA580C", border: "#F97316", glow: "rgba(234, 88, 12, 0.4)" },  // Terracotta
    { fill: "#EAB308", border: "#FDE047", glow: "rgba(234, 179, 8, 0.4)" },  // Golden Yellow
    { fill: "#C2410C", border: "#EA580C", glow: "rgba(194, 65, 12, 0.4)" },  // Dark Terracotta
  ];

  const totalUnits = totalSoldUnits || data.reduce((sum, d) => sum + d.unitsSold, 0) || 1;

  // Calculate SVG arc paths
  let cumulativeAngle = 0;

  const slicePaths = data.map((item, idx) => {
    const percentage = item.unitsSold / totalUnits;
    const angle = percentage * 360;

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // Convert polar coordinates to Cartesian
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const radius = 100;
    const innerRadius = 55;

    const x1 = 120 + radius * Math.cos(startRad);
    const y1 = 120 + radius * Math.sin(startRad);
    const x2 = 120 + radius * Math.cos(endRad);
    const y2 = 120 + radius * Math.sin(endRad);

    const ix1 = 120 + innerRadius * Math.cos(endRad);
    const iy1 = 120 + innerRadius * Math.sin(endRad);
    const ix2 = 120 + innerRadius * Math.cos(startRad);
    const iy2 = 120 + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // SVG path string for donut slice
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}`,
      `Z`,
    ].join(" ");

    return {
      ...item,
      pathData,
      percentage: (percentage * 100).toFixed(1),
      color: colors[idx % colors.length],
    };
  });

  const activeSlice = hoveredIdx !== null ? slicePaths[hoveredIdx] : null;

  return (
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-xl font-bold text-sand-50">Sales Analytics by Category</h3>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time Metrics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 240 240" className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
              {slicePaths.map((slice, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <path
                    key={slice.category}
                    d={slice.pathData}
                    fill={slice.color.fill}
                    stroke={slice.color.border}
                    strokeWidth={isHovered ? 3 : 1}
                    className="transition-all duration-300 cursor-pointer hover:opacity-90"
                    style={{
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "120px 120px",
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Donut Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeSlice ? (
                <>
                  <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
                    {activeSlice.category}
                  </span>
                  <span className="font-serif text-2xl font-bold text-sand-50">
                    {activeSlice.percentage}%
                  </span>
                  <span className="text-[10px] text-sand-300 font-light">
                    {activeSlice.unitsSold} units sold
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-gold-400 mb-1 animate-pulse" />
                  <span className="font-serif text-2xl font-bold text-gold-400">
                    {totalUnits}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-sand-300">
                    Total Units Sold
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="md:col-span-6 space-y-3">
          <span className="text-xs uppercase tracking-widest text-sand-400 font-bold block mb-2">
            Category Breakdown
          </span>

          {slicePaths.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={slice.category}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isHovered
                    ? "bg-gold-500/15 border-gold-400 scale-[1.02]"
                    : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-md"
                    style={{ backgroundColor: slice.color.fill }}
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sand-100 text-xs">{slice.category}</h4>
                    <span className="text-[11px] text-sand-400">{slice.unitsSold} Units Sold</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-gold-400 text-xs block">
                    ₹{slice.revenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-sand-300 font-semibold">{slice.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
