import { useState } from 'react';
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
import {
  BookOpen,
  Plus,
  AlertCircle,
} from 'lucide-react';
import CourseEditor from '@/components/admin/CourseEditor';

const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuthContext();
  const { courseStats, isLoading, refetch } = useAdminData();
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

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
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Courses</h1>
            <p className="text-muted-foreground">Create and manage training courses</p>
          </div>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={() => setShowCourseEditor(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>View and manage all training courses</CardDescription>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Pass Rate</TableHead>
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
                      <TableCell>
                        <Badge className={stat.course.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                          {stat.course.is_active ? 'Active' : 'Inactive'}
                        </Badge>
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
      </div>
    </AppLayout>
  );
};

export default AdminCoursesPage;
