import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, Activity, Award, Target, Flame } from 'lucide-react';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

interface CourseWithProgress {
  id: string;
  title: string;
  progress?: {
    video_progress: number;
    video_completed: boolean;
    updated_at: string;
  } | null;
  latestAttempt?: {
    completed_at: string;
    score: number;
    passed: boolean;
  } | null;
  certificate?: {
    issued_at: string;
  } | null;
}

interface LearningActivityChartProps {
  courses: CourseWithProgress[];
}

const LearningActivityChart = ({ courses }: LearningActivityChartProps) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date,
        dateStr: format(date, 'EEE'),
        fullDate: format(date, 'MMM dd'),
        activity: 0,
        completions: 0,
        isToday: i === 6,
      };
    });

    courses.forEach((course) => {
      if (course.progress?.updated_at) {
        const progressDate = startOfDay(parseISO(course.progress.updated_at));
        const dayIndex = last7Days.findIndex(
          (d) => d.date.getTime() === progressDate.getTime()
        );
        if (dayIndex !== -1) {
          last7Days[dayIndex].activity += 1;
        }
      }

      if (course.latestAttempt?.completed_at) {
        const attemptDate = startOfDay(parseISO(course.latestAttempt.completed_at));
        const dayIndex = last7Days.findIndex(
          (d) => d.date.getTime() === attemptDate.getTime()
        );
        if (dayIndex !== -1) {
          last7Days[dayIndex].activity += 2;
          if (course.latestAttempt.passed) {
            last7Days[dayIndex].completions += 1;
          }
        }
      }

      if (course.certificate?.issued_at) {
        const certDate = startOfDay(parseISO(course.certificate.issued_at));
        const dayIndex = last7Days.findIndex(
          (d) => d.date.getTime() === certDate.getTime()
        );
        if (dayIndex !== -1) {
          last7Days[dayIndex].completions += 1;
        }
      }
    });

    return last7Days;
  }, [courses]);

  const totalActivity = chartData.reduce((sum, d) => sum + d.activity, 0);
  const totalCompletions = chartData.reduce((sum, d) => sum + d.completions, 0);
  const activeDays = chartData.filter((d) => d.activity > 0).length;
  const maxActivity = Math.max(...chartData.map((d) => d.activity), 1);

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].activity > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [chartData]);

  return (
    <Card className="animate-slide-up border-0 shadow-lg overflow-hidden" style={{ animationDelay: '0.5s' }}>
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Learning Activity
            </CardTitle>
            <CardDescription>Your progress over the last 7 days</CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Activity</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="text-xs font-medium text-success">Completions</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalActivity}</p>
              <p className="text-xs text-muted-foreground">Total Activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Award className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCompletions}</p>
              <p className="text-xs text-muted-foreground">Completions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Target className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeDays}</p>
              <p className="text-xs text-muted-foreground">Active Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </div>

        {totalActivity === 0 && totalCompletions === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No learning activity yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Start a course to see your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Area Chart */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="completionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border bg-card p-4 shadow-xl">
                            <p className="mb-2 font-semibold text-foreground">{data.fullDate}</p>
                            <div className="space-y-1">
                              <p className="text-sm flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-muted-foreground">Activity:</span>
                                <span className="font-medium text-foreground">{data.activity}</span>
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-success" />
                                <span className="text-muted-foreground">Completions:</span>
                                <span className="font-medium text-foreground">{data.completions}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activity"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#activityGradient)"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    fill="url(#completionsGradient)"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Activity Bars */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">Daily Breakdown</p>
              <div className="h-[80px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis
                      dataKey="dateStr"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-sm">
                              <span className="font-medium">{data.fullDate}: </span>
                              <span className="text-primary">{data.activity} activities</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="activity" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.isToday
                              ? 'hsl(var(--primary))'
                              : entry.activity > 0
                              ? 'hsl(var(--primary) / 0.5)'
                              : 'hsl(var(--muted))'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningActivityChart;
