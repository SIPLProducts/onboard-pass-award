import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourse } from '@/hooks/useCourses';
import AppLayout from '@/components/layout/AppLayout';
import TestQuestion from '@/components/test/TestQuestion';
import TestTimer from '@/components/test/TestTimer';
import ResultsView from '@/components/results/ResultsView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { TestAttempt } from '@/types/database';
import { generateCertificate } from '@/utils/certificate';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const TestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { course, questions, isLoading, error, submitTest, refetch } = useCourse(id || '', user?.id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<TestAttempt | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const goToNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResult = useCallback((): {
    score: number;
    correctCount: number;
    passed: boolean;
    answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
  } => {
    let correctAnswers = 0;
    const answerDetails = questions.map((q) => {
      const selectedAnswer = answers[q.id];
      const correct = selectedAnswer === q.correct_answer;
      if (correct) correctAnswers++;
      return {
        questionId: q.id,
        selectedAnswer: selectedAnswer ?? -1,
        correct,
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= (course?.pass_percentage || 70);

    return {
      score,
      correctCount: correctAnswers,
      passed,
      answers: answerDetails,
    };
  }, [answers, questions, course]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = calculateResult();

    const { error } = await submitTest(result.answers, result.score, result.correctCount, result.passed);

    if (error) {
      toast.error('Failed to submit test', { description: error.message });
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      return;
    }

    // Refetch to get updated data including certificate
    await refetch();

    setTestResult({
      id: '',
      user_id: user?.id || '',
      course_id: id || '',
      score: result.score,
      correct_answers: result.correctCount,
      total_questions: questions.length,
      passed: result.passed,
      answers: result.answers,
      completed_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setShowSubmitDialog(false);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTestResult(null);
  };

  const handleDownloadCertificate = async () => {
    if (!profile || !course || !testResult) return;

    await generateCertificate({
      id: `CERT-${Date.now()}`,
      courseId: course.id,
      courseName: course.title,
      employeeName: profile.full_name,
      employeeId: profile.employee_id,
      score: testResult.score,
      completedAt: testResult.completed_at,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl space-y-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !course || questions.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Test not available</h1>
          <p className="text-muted-foreground">
            {questions.length === 0 ? 'No questions have been added to this test yet.' : error}
          </p>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Show results if test is completed
  if (testResult) {
    return (
      <AppLayout>
        <ResultsView
          result={testResult}
          course={course}
          onRetake={handleRetake}
          onDownloadCertificate={handleDownloadCertificate}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <p className="text-muted-foreground">Assessment</p>
          </div>
          <TestTimer initialTime={600} onTimeUp={handleTimeUp} />
        </div>

        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`h-2 w-8 rounded-full transition-colors ${
                  answers[questions[i].id] !== undefined
                    ? 'bg-primary'
                    : i === currentQuestionIndex
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TestQuestion
              question={{
                id: currentQuestion.id,
                question: currentQuestion.question_text,
                options: currentQuestion.options,
                correctAnswer: currentQuestion.correct_answer,
                explanation: currentQuestion.explanation || undefined,
              }}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQuestion.id] ?? null}
              onAnswer={handleAnswer}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {!isLastQuestion ? (
              <Button onClick={goToNext} disabled={answers[currentQuestion.id] === undefined}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={() => setShowSubmitDialog(true)}
                disabled={answeredCount < questions.length}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Test
              </Button>
            )}
          </div>
        </div>

        {/* Unanswered warning */}
        {isLastQuestion && answeredCount < questions.length && (
          <p className="mt-4 text-center text-sm text-warning">
            Please answer all questions before submitting
          </p>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {questions.length} questions. Once submitted, you
              cannot change your answers. Are you sure you want to submit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="gradient-primary text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default TestPage;
