"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface DocumentVerificationChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  isDark: boolean;
}

export default function DocumentVerificationChart({
  data,
  colors,
  isDark,
}: DocumentVerificationChartProps) {
  return (
    <div className="h-40 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={60}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0c1a2e" : "#ffffff",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
              color: isDark ? "#fff" : "#000",
              fontSize: 11,
              borderRadius: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
