import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestAttempt {
  id: string;
  score: number;
}

interface ScoreDistributionChartProps {
  attempts: TestAttempt[];
}

export function ScoreDistributionChart({ attempts }: ScoreDistributionChartProps) {
  const chartData = useMemo(() => {
    const ranges = [
      { range: '0-20%', min: 0, max: 20, count: 0, color: 'hsl(0, 84%, 60%)' },
      { range: '21-40%', min: 21, max: 40, count: 0, color: 'hsl(0, 72%, 55%)' },
      { range: '41-60%', min: 41, max: 60, count: 0, color: 'hsl(38, 92%, 50%)' },
      { range: '61-80%', min: 61, max: 80, count: 0, color: 'hsl(90, 60%, 45%)' },
      { range: '81-100%', min: 81, max: 100, count: 0, color: 'hsl(142, 71%, 45%)' },
    ];

    attempts.forEach((attempt) => {
      const rangeIndex = ranges.findIndex(
        (r) => attempt.score >= r.min && attempt.score <= r.max
      );
      if (rangeIndex !== -1) {
        ranges[rangeIndex].count += 1;
      }
    });

    return ranges;
  }, [attempts]);

  const hasData = chartData.some(d => d.count > 0);

  if (!hasData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No score data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="range" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [value, 'Attempts']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
