import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseStats {
  course: { id: string; title: string };
  totalAttempts: number;
  passRate: number;
  averageScore: number;
  completions: number;
}

interface CoursePerformanceChartProps {
  courseStats: CourseStats[];
}

export function CoursePerformanceChart({ courseStats }: CoursePerformanceChartProps) {
  const data = courseStats
    .filter(cs => cs.totalAttempts > 0)
    .slice(0, 6)
    .map(cs => ({
      name: cs.course.title.length > 15 ? cs.course.title.substring(0, 15) + '...' : cs.course.title,
      fullName: cs.course.title,
      passRate: cs.passRate,
      avgScore: cs.averageScore,
    }));

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Course Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No course data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Course Performance (Pass Rate %)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}%`, 'Pass Rate']}
              labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''}
            />
            <Bar dataKey="passRate" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.passRate >= 70 ? 'hsl(142, 71%, 45%)' : entry.passRate >= 50 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
