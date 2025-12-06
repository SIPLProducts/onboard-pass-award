import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, TestAttempt, Certificate, Course, Question } from '@/types/database';

interface EmployeeStats {
  profile: Profile;
  coursesCompleted: number;
  coursesInProgress: number;
  averageScore: number;
  certificates: number;
}

interface CourseStats {
  course: Course;
  totalAttempts: number;
  passRate: number;
  averageScore: number;
  completions: number;
}

export function useAdminData() {
  const [employees, setEmployees] = useState<EmployeeStats[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<(TestAttempt & { profile?: Profile; course?: Course })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch all test attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('*')
        .order('completed_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      // Fetch all certificates
      const { data: certificates, error: certsError } = await supabase
        .from('certificates')
        .select('*');

      if (certsError) throw certsError;

      // Calculate employee stats
      const employeeStats: EmployeeStats[] = (profiles as Profile[] || []).map((profile) => {
        const userAttempts = (attempts || []).filter((a) => a.user_id === profile.user_id);
        const passedAttempts = userAttempts.filter((a) => a.passed);
        const uniqueCoursesCompleted = new Set(passedAttempts.map((a) => a.course_id)).size;
        const uniqueCoursesAttempted = new Set(userAttempts.map((a) => a.course_id)).size;
        const userCerts = (certificates || []).filter((c) => c.user_id === profile.user_id);
        const avgScore = userAttempts.length > 0
          ? userAttempts.reduce((sum, a) => sum + a.score, 0) / userAttempts.length
          : 0;

        return {
          profile,
          coursesCompleted: uniqueCoursesCompleted,
          coursesInProgress: uniqueCoursesAttempted - uniqueCoursesCompleted,
          averageScore: Math.round(avgScore),
          certificates: userCerts.length,
        };
      });

      // Calculate course stats
      const courseStatsData: CourseStats[] = (courses as Course[] || []).map((course) => {
        const courseAttempts = (attempts || []).filter((a) => a.course_id === course.id);
        const passedCount = courseAttempts.filter((a) => a.passed).length;
        const avgScore = courseAttempts.length > 0
          ? courseAttempts.reduce((sum, a) => sum + a.score, 0) / courseAttempts.length
          : 0;
        const uniqueCompletions = new Set(courseAttempts.filter((a) => a.passed).map((a) => a.user_id)).size;

        return {
          course,
          totalAttempts: courseAttempts.length,
          passRate: courseAttempts.length > 0 ? Math.round((passedCount / courseAttempts.length) * 100) : 0,
          averageScore: Math.round(avgScore),
          completions: uniqueCompletions,
        };
      });

      // Recent attempts with profile and course info
      const profilesMap = new Map((profiles as Profile[] || []).map((p) => [p.user_id, p]));
      const coursesMap = new Map((courses as Course[] || []).map((c) => [c.id, c]));

      const recentAttemptsData = ((attempts || []) as TestAttempt[]).slice(0, 20).map((attempt) => ({
        ...attempt,
        answers: Array.isArray(attempt.answers) ? attempt.answers : [],
        profile: profilesMap.get(attempt.user_id),
        course: coursesMap.get(attempt.course_id),
      }));

      setEmployees(employeeStats);
      setCourseStats(courseStatsData);
      setRecentAttempts(recentAttemptsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuestions = useCallback(async (courseId: string) => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    return { 
      data: (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      })) as Question[], 
      error 
    };
  }, []);

  const getCourse = useCallback(async (courseId: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    return { data: data as Course | null, error };
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Course management functions
  const createCourse = async (courseData: Partial<Course>) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData as any])
      .select()
      .single();

    if (!error) {
      await fetchAdminData();
    }

    return { data, error };
  };

  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select()
      .single();

    if (!error) {
      await fetchAdminData();
    }

    return { data, error };
  };

  const deleteCourse = async (courseId: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (!error) {
      await fetchAdminData();
    }

    return { error };
  };

  // Question management
  const saveQuestions = async (courseId: string, questions: Omit<Question, 'id' | 'created_at'>[]) => {
    // Delete existing questions
    await supabase.from('questions').delete().eq('course_id', courseId);

    // Insert new questions
    if (questions.length > 0) {
      const { error } = await supabase.from('questions').insert(
        questions.map((q, index) => ({
          ...q,
          course_id: courseId,
          order_index: index,
        }))
      );

      return { error };
    }

    return { error: null };
  };

  return {
    employees,
    courseStats,
    recentAttempts,
    isLoading,
    error,
    refetch: fetchAdminData,
    createCourse,
    updateCourse,
    deleteCourse,
    saveQuestions,
    getQuestions,
    getCourse,
  };
}
