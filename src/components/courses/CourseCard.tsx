import { CourseWithProgress } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: CourseWithProgress;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  const getStatus = () => {
    if (course.certificate) return 'completed';
    if (course.progress?.video_progress && course.progress.video_progress > 0) return 'in_progress';
    if (course.latestAttempt) return 'in_progress';
    return 'not_started';
  };

  const status = getStatus();
  const progressValue = course.progress?.video_progress || 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
            <PlayCircle className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <BookOpen className="mr-1 h-3 w-3" />
            Not Started
          </Badge>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Onboarding: 'bg-primary/10 text-primary',
      Compliance: 'bg-destructive/10 text-destructive',
      'Professional Development': 'bg-accent/10 text-accent-foreground',
      General: 'bg-muted text-muted-foreground',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-card/80 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <PlayCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="absolute right-3 top-3">{getStatusBadge()}</div>
      </div>

      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className={getCategoryColor(course.category)}>
            {course.category}
          </Badge>
          {course.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {course.duration}
            </div>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>

        {status !== 'not_started' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}

        {course.certificate && course.latestAttempt && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
            <span className="text-sm text-success">Score</span>
            <span className="font-semibold text-success">{course.latestAttempt.score}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
