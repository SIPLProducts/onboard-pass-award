import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import TestQuestion from '@/components/test/TestQuestion';
import TestTimer from '@/components/test/TestTimer';
import ResultsView from '@/components/results/ResultsView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { TestResult } from '@/types/lms';
import { generateCertificate } from '@/utils/certificate';
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
  const { getCourse, getQuestions, completeCourse } = useCourses();
  const { user } = useAuth();

  const course = getCourse(id || '');
  const questions = getQuestions(id || '');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
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

  const calculateResult = useCallback((): TestResult => {
    let correctAnswers = 0;
    const answerDetails = questions.map((q) => {
      const selectedAnswer = answers[q.id];
      const correct = selectedAnswer === q.correctAnswer;
      if (correct) correctAnswers++;
      return {
        questionId: q.id,
        selectedAnswer: selectedAnswer ?? -1,
        correct,
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= (course?.passPercentage || 70);

    return {
      courseId: id || '',
      totalQuestions: questions.length,
      correctAnswers,
      score,
      passed,
      completedAt: new Date().toISOString(),
      answers: answerDetails,
    };
  }, [answers, questions, course, id]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const result = calculateResult();
    setTestResult(result);
    completeCourse(id || '', result);
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

  const handleDownloadCertificate = () => {
    if (!user || !course || !testResult) return;

    generateCertificate({
      id: `CERT-${Date.now()}`,
      courseId: course.id,
      courseName: course.title,
      employeeName: user.name,
      employeeId: user.employeeId,
      score: testResult.score,
      completedAt: testResult.completedAt,
    });
  };

  if (!course || questions.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Test not available</h1>
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
              question={currentQuestion}
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
