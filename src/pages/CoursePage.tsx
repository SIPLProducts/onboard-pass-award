import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourse } from '@/hooks/useCourses';
import AppLayout from '@/components/layout/AppLayout';
import VideoPlayer from '@/components/courses/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertCircle,
  Download,
  Printer,
} from 'lucide-react';
import { generateCertificate, openPrintableCertificate } from '@/utils/certificate';

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { course, questions, isLoading, error, updateProgress } = useCourse(id || '', user?.id);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    if (course?.progress) {
      setVideoProgress(course.progress.video_progress);
      setVideoCompleted(course.progress.video_completed);
    }
  }, [course?.progress]);

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    updateProgress(100, true);
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
    if (progress > 10) {
      updateProgress(progress, progress >= 80);
    }
  };

  const canStartTest = videoCompleted || videoProgress >= 80 || course?.certificate;

  const handleDownloadCertificate = async () => {
    if (!profile || !course || !course.certificate) return;

    await generateCertificate({
      id: course.certificate.certificate_number,
      courseId: course.id,
      courseName: course.title,
      employeeName: profile.full_name,
      employeeId: profile.employee_id,
      score: course.certificate.score,
      completedAt: course.certificate.issued_at,
    });
  };

  const handlePrintCertificate = () => {
    if (!profile || !course || !course.certificate) return;

    openPrintableCertificate({
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
        <div className="mx-auto max-w-5xl space-y-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="aspect-video w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !course) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Course not found</h1>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className="cursor-pointer hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </span>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </div>

        {/* Header */}
        <div className="animate-fade-in space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {course.category}
            </Badge>
            {course.duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Pass: {course.pass_percentage}%
            </div>
            {course.certificate && (
              <Badge className="bg-success/10 text-success">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>

        {/* Video Player */}
        {course.video_url && (
          <div className="animate-slide-up">
            <VideoPlayer
              videoUrl={course.video_url}
              onComplete={handleVideoComplete}
              onProgress={handleVideoProgress}
            />
          </div>
        )}

        {/* Course Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <span className="font-medium">Video Lesson</span>
                </div>
                {(videoCompleted || videoProgress >= 80) && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <span className="font-medium">Assessment ({questions.length} questions)</span>
                </div>
                {course.certificate && <CheckCircle2 className="h-5 w-5 text-success" />}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{questions.length} multiple choice</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pass Percentage</span>
                  <span className="font-medium">{course.pass_percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit</span>
                  <span className="font-medium">10 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retakes</span>
                  <span className="font-medium">Unlimited</span>
                </div>
              </div>

              {course.certificate && course.latestAttempt && (
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">Your Score</span>
                    <span className="text-2xl font-bold text-success">{course.latestAttempt.score}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress & CTA */}
        <Card className="animate-slide-up overflow-hidden" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Video Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(videoProgress)}%</span>
                </div>
                <Progress value={videoProgress} className="h-2" />
                {!canStartTest && (
                  <p className="text-xs text-muted-foreground">
                    Watch at least 80% of the video to unlock the assessment
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {course.certificate && (
                  <>
                    <Button variant="outline" onClick={handleDownloadCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="icon" onClick={handlePrintCertificate} title="Print Certificate">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
                  disabled={!canStartTest || questions.length === 0}
                  onClick={() => navigate(`/course/${course.id}/test`)}
                >
                  {course.certificate ? 'Retake Test' : 'Start Assessment'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CoursePage;
