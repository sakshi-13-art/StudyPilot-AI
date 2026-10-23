import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { StudySession } from '../types';
import { formatDateOffset } from '../utils/sampleData';
import { CheckCircle2, XCircle, TrendingUp, Info } from 'lucide-react';

interface DashboardWidgetProps {
  sessions: StudySession[];
  className?: string;
}

interface DayData {
  date: string;
  shortLabel: string;
  fullDateLabel: string;
  isToday: boolean;
  completed: number;
  missed: number;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ sessions, className = '' }) => {
  // Define the consistent 7-day reporting window: from 6 days ago up to and including Today (Day 0)
  const chartData = useMemo<DayData[]>(() => {
    const days: DayData[] = [];

    for (let offset = -6; offset <= 0; offset++) {
      const dateStr = formatDateOffset(offset);
      const dateObj = new Date(dateStr + 'T00:00:00');
      const isToday = offset === 0;

      const weekdayShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDateLabel = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Filter sessions matching this exact date with completed or missed status
      const completedCount = sessions.filter(
        (s) => s.date === dateStr && s.status === 'completed'
      ).length;

      const missedCount = sessions.filter(
        (s) => s.date === dateStr && s.status === 'missed'
      ).length;

      days.push({
        date: dateStr,
        shortLabel: isToday ? `Today` : `${weekdayShort} ${dateObj.getDate()}`,
        fullDateLabel: isToday ? `${fullDateLabel} (Today)` : fullDateLabel,
        isToday,
        completed: completedCount,
        missed: missedCount,
      });
    }

    return days;
  }, [sessions]);

  // Aggregate summary metrics across the 7-day reporting window
  const { totalCompleted, totalMissed, evaluatedCount, completionRate } = useMemo(() => {
    let completed = 0;
    let missed = 0;

    chartData.forEach((day) => {
      completed += day.completed;
      missed += day.missed;
    });

    const evaluated = completed + missed;
    // Exclude pending/scheduled sessions from the completion-rate denominator:
    // completionRate = (completed / (completed + missed)) * 100
    const rate = evaluated > 0 ? Math.round((completed / evaluated) * 100) : null;

    return {
      totalCompleted: completed,
      totalMissed: missed,
      evaluatedCount: evaluated,
      completionRate: rate,
    };
  }, [chartData]);

  // Determine maximum sessions on any single day to format Y-axis nicely
  const maxDayCount = useMemo(() => {
    let max = 0;
    chartData.forEach((d) => {
      if (d.completed > max) max = d.completed;
      if (d.missed > max) max = d.missed;
    });
    return Math.max(3, max + 1);
  }, [chartData]);

  return (
    <section
      aria-label="Study Efficiency Trends"
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs ${className}`}
    >
      {/* Widget Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Study Efficiency Trends</h3>
            <span className="text-[11px] text-slate-400 font-medium">· Last 7 Days</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compares completed vs. missed study sessions to monitor habit consistency and schedule adherence.
          </p>
        </div>

        {/* Date Window Badge */}
        <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shrink-0 self-start sm:self-auto font-mono tabular-nums">
          <span>{chartData[0]?.date}</span>
          <span className="mx-1.5 text-slate-400">→</span>
          <span className="font-semibold text-slate-700">{chartData[chartData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white">
        {/* Completed */}
        <div className="p-4 text-center sm:text-left sm:px-6">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono tabular-nums">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalCompleted === 1 ? '1 session finished' : `${totalCompleted} sessions finished`}
          </div>
        </div>

        {/* Missed */}
        <div className="p-4 text-center sm:text-left sm:px-6">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Missed</span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1 font-mono tabular-nums">
            {totalMissed}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalMissed === 1 ? '1 session disrupted' : `${totalMissed} sessions disrupted`}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 text-center sm:text-left sm:px-6">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {completionRate !== null ? (
              <span>
                {completionRate}
                <span className="text-base font-normal text-slate-500">%</span>
              </span>
            ) : (
              <span className="text-slate-400 text-lg font-normal">N/A</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {completionRate !== null
              ? `${totalCompleted} of ${evaluatedCount} logged`
              : 'No resolved sessions yet'}
          </div>
        </div>
      </div>

      {/* Recharts Chart Area */}
      <div className="p-4 sm:p-6 space-y-4">
        {evaluatedCount === 0 ? (
          /* Useful Empty State */
          <div className="py-10 text-center space-y-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-xs font-semibold text-slate-700">
              No historical completed or missed sessions logged in the last 7 days
            </div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
              As you work through your study timetable, marking study blocks as <strong>Complete</strong> or <strong>Missed</strong> in the timeline below will immediately render your performance trends here.
            </p>
          </div>
        ) : (
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shortLabel"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, maxDayCount]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as DayData;
                      const dayCompleted = data.completed;
                      const dayMissed = data.missed;
                      const dayTotal = dayCompleted + dayMissed;
                      const dayRate =
                        dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : null;

                      return (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5 min-w-[170px]">
                          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                            {data.fullDateLabel}
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                              Completed:
                            </span>
                            <span className="font-mono font-bold text-slate-900">{dayCompleted}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                              Missed:
                            </span>
                            <span className="font-mono font-bold text-slate-900">{dayMissed}</span>
                          </div>
                          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Success Rate:</span>
                            <span className="font-bold text-indigo-600 font-mono">
                              {dayRate !== null ? `${dayRate}%` : 'No logs'}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#475569' }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="missed"
                  name="Missed"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Footer info note */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
          <span>Formula: Completion Rate = Completed / (Completed + Missed) × 100</span>
          <span>Pending/scheduled sessions excluded from denominator</span>
        </div>
      </div>
    </section>
  );
};
