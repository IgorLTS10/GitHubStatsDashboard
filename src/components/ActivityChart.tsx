"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import styles from "./ActivityChart.module.css";

interface MonthlyData {
  month: string;
  label: string;
  contributions: number;
}

interface ActivityChartProps {
  data: MonthlyData[];
}

interface TooltipPayloadItem {
  value: number;
  payload: MonthlyData;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipMonth}>
          {payload[0].payload.label}
        </span>
        <span className={styles.tooltipValue}>
          {payload[0].value.toLocaleString()} contributions
        </span>
      </div>
    );
  }
  return null;
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#5a5a6e", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#5a5a6e", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="contributions"
            stroke="url(#strokeGradient)"
            strokeWidth={2.5}
            fill="url(#activityGradient)"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
