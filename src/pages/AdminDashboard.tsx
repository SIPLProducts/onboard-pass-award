import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  BookOpen,
  Users,
  Trophy,
  TrendingUp,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import CourseEditor from '@/components/admin/CourseEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuthContext();
  const { employees, courseStats, recentAttempts, isLoading, error, refetch } = useAdminData();
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Redirect if not admin
  if (!authLoading && !isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
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
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  if (showCourseEditor) {
    return (
      <AppLayout>
        <CourseEditor
          courseId={editingCourseId}
          onClose={() => {
            setShowCourseEditor(false);
            setEditingCourseId(null);
            refetch();
          }}
        />
      </AppLayout>
    );
  }

  const totalEmployees = employees.length;
  const totalCourses = courseStats.length;
  const totalCompletions = courseStats.reduce((sum, c) => sum + c.completions, 0);
  const overallPassRate = courseStats.length > 0
    ? Math.round(courseStats.reduce((sum, c) => sum + c.passRate, 0) / courseStats.length)
    : 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage courses and monitor employee progress</p>
          </div>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={() => setShowCourseEditor(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-foreground">{totalEmployees}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Trophy className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Completions</p>
                <p className="text-2xl font-bold text-foreground">{totalCompletions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Pass Rate</p>
                <p className="text-2xl font-bold text-foreground">{overallPassRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>View and manage all courses</CardDescription>
              </CardHeader>
              <CardContent>
                {courseStats.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No courses yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first course to get started</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Pass Rate</TableHead>
                        <TableHead>Avg. Score</TableHead>
                        <TableHead>Completions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseStats.map((stat) => (
                        <TableRow key={stat.course.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{stat.course.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Pass: {stat.course.pass_percentage}%
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{stat.course.category}</Badge>
                          </TableCell>
                          <TableCell>{stat.totalAttempts}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                stat.passRate >= 70
                                  ? 'bg-success/10 text-success'
                                  : stat.passRate >= 50
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-destructive/10 text-destructive'
                              }
                            >
                              {stat.passRate}%
                            </Badge>
                          </TableCell>
                          <TableCell>{stat.averageScore}%</TableCell>
                          <TableCell>{stat.completions}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCourseId(stat.course.id);
                                setShowCourseEditor(true);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Progress</CardTitle>
                <CardDescription>Track employee learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No employees yet</h3>
                    <p className="text-sm text-muted-foreground">Employees will appear here once they sign up</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>In Progress</TableHead>
                        <TableHead>Avg. Score</TableHead>
                        <TableHead>Certificates</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((emp) => (
                        <TableRow key={emp.profile.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{emp.profile.full_name}</p>
                              <p className="text-xs text-muted-foreground">{emp.profile.employee_id}</p>
                            </div>
                          </TableCell>
                          <TableCell>{emp.profile.department || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className="bg-success/10 text-success">{emp.coursesCompleted}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-warning/10 text-warning">{emp.coursesInProgress}</Badge>
                          </TableCell>
                          <TableCell>{emp.averageScore}%</TableCell>
                          <TableCell>
                            <Badge variant="outline">{emp.certificates}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
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
                    <p className="text-sm text-muted-foreground">Test attempts will appear here</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
