import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Calendar, Trophy, Zap } from 'lucide-react';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';

interface Course {
  id: string;
  progress?: {
    updated_at: string;
    video_progress: number;
  } | null;
  latestAttempt?: {
    completed_at: string;
    passed: boolean;
  } | null;
  certificate?: {
    issued_at: string;
  } | null;
}

interface StreakTrackerProps {
  courses: Course[];
}

const StreakTracker = ({ courses }: StreakTrackerProps) => {
  const { currentStreak, longestStreak, weekActivity, todayProgress } = useMemo(() => {
    // Collect all activity dates
    const activityDates: Date[] = [];
    
    courses.forEach(course => {
      if (course.progress?.updated_at) {
        activityDates.push(new Date(course.progress.updated_at));
      }
      if (course.latestAttempt?.completed_at) {
        activityDates.push(new Date(course.latestAttempt.completed_at));
      }
      if (course.certificate?.issued_at) {
        activityDates.push(new Date(course.certificate.issued_at));
      }
    });

    // Sort dates descending
    const uniqueDays = [...new Set(activityDates.map(d => startOfDay(d).getTime()))]
      .sort((a, b) => b - a)
      .map(t => new Date(t));

    // Calculate current streak
    let streak = 0;
    const today = startOfDay(new Date());
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const expectedDay = subDays(today, i);
      if (isSameDay(uniqueDays[i], expectedDay)) {
        streak++;
      } else if (i === 0 && isSameDay(uniqueDays[0], subDays(today, 1))) {
        // If no activity today but yesterday, still count
        streak++;
      } else {
        break;
      }
    }

    // Calculate longest streak (simplified)
    let longest = streak;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diff = (uniqueDays[i - 1].getTime() - uniqueDays[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Get week activity (last 7 days)
    const week: { day: string; active: boolean; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      week.push({
        day: format(date, 'EEE'),
        date,
        active: uniqueDays.some(d => isSameDay(d, date))
      });
    }

    // Today's progress (based on courses with progress today)
    const todayActivities = courses.filter(c => {
      const progressDate = c.progress?.updated_at ? startOfDay(new Date(c.progress.updated_at)) : null;
      const attemptDate = c.latestAttempt?.completed_at ? startOfDay(new Date(c.latestAttempt.completed_at)) : null;
      return (progressDate && isSameDay(progressDate, today)) || 
             (attemptDate && isSameDay(attemptDate, today));
    }).length;

    return {
      currentStreak: streak,
      longestStreak: Math.max(longest, streak),
      weekActivity: week,
      todayProgress: Math.min(todayActivities, 3) // Daily goal: 3 activities
    };
  }, [courses]);

  const dailyGoal = 3;
  const progressPercent = (todayProgress / dailyGoal) * 100;

  return (
    <Card className="animate-fade-in border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Week Activity */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">This Week</span>
          </div>
          <div className="flex justify-between gap-1">
            {weekActivity.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    day.active
                      ? 'bg-gradient-to-br from-primary to-accent shadow-md'
                      : 'bg-muted'
                  }`}
                >
                  {day.active ? (
                    <Zap className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{format(day.date, 'd')}</span>
                  )}
                </div>
                <span className={`text-xs ${day.active ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Daily Goal</span>
            </div>
            <span className="text-sm font-semibold text-primary">
              {todayProgress}/{dailyGoal}
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            {todayProgress >= dailyGoal
              ? '🎉 Goal completed! Great job!'
              : `Complete ${dailyGoal - todayProgress} more ${dailyGoal - todayProgress === 1 ? 'activity' : 'activities'} today`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
