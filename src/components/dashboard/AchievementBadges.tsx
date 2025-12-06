import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Award, 
  Star, 
  Zap, 
  Trophy, 
  BookOpen, 
  Target, 
  Flame,
  Crown,
  Medal,
  Sparkles,
  GraduationCap,
  Lock
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Course {
  id: string;
  progress?: {
    video_completed: boolean;
    video_progress: number;
  } | null;
  latestAttempt?: {
    score: number;
    passed: boolean;
  } | null;
  certificate?: object | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  total?: number;
  gradient: string;
}

interface AchievementBadgesProps {
  courses: Course[];
}

const AchievementBadges = ({ courses }: AchievementBadgesProps) => {
  const achievements = useMemo<Achievement[]>(() => {
    const completedCourses = courses.filter(c => c.certificate).length;
    const videosWatched = courses.filter(c => c.progress?.video_completed).length;
    const perfectScores = courses.filter(c => c.latestAttempt?.score === 100).length;
    const passedTests = courses.filter(c => c.latestAttempt?.passed).length;
    const totalProgress = courses.reduce((sum, c) => sum + (c.progress?.video_progress || 0), 0);
    const avgProgress = courses.length > 0 ? totalProgress / courses.length : 0;

    return [
      {
        id: 'first-course',
        name: 'First Steps',
        description: 'Complete your first course',
        icon: <Star className="h-5 w-5" />,
        earned: completedCourses >= 1,
        progress: completedCourses,
        total: 1,
        gradient: 'from-yellow-400 to-orange-500'
      },
      {
        id: 'five-courses',
        name: 'Rising Star',
        description: 'Complete 5 courses',
        icon: <Award className="h-5 w-5" />,
        earned: completedCourses >= 5,
        progress: completedCourses,
        total: 5,
        gradient: 'from-blue-400 to-primary'
      },
      {
        id: 'ten-courses',
        name: 'Knowledge Seeker',
        description: 'Complete 10 courses',
        icon: <GraduationCap className="h-5 w-5" />,
        earned: completedCourses >= 10,
        progress: completedCourses,
        total: 10,
        gradient: 'from-accent to-primary'
      },
      {
        id: 'perfect-score',
        name: 'Perfectionist',
        description: 'Score 100% on any test',
        icon: <Target className="h-5 w-5" />,
        earned: perfectScores >= 1,
        progress: perfectScores,
        total: 1,
        gradient: 'from-green-400 to-emerald-600'
      },
      {
        id: 'triple-perfect',
        name: 'Ace',
        description: 'Score 100% on 3 tests',
        icon: <Crown className="h-5 w-5" />,
        earned: perfectScores >= 3,
        progress: perfectScores,
        total: 3,
        gradient: 'from-amber-400 to-yellow-600'
      },
      {
        id: 'video-master',
        name: 'Video Master',
        description: 'Complete 5 course videos',
        icon: <BookOpen className="h-5 w-5" />,
        earned: videosWatched >= 5,
        progress: videosWatched,
        total: 5,
        gradient: 'from-pink-400 to-rose-600'
      },
      {
        id: 'quick-learner',
        name: 'Quick Learner',
        description: 'Pass 3 tests',
        icon: <Zap className="h-5 w-5" />,
        earned: passedTests >= 3,
        progress: passedTests,
        total: 3,
        gradient: 'from-cyan-400 to-blue-600'
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Reach 50% average progress',
        icon: <Flame className="h-5 w-5" />,
        earned: avgProgress >= 50,
        progress: Math.round(avgProgress),
        total: 50,
        gradient: 'from-orange-400 to-red-600'
      },
      {
        id: 'champion',
        name: 'Champion',
        description: 'Complete all available courses',
        icon: <Trophy className="h-5 w-5" />,
        earned: courses.length > 0 && completedCourses === courses.length,
        progress: completedCourses,
        total: courses.length || 1,
        gradient: 'from-purple-400 to-accent'
      },
      {
        id: 'overachiever',
        name: 'Overachiever',
        description: 'Score 100% on 5 tests',
        icon: <Sparkles className="h-5 w-5" />,
        earned: perfectScores >= 5,
        progress: perfectScores,
        total: 5,
        gradient: 'from-indigo-400 to-purple-600'
      },
      {
        id: 'test-master',
        name: 'Test Master',
        description: 'Pass 10 tests',
        icon: <Medal className="h-5 w-5" />,
        earned: passedTests >= 10,
        progress: passedTests,
        total: 10,
        gradient: 'from-teal-400 to-cyan-600'
      },
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'Complete 20 courses',
        icon: <Crown className="h-5 w-5" />,
        earned: completedCourses >= 20,
        progress: completedCourses,
        total: 20,
        gradient: 'from-rose-400 to-pink-600'
      }
    ];
  }, [courses]);

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <Card className="animate-fade-in border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-accent" />
            Achievements
          </CardTitle>
          <span className="text-sm font-medium text-muted-foreground">
            {earnedCount}/{achievements.length} earned
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6">
            {achievements.map((achievement) => (
              <Tooltip key={achievement.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`group relative flex aspect-square cursor-pointer items-center justify-center rounded-xl transition-all duration-300 ${
                      achievement.earned
                        ? `bg-gradient-to-br ${achievement.gradient} shadow-lg hover:scale-110 hover:shadow-xl`
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {achievement.earned ? (
                      <div className="text-white">{achievement.icon}</div>
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground/50" />
                    )}
                    {achievement.earned && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                        <span className="text-[10px]">✓</span>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <div className="space-y-1">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {!achievement.earned && achievement.progress !== undefined && (
                      <p className="text-xs font-medium text-primary">
                        Progress: {achievement.progress}/{achievement.total}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
