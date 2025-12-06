import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import AppLayout from '@/components/layout/AppLayout';
import VideoPlayer from '@/components/courses/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertCircle,
} from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCourse, updateCourseProgress, getQuestions } = useCourses();
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const course = getCourse(id || '');
  const questions = getQuestions(id || '');

  if (!course) {
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

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    updateCourseProgress(course.id, 50);
  };

  const handleVideoProgress = (prog: number) => {
    setProgress(prog);
    if (prog > 10 && course.status === 'not_started') {
      updateCourseProgress(course.id, Math.min(prog / 2, 45));
    }
  };

  const canStartTest = videoCompleted || course.status === 'completed' || progress > 80;

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
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Pass: {course.passPercentage}%
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>

        {/* Video Player */}
        <div className="animate-slide-up">
          <VideoPlayer
            videoUrl={course.videoUrl}
            onComplete={handleVideoComplete}
            onProgress={handleVideoProgress}
          />
        </div>

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
                {(videoCompleted || progress > 80) && (
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
                {course.status === 'completed' && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
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
                  <span className="font-medium">{course.passPercentage}%</span>
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

              {course.status === 'completed' && course.score && (
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">Your Score</span>
                    <span className="text-2xl font-bold text-success">{course.score}%</span>
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
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                {!canStartTest && (
                  <p className="text-xs text-muted-foreground">
                    Watch at least 80% of the video to unlock the assessment
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
                disabled={!canStartTest}
                onClick={() => navigate(`/course/${course.id}/test`)}
              >
                {course.status === 'completed' ? 'Retake Test' : 'Start Assessment'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CoursePage;
