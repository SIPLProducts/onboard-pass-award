import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
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
      };
    });

    // Count activity from progress updates and test attempts
    courses.forEach((course) => {
      // Check progress updates
      if (course.progress?.updated_at) {
        const progressDate = startOfDay(parseISO(course.progress.updated_at));
        const dayIndex = last7Days.findIndex(
          (d) => d.date.getTime() === progressDate.getTime()
        );
        if (dayIndex !== -1) {
          last7Days[dayIndex].activity += 1;
        }
      }

      // Check test attempts
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

      // Check certificates
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

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: '0.5s' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Learning Activity</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-primary" />
            Activity
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-success" />
            Completions
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {totalActivity === 0 && totalCompletions === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No learning activity yet. Start a course to see your progress!
            </p>
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="dateStr"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="mb-2 font-medium">{data.fullDate}</p>
                          <p className="text-sm text-primary">
                            Activity: {data.activity}
                          </p>
                          <p className="text-sm text-success">
                            Completions: {data.completions}
                          </p>
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
                  strokeWidth={2}
                  fill="url(#activityGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fill="url(#completionsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningActivityChart;
