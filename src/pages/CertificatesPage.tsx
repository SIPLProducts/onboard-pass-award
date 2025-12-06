import { useAuthContext } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Download, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCertificate } from '@/utils/certificate';

const CertificatesPage = () => {
  const { user, profile } = useAuthContext();
  const { courses, isLoading } = useCourses(user?.id);

  const completedCourses = courses.filter((c) => c.certificate);

  const handleDownload = (course: typeof courses[0]) => {
    if (!profile || !course.certificate) return;

    generateCertificate({
      id: course.certificate.certificate_number,
      courseId: course.id,
      courseName: course.title,
      employeeName: profile.full_name,
      employeeId: profile.employee_id,
      score: course.certificate.score,
      completedAt: course.certificate.issued_at,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground">Download your course completion certificates</p>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Trophy className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Certificates Earned</p>
              <p className="text-2xl font-bold text-foreground">{completedCourses.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        {completedCourses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No certificates yet</h3>
              <p className="text-sm text-muted-foreground">Complete courses to earn certificates</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-2 gradient-success" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Award className="h-8 w-8 text-success" />
                    <Badge className="bg-success/10 text-success">Completed</Badge>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-semibold text-success">{course.certificate?.score}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issued</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(course.certificate?.issued_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDownload(course)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CertificatesPage;
