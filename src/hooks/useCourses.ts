import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Question, CourseProgress, TestAttempt, Certificate, CourseWithProgress } from '@/types/database';

export function useCourses(userId?: string) {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      let enrichedCourses: CourseWithProgress[] = (coursesData as Course[]) || [];

      // If user is logged in, fetch their progress
      if (userId) {
        const [progressResult, attemptsResult, certificatesResult] = await Promise.all([
          supabase.from('course_progress').select('*').eq('user_id', userId),
          supabase.from('test_attempts').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
          supabase.from('certificates').select('*').eq('user_id', userId),
        ]);

        const progressMap = new Map((progressResult.data as CourseProgress[] || []).map((p) => [p.course_id, p]));
        const attemptsMap = new Map<string, TestAttempt>();
        (attemptsResult.data || []).forEach((a) => {
          const attempt = {
            ...a,
            answers: Array.isArray(a.answers) ? a.answers : []
          } as TestAttempt;
          if (!attemptsMap.has(a.course_id)) {
            attemptsMap.set(a.course_id, attempt);
          }
        });
        const certificatesMap = new Map((certificatesResult.data as Certificate[] || []).map((c) => [c.course_id, c]));

        enrichedCourses = enrichedCourses.map((course) => ({
          ...course,
          progress: progressMap.get(course.id),
          latestAttempt: attemptsMap.get(course.id),
          certificate: certificatesMap.get(course.id),
        }));
      }

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, error, refetch: fetchCourses };
}

export function useCourse(courseId: string, userId?: string) {
  const [course, setCourse] = useState<CourseWithProgress | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        setError('Course not found');
        return;
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      let enrichedCourse: CourseWithProgress = courseData as Course;

      // Fetch user-specific data if logged in
      if (userId) {
        const [progressResult, attemptResult, certificateResult] = await Promise.all([
          supabase.from('course_progress').select('*').eq('user_id', userId).eq('course_id', courseId).maybeSingle(),
          supabase.from('test_attempts').select('*').eq('user_id', userId).eq('course_id', courseId).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('certificates').select('*').eq('user_id', userId).eq('course_id', courseId).maybeSingle(),
        ]);

        const attempt = attemptResult.data ? {
          ...attemptResult.data,
          answers: Array.isArray(attemptResult.data.answers) ? attemptResult.data.answers : []
        } as TestAttempt : undefined;

        enrichedCourse = {
          ...enrichedCourse,
          progress: progressResult.data as CourseProgress || undefined,
          latestAttempt: attempt,
          certificate: certificateResult.data as Certificate || undefined,
        };
      }

      setCourse(enrichedCourse);
      setQuestions((questionsData || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      })) as Question[]);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, userId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const updateProgress = async (progress: number, completed: boolean) => {
    if (!userId || !courseId) return;

    const { error } = await supabase
      .from('course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        video_progress: Math.round(progress),
        video_completed: completed,
      }, {
        onConflict: 'user_id,course_id',
      });

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      await fetchCourse();
    }
  };

  const submitTest = async (
    answers: { questionId: string; selectedAnswer: number; correct: boolean }[],
    score: number,
    correctCount: number,
    passed: boolean
  ) => {
    if (!userId || !courseId) return { error: new Error('Not authenticated') };

    // Insert test attempt
    const { error: attemptError } = await supabase.from('test_attempts').insert([{
      user_id: userId,
      course_id: courseId,
      score,
      correct_answers: correctCount,
      total_questions: questions.length,
      passed,
      answers: answers as any,
    }]);

    if (attemptError) {
      console.error('Error submitting test:', attemptError);
      return { error: attemptError };
    }

    // If passed, create certificate
    if (passed) {
      const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error: certError } = await supabase.from('certificates').insert({
        user_id: userId,
        course_id: courseId,
        score,
        certificate_number: certificateNumber,
      });

      if (certError) {
        console.error('Error creating certificate:', certError);
      }
    }

    await fetchCourse();
    return { error: null };
  };

  return { course, questions, isLoading, error, refetch: fetchCourse, updateProgress, submitTest };
}
