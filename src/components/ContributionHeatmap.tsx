"use client";

import styles from "./ContributionHeatmap.module.css";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionHeatmapProps {
  weeks: ContributionWeek[];
}

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function ContributionHeatmap({ weeks }: ContributionHeatmapProps) {
  // Generate month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: weekIndex });
        lastMonth = month;
      }
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Day labels */}
        <div className={styles.dayLabels}>
          {DAYS.map((day, i) => (
            <span key={i} className={styles.dayLabel}>
              {day}
            </span>
          ))}
        </div>

        <div className={styles.gridSection}>
          {/* Month labels */}
          <div className={styles.monthLabels}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className={styles.monthLabel}
                style={{ gridColumn: m.col + 1 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.column}>
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`${styles.cell} ${styles[`level${getLevel(day.contributionCount)}`]}`}
                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`${styles.cell} ${styles[`level${level}`]} ${styles.legendCell}`}
          />
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
