export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  passPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completedAt?: string;
  score?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TestResult {
  courseId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  completedAt: string;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  employeeName: string;
  employeeId: string;
  score: number;
  completedAt: string;
}
