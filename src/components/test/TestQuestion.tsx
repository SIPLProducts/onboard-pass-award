import { Question } from '@/types/lms';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TestQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
  showResult?: boolean;
}

const TestQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showResult = false,
}: TestQuestionProps) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 w-8 rounded-full transition-colors',
                i < questionNumber ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-foreground">{question.question}</h2>

      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correctAnswer;

          return (
            <div
              key={index}
              className={cn(
                'relative flex items-center rounded-xl border-2 p-4 transition-all',
                !showResult && 'cursor-pointer hover:border-primary/50 hover:bg-primary/5',
                isSelected && !showResult && 'border-primary bg-primary/5',
                showResult && isCorrectOption && 'border-success bg-success/10',
                showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10',
                !isSelected && !showResult && 'border-border'
              )}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                className="mr-4"
                disabled={showResult}
              />
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  'flex-1 cursor-pointer text-base',
                  showResult && isCorrectOption && 'text-success font-medium',
                  showResult && isSelected && !isCorrect && 'text-destructive'
                )}
              >
                {option}
              </Label>
              {showResult && isCorrectOption && (
                <span className="ml-2 text-sm font-medium text-success">✓ Correct</span>
              )}
              {showResult && isSelected && !isCorrect && (
                <span className="ml-2 text-sm font-medium text-destructive">✗ Incorrect</span>
              )}
            </div>
          );
        })}
      </RadioGroup>

      {showResult && question.explanation && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium text-foreground">Explanation:</p>
          <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default TestQuestion;
