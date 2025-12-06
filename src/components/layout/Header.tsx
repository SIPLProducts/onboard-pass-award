import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, LogOut, User, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const { profile, isAdmin, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      navigate('/login');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate('/dashboard')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">LearnHub</h1>
            <p className="text-xs text-muted-foreground">Employee Learning Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="hidden sm:flex"
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>
          )}

          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2">
                  <div className="hidden text-right sm:block">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.employee_id}</p>
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{profile.department || 'No department'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
