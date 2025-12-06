import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, Medal, Trophy, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  department: string | null;
  courses_completed: number;
  average_score: number;
  total_points: number;
}

const Leaderboard = () => {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase.rpc('get_leaderboard');
        
        if (error) {
          console.error('Error fetching leaderboard:', error);
          return;
        }
        
        setEntries(data || []);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20';
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-slate-400/10 border-gray-400/20';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/20';
      default:
        return 'bg-background hover:bg-muted/50';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No learners yet. Be the first to complete a course!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const userRank = entries.findIndex(e => e.user_id === user?.id) + 1;

  return (
    <Card className="animate-fade-in border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
          {userRank > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                Your rank: #{userRank}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.slice(0, 10).map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.user_id === user?.id;

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${getRankBg(rank)} ${
                isCurrentUser ? 'ring-2 ring-primary/50' : ''
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarImage src={entry.avatar_url || ''} alt={entry.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(entry.full_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className={`truncate text-sm font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                  {entry.full_name}
                  {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.department || 'No department'} • {entry.courses_completed} courses
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{entry.total_points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
