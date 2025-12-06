import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2 } from 'lucide-react';

interface TestAttempt {
  id: string;
  passed: boolean;
  score: number;
  profile?: {
    department?: string;
  };
}

interface DepartmentPerformanceChartProps {
  attempts: TestAttempt[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const DepartmentPerformanceChart = ({ attempts }: DepartmentPerformanceChartProps) => {
  const chartData = useMemo(() => {
    const departmentStats: Record<string, { total: number; passed: number; totalScore: number }> = {};

    attempts.forEach((attempt) => {
      const dept = attempt.profile?.department || 'Unknown';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, passed: 0, totalScore: 0 };
      }
      departmentStats[dept].total += 1;
      departmentStats[dept].totalScore += attempt.score;
      if (attempt.passed) {
        departmentStats[dept].passed += 1;
      }
    });

    return Object.entries(departmentStats)
      .map(([department, stats]) => ({
        department,
        passRate: Math.round((stats.passed / stats.total) * 100),
        avgScore: Math.round(stats.totalScore / stats.total),
        attempts: stats.total,
      }))
      .sort((a, b) => b.passRate - a.passRate);
  }, [attempts]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Performance
          </CardTitle>
          <CardDescription>Pass rate by department</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No department data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Department Performance
        </CardTitle>
        <CardDescription>Pass rate and average score by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis
              dataKey="department"
              type="category"
              width={100}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === 'passRate' ? 'Pass Rate' : 'Avg Score',
              ]}
            />
            <Bar dataKey="passRate" name="passRate" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
