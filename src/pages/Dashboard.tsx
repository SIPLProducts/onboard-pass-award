import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import CourseCard from '@/components/courses/CourseCard';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { courses } = useCourses();
  const { user } = useAuth();

  const stats = {
    totalCourses: courses.length,
    completed: courses.filter((c) => c.status === 'completed').length,
    inProgress: courses.filter((c) => c.status === 'in_progress').length,
    averageScore:
      courses.filter((c) => c.score).reduce((acc, c) => acc + (c.score || 0), 0) /
        courses.filter((c) => c.score).length || 0,
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Continue your learning journey. You have {courses.length - stats.completed} courses to complete.
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
                  {stats.averageScore ? `${Math.round(stats.averageScore)}%` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Sections */}
        {stats.inProgress > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Continue Learning</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((c) => c.status === 'in_progress')
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">All Courses</h2>
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
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
