"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface RevenueByInstituteChartProps {
  data: {
    name: string;
    Received: number;
    Pending: number;
  }[];
  dk: boolean;
  mt: string;
}

export function RevenueByInstituteBarChart({
  data,
  dk,
  mt,
}: RevenueByInstituteChartProps) {
  if (data.length === 0) {
    return (
      <p className={`text-sm ${mt} text-center py-8`}>No data available</p>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={dk ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tick={(props: any) => {
              const { x = 0, y = 0, payload } = props;
              const words = String(payload?.value || "").split(" ");
              const line1 = words
                .slice(0, Math.ceil(words.length / 2))
                .join(" ");
              const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
              const textColor = dk ? "#f1f5f9" : "#000000";
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={10}
                    dy={0}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={10}
                    fontWeight={600}
                  >
                    {line1}
                  </text>
                  {line2 && (
                    <text
                      x={0}
                      y={10}
                      dy={12}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={10}
                      fontWeight={600}
                    >
                      {line2}
                    </text>
                  )}
                </g>
              );
            }}
            axisLine={{
              stroke: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
            }}
            tickLine={false}
            interval={0}
            height={50}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fontWeight: 600,
              fill: dk ? "#f1f5f9" : "#000000",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(val: unknown, name: unknown) => [
              `₹${Number(val).toLocaleString("en-IN")}`,
              String(name),
            ]}
            contentStyle={{
              backgroundColor: dk ? "#0c1a2e" : "#ffffff",
              borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
              borderRadius: "12px",
              color: dk ? "#ffffff" : "#000000",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{
              fontSize: 10,
              fontWeight: 600,
              paddingTop: 8,
              color: dk ? "#ffffff" : "#000000",
            }}
          />
          <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CollectionDonutChartProps {
  donutData: {
    name: string;
    value: number;
    color: string;
  }[];
  totalAmount: number;
  dk: boolean;
}

export function CollectionDonutChart({
  donutData,
  totalAmount,
  dk,
}: CollectionDonutChartProps) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={donutData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={68}
            paddingAngle={4}
            dataKey="value"
          >
            {donutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: unknown) => [
              `₹${Number(val).toLocaleString("en-IN")}`,
              "Amount",
            ]}
            contentStyle={{
              backgroundColor: dk ? "#0c1a2e" : "#ffffff",
              borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
              borderRadius: "12px",
              color: dk ? "#ffffff" : "#000000",
              fontWeight: 600,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase font-bold text-black dark:text-white opacity-70">
          Total
        </span>
        <span className="text-xs font-black text-black dark:text-white">
          ₹{(totalAmount / 1000).toFixed(0)}K
        </span>
      </div>
    </div>
  );
}
