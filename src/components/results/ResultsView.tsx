import { TestAttempt, CourseWithProgress } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, RotateCcw, Download, Trophy, TrendingUp, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  result: TestAttempt;
  course: CourseWithProgress;
  onRetake: () => void;
  onDownloadCertificate: () => void;
  onPrintCertificate?: () => void;
}

const ResultsView = ({ result, course, onRetake, onDownloadCertificate, onPrintCertificate }: ResultsViewProps) => {
  const { passed, score, correct_answers, total_questions } = result;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-8 py-8">
      {/* Result Header */}
      <div className="text-center">
        <div
          className={cn(
            'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full',
            passed ? 'bg-success/20 animate-pulse-success' : 'bg-destructive/20'
          )}
        >
          {passed ? (
            <Trophy className="h-12 w-12 text-success" />
          ) : (
            <XCircle className="h-12 w-12 text-destructive" />
          )}
        </div>

        <h1 className={cn('text-3xl font-bold', passed ? 'text-success' : 'text-destructive')}>
          {passed ? 'Congratulations!' : 'Keep Learning!'}
        </h1>

        <p className="mt-2 text-lg text-muted-foreground">
          {passed
            ? `You have successfully completed "${course.title}"`
            : `You scored ${score}%. The minimum required is ${course.pass_percentage}%.`}
        </p>
      </div>

      {/* Score Card */}
      <Card className="overflow-hidden">
        <div className={cn('p-6', passed ? 'gradient-success' : 'bg-destructive')}>
          <div className="text-center text-primary-foreground">
            <p className="text-sm font-medium opacity-90">Your Score</p>
            <p className="text-6xl font-bold">{score}%</p>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{total_questions}</p>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{correct_answers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{total_questions - correct_answers}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Pass Requirement</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Minimum {course.pass_percentage}% required to pass this course
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        {passed ? (
          <>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
              onClick={onDownloadCertificate}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Certificate
            </Button>
            {onPrintCertificate && (
              <Button
                size="lg"
                variant="outline"
                onClick={onPrintCertificate}
              >
                <Printer className="mr-2 h-5 w-5" />
                Print
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="border-2"
            >
              Review Course Material
            </Button>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
              onClick={onRetake}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Retake Test
            </Button>
          </>
        )}
      </div>

      {/* Tips for failed attempts */}
      {!passed && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold text-foreground">Tips for Your Next Attempt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-warning" />
                Review the video sections related to questions you missed
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-warning" />
                Take notes on key concepts and definitions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-warning" />
                Read through the explanations provided for each question
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsView;
