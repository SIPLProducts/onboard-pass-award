import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, TestResult } from '@/types/lms';
import { courses as initialCourses, courseQuestions } from '@/data/mockData';

interface CourseContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  getQuestions: (courseId: string) => typeof courseQuestions[string];
  updateCourseProgress: (courseId: string, progress: number) => void;
  completeCourse: (courseId: string, result: TestResult) => void;
  testResults: Record<string, TestResult>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  const getQuestions = (courseId: string) => courseQuestions[courseId] || [];

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, progress, status: progress > 0 ? 'in_progress' : course.status }
          : course
      )
    );
  };

  const completeCourse = (courseId: string, result: TestResult) => {
    setTestResults((prev) => ({ ...prev, [courseId]: result }));
    
    if (result.passed) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? {
                ...course,
                status: 'completed',
                progress: 100,
                completedAt: result.completedAt,
                score: result.score,
              }
            : course
        )
      );
    }
  };

  return (
    <CourseContext.Provider
      value={{ courses, getCourse, getQuestions, updateCourseProgress, completeCourse, testResults }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
