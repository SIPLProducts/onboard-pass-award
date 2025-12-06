import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CourseWithProgress, Profile } from '@/types/database';

// Mock demo data
const DEMO_PROFILE: Profile = {
  id: 'demo-profile-1',
  user_id: 'demo-user-1',
  full_name: 'Demo Employee',
  employee_id: 'EMP-DEMO-001',
  department: 'Engineering',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_COURSES: CourseWithProgress[] = [
  {
    id: 'demo-course-1',
    title: 'Workplace Safety Fundamentals',
    description: 'Learn essential workplace safety protocols and emergency procedures to maintain a safe working environment.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    duration: '45 min',
    category: 'Safety',
    pass_percentage: 80,
    is_active: true,
    created_by: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    progress: {
      id: 'demo-progress-1',
      user_id: 'demo-user-1',
      course_id: 'demo-course-1',
      video_progress: 100,
      video_completed: true,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    latestAttempt: {
      id: 'demo-attempt-1',
      user_id: 'demo-user-1',
      course_id: 'demo-course-1',
      score: 90,
      correct_answers: 9,
      total_questions: 10,
      passed: true,
      answers: [],
      completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    certificate: {
      id: 'demo-cert-1',
      user_id: 'demo-user-1',
      course_id: 'demo-course-1',
      score: 90,
      issued_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      certificate_number: 'CERT-DEMO-001',
    },
  },
  {
    id: 'demo-course-2',
    title: 'Data Protection & Privacy',
    description: 'Understanding GDPR, data handling best practices, and protecting sensitive information.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    duration: '30 min',
    category: 'Compliance',
    pass_percentage: 75,
    is_active: true,
    created_by: null,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    progress: {
      id: 'demo-progress-2',
      user_id: 'demo-user-1',
      course_id: 'demo-course-2',
      video_progress: 65,
      video_completed: false,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'demo-course-3',
    title: 'Effective Communication Skills',
    description: 'Master professional communication, active listening, and team collaboration techniques.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    duration: '60 min',
    category: 'Soft Skills',
    pass_percentage: 70,
    is_active: true,
    created_by: null,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    progress: {
      id: 'demo-progress-3',
      user_id: 'demo-user-1',
      course_id: 'demo-course-3',
      video_progress: 100,
      video_completed: true,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    latestAttempt: {
      id: 'demo-attempt-3',
      user_id: 'demo-user-1',
      course_id: 'demo-course-3',
      score: 85,
      correct_answers: 17,
      total_questions: 20,
      passed: true,
      answers: [],
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    certificate: {
      id: 'demo-cert-3',
      user_id: 'demo-user-1',
      course_id: 'demo-course-3',
      score: 85,
      issued_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      certificate_number: 'CERT-DEMO-003',
    },
  },
  {
    id: 'demo-course-4',
    title: 'Cybersecurity Awareness',
    description: 'Learn to identify and prevent cyber threats, phishing attacks, and secure your digital workspace.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    duration: '40 min',
    category: 'IT Security',
    pass_percentage: 80,
    is_active: true,
    created_by: null,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-course-5',
    title: 'Leadership Essentials',
    description: 'Develop leadership skills, team management strategies, and learn to inspire your team.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    duration: '90 min',
    category: 'Management',
    pass_percentage: 75,
    is_active: true,
    created_by: null,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    progress: {
      id: 'demo-progress-5',
      user_id: 'demo-user-1',
      course_id: 'demo-course-5',
      video_progress: 25,
      video_completed: false,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

interface DemoContextType {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  demoProfile: Profile;
  demoCourses: CourseWithProgress[];
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const enableDemoMode = () => setIsDemoMode(true);
  const disableDemoMode = () => setIsDemoMode(false);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        enableDemoMode,
        disableDemoMode,
        demoProfile: DEMO_PROFILE,
        demoCourses: DEMO_COURSES,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
