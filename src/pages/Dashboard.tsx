import { useAuthContext } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import AppLayout from '@/components/layout/AppLayout';
import CourseCard from '@/components/courses/CourseCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Trophy, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuthContext();
  const { courses, isLoading, error } = useCourses(user?.id);

  const stats = {
    totalCourses: courses.length,
    completed: courses.filter((c) => c.certificate).length,
    inProgress: courses.filter((c) => !c.certificate && (c.progress?.video_progress || 0) > 0).length,
    averageScore: (() => {
      const scoresArray = courses.filter((c) => c.latestAttempt?.passed).map((c) => c.latestAttempt!.score);
      return scoresArray.length > 0 ? Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length) : 0;
    })(),
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Error Loading Courses</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            {courses.length > 0
              ? `Continue your learning journey. You have ${courses.length - stats.completed} courses to complete.`
              : 'No courses available yet. Check back later!'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: '0.1s' }}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: '0.2s' }}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: '0.3s' }}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: '0.4s' }}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.averageScore ? `${stats.averageScore}%` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* In Progress Section */}
        {stats.inProgress > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Continue Learning</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((c) => !c.certificate && (c.progress?.video_progress || 0) > 0)
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </section>
        )}

        {/* All Courses Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">All Courses</h2>
          {courses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No courses available</h3>
                <p className="text-sm text-muted-foreground">Check back later for new courses.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
