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
} from "recharts";

interface InstituteRevenueChartProps {
  instituteGroups: {
    instituteName: string;
    amountReceived: number;
    pendingAmount: number;
  }[];
  dk: boolean;
  mt: string;
}

export default function InstituteRevenueChart({
  instituteGroups,
  dk,
  mt,
}: InstituteRevenueChartProps) {
  if (instituteGroups.length === 0) {
    return (
      <p className={`text-sm ${mt} text-center py-8`}>No data available</p>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={instituteGroups.map((g) => {
            const shortName = g.instituteName
              .replace("Maritime Training Institute", "MTI")
              .replace("Training Institute", "Inst.")
              .replace("Maritime Center", "Maritime");
            const displayName =
              shortName.length > 22 ? shortName.slice(0, 20) + "…" : shortName;

            return {
              name: displayName,
              fullName: g.instituteName,
              Received: g.amountReceived,
              Pending: g.pendingAmount,
            };
          })}
          barGap={6}
          barCategoryGap="25%"
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={dk ? "rgba(255,255,255,0.06)" : "#e2e8f0"}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 11,
              fontWeight: "600",
              fill: dk ? "#f1f5f9" : "#1e293b",
            }}
            axisLine={{
              stroke: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
            }}
            tickLine={false}
            interval={0}
            angle={0}
            textAnchor="middle"
            dy={10}
          />
          <YAxis
            tick={{
              fontSize: 11,
              fontWeight: "500",
              fill: dk ? "#cbd5e1" : "#475569",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(val: any, name: any) => [
              `₹${Number(val ?? 0).toLocaleString("en-IN")}`,
              String(name),
            ]}
            labelFormatter={(_label, payload) => {
              if (
                payload &&
                payload.length > 0 &&
                payload[0].payload?.fullName
              ) {
                return payload[0].payload.fullName;
              }
              return _label;
            }}
            contentStyle={{
              backgroundColor: dk ? "#0c1a2e" : "#ffffff",
              borderColor: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
              borderRadius: "12px",
              color: dk ? "#ffffff" : "#0f172a",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{
              fontSize: 11,
              fontWeight: 500,
              paddingTop: 12,
            }}
          />
          <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
