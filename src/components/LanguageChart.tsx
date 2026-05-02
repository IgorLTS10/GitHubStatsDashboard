"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styles from "./LanguageChart.module.css";

interface Language {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface LanguageChartProps {
  languages: Language[];
}

interface TooltipPayloadItem {
  payload: Language;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <span
          className={styles.tooltipDot}
          style={{ background: data.color }}
        />
        <span className={styles.tooltipName}>{data.name}</span>
        <span className={styles.tooltipValue}>{data.percentage}%</span>
      </div>
    );
  }
  return null;
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const top8 = languages.slice(0, 8);

  return (
    <div className={styles.wrapper}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={top8}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
              dataKey="percentage"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {top8.map((lang, index) => (
                <Cell key={index} fill={lang.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerLabel}>
          <span className={styles.centerNumber}>{languages.length}</span>
          <span className={styles.centerText}>Languages</span>
        </div>
      </div>

      <div className={styles.legend}>
        {top8.map((lang, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: lang.color }}
            />
            <span className={styles.legendName}>{lang.name}</span>
            <span className={styles.legendPercent}>{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
