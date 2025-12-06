import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success('Welcome back!', {
        description: 'You have successfully signed in.',
      });
      navigate('/dashboard');
    } else {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LearnHub</h1>
              <p className="text-sm opacity-80">Employee Learning Portal</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Empower Your
            <br />
            Professional Growth
          </h2>
          <p className="mt-4 max-w-md text-lg opacity-90">
            Access curated courses, complete certifications, and track your learning journey all in one place.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <span className="text-lg">📚</span>
              </div>
              <span className="text-sm">Interactive video courses with assessments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <span className="text-lg">🎓</span>
              </div>
              <span className="text-sm">Earn certificates upon completion</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <span className="text-lg">📈</span>
              </div>
              <span className="text-sm">Track progress and achievements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary lg:hidden">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to access your learning dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo credentials: any email + 4+ character password</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
