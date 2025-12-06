export type AppRole = 'admin' | 'employee';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  employee_id: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  category: string;
  pass_percentage: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  course_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  order_index: number;
  created_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  video_progress: number;
  video_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
  completed_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  issued_at: string;
  certificate_number: string;
}

export interface CourseWithProgress extends Course {
  progress?: CourseProgress;
  latestAttempt?: TestAttempt;
  certificate?: Certificate;
}
