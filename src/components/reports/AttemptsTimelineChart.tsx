import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfDay } from 'date-fns';

interface TestAttempt {
  id: string;
  completed_at: string;
  passed: boolean;
}

interface AttemptsTimelineChartProps {
  attempts: TestAttempt[];
}

export function AttemptsTimelineChart({ attempts }: AttemptsTimelineChartProps) {
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      return {
        date: format(date, 'MMM d'),
        fullDate: date,
        attempts: 0,
        passed: 0,
      };
    });

    attempts.forEach((attempt) => {
      const attemptDate = startOfDay(new Date(attempt.completed_at));
      const dayIndex = days.findIndex(
        (d) => format(d.fullDate, 'yyyy-MM-dd') === format(attemptDate, 'yyyy-MM-dd')
      );
      if (dayIndex !== -1) {
        days[dayIndex].attempts += 1;
        if (attempt.passed) {
          days[dayIndex].passed += 1;
        }
      }
    });

    return days.map(({ fullDate, ...rest }) => rest);
  }, [attempts]);

  const hasData = chartData.some(d => d.attempts > 0);

  if (!hasData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Attempts Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No activity in the last 7 days</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Attempts Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="attemptsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 32%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168, 76%, 32%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="attempts"
              stroke="hsl(168, 76%, 32%)"
              strokeWidth={2}
              fill="url(#attemptsGradient)"
              name="Total Attempts"
            />
            <Area
              type="monotone"
              dataKey="passed"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fill="url(#passedGradient)"
              name="Passed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
