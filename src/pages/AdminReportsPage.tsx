import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, AlertCircle, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { PassRateChart } from '@/components/reports/PassRateChart';
import { CoursePerformanceChart } from '@/components/reports/CoursePerformanceChart';
import { AttemptsTimelineChart } from '@/components/reports/AttemptsTimelineChart';
import { ScoreDistributionChart } from '@/components/reports/ScoreDistributionChart';

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuthContext();
  const { recentAttempts, courseStats, employees, isLoading } = useAdminData();

  if (!authLoading && !isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isLoading || authLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  const totalAttempts = courseStats.reduce((sum, c) => sum + c.totalAttempts, 0);
  const totalPassed = recentAttempts.filter((a) => a.passed).length;
  const overallPassRate = totalAttempts > 0 ? Math.round((totalPassed / recentAttempts.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analytics and performance reports</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold text-foreground">{recentAttempts.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-foreground">{totalPassed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-foreground">{recentAttempts.length - totalPassed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold text-foreground">{overallPassRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <PassRateChart passed={totalPassed} failed={recentAttempts.length - totalPassed} />
          <AttemptsTimelineChart attempts={recentAttempts} />
          <CoursePerformanceChart courseStats={courseStats} />
          <ScoreDistributionChart attempts={recentAttempts} />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Attempts</CardTitle>
            <CardDescription>Latest assessment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAttempts.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No activity yet</h3>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{attempt.profile?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.profile?.employee_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{attempt.course?.title || 'Unknown Course'}</TableCell>
                      <TableCell>
                        <span className="font-medium">{attempt.score}%</span>
                      </TableCell>
                      <TableCell>
                        {attempt.passed ? (
                          <Badge className="bg-success/10 text-success">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Passed
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminReportsPage;
