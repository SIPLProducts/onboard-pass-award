import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Award, BarChart3, Users, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();


  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Courses',
      description: 'Engaging video content with structured learning paths designed for professional growth.',
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Complete courses and assessments to earn verifiable certificates of completion.',
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and analytics.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Admins can manage employees, assign courses, and generate compliance reports.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="LearnHub" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">LearnHub</span>
          </div>
          <Button onClick={() => navigate('/login')} className="gradient-primary text-primary-foreground">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center animate-fade-in">
              <img src={logo} alt="LearnHub" className="h-20 w-auto" />
            </div>
            <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Empower Your Team with
              <span className="block text-primary">Professional Learning</span>
            </h1>
            <p className="mt-6 animate-fade-in text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: '0.1s' }}>
              A comprehensive employee training platform with interactive courses, 
              assessments, and certificates to drive professional development.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="gradient-primary text-primary-foreground shadow-lg hover:opacity-90 px-8"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need for Employee Training
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete learning management solution designed for modern organizations.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border-0 shadow-md hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl gradient-primary p-8 text-center text-primary-foreground sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to Transform Your Team's Learning?
            </h2>
            <p className="mt-4 opacity-90">
              Join organizations that trust LearnHub for their employee development needs.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8"
              >
                Start Free Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="LearnHub" className="h-6 w-auto" />
            <span className="text-sm font-medium text-foreground">LearnHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
