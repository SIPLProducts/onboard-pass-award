import { Course, Question, User } from '@/types/lms';

export const currentUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@company.com',
  employeeId: 'EMP-2024-0892',
  department: 'Engineering',
};

export const courses: Course[] = [
  {
    id: '1',
    title: 'Company Induction – Safety & Culture',
    description: 'Learn about our company culture, core values, and essential workplace safety protocols. This foundational course covers emergency procedures, reporting guidelines, and our commitment to creating a safe and inclusive environment.',
    thumbnail: '',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '25 min',
    category: 'Onboarding',
    passPercentage: 70,
    status: 'not_started',
    progress: 0,
  },
  {
    id: '2',
    title: 'Data Security & Privacy Essentials',
    description: 'Understand data protection regulations, best practices for handling sensitive information, and your responsibilities in maintaining our security posture. Covers GDPR, data classification, and incident reporting.',
    thumbnail: '',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '30 min',
    category: 'Compliance',
    passPercentage: 80,
    status: 'not_started',
    progress: 0,
  },
  {
    id: '3',
    title: 'Effective Communication in Teams',
    description: 'Master the art of professional communication in a remote-first environment. Learn about async communication, meeting etiquette, and tools that enhance team collaboration.',
    thumbnail: '',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '20 min',
    category: 'Professional Development',
    passPercentage: 70,
    status: 'completed',
    progress: 100,
    completedAt: '2024-01-15',
    score: 85,
  },
];

export const courseQuestions: Record<string, Question[]> = {
  '1': [
    {
      id: 'q1',
      question: 'What is the first step you should take during a fire emergency?',
      options: [
        'Continue working until further notice',
        'Alert others and proceed to the nearest emergency exit',
        'Call your manager',
        'Gather your personal belongings',
      ],
      correctAnswer: 1,
      explanation: 'Safety is the priority. Alert others and evacuate immediately using the nearest exit.',
    },
    {
      id: 'q2',
      question: 'Which of the following best describes our company culture?',
      options: [
        'Individual achievement over teamwork',
        'Collaborative, inclusive, and innovation-driven',
        'Strictly hierarchical',
        'Competition between departments',
      ],
      correctAnswer: 1,
      explanation: 'Our culture emphasizes collaboration, inclusion, and fostering innovation.',
    },
    {
      id: 'q3',
      question: 'How should you report a workplace safety concern?',
      options: [
        'Only report it if someone gets injured',
        'Post about it on social media',
        'Report through the designated safety portal or to your manager immediately',
        'Wait until the annual review',
      ],
      correctAnswer: 2,
      explanation: 'All safety concerns should be reported promptly through proper channels.',
    },
    {
      id: 'q4',
      question: 'What is the purpose of the buddy system for new employees?',
      options: [
        'To monitor employee performance',
        'To provide guidance, support, and help new hires integrate smoothly',
        'To assign extra work',
        'To evaluate probation period',
      ],
      correctAnswer: 1,
      explanation: 'The buddy system helps new employees feel welcomed and supported.',
    },
    {
      id: 'q5',
      question: 'Where can you find the complete employee handbook?',
      options: [
        'Ask your colleagues',
        'The company intranet under HR Resources',
        'It doesn\'t exist',
        'Only managers have access',
      ],
      correctAnswer: 1,
      explanation: 'The employee handbook is accessible to all employees on the company intranet.',
    },
  ],
  '2': [
    {
      id: 'q1',
      question: 'What does GDPR stand for?',
      options: [
        'General Data Protection Regulation',
        'Global Data Privacy Rules',
        'Government Data Processing Requirements',
        'General Digital Privacy Regulation',
      ],
      correctAnswer: 0,
      explanation: 'GDPR stands for General Data Protection Regulation.',
    },
    {
      id: 'q2',
      question: 'How should you handle a suspected data breach?',
      options: [
        'Ignore it if no customer data seems affected',
        'Report it to the security team immediately',
        'Try to fix it yourself',
        'Wait 24 hours to see if it resolves',
      ],
      correctAnswer: 1,
      explanation: 'All suspected breaches must be reported immediately to the security team.',
    },
    {
      id: 'q3',
      question: 'What classification level requires encryption for data at rest?',
      options: [
        'Public information only',
        'Internal documents only',
        'Confidential and Restricted data',
        'No data requires encryption',
      ],
      correctAnswer: 2,
      explanation: 'Confidential and Restricted data must be encrypted both in transit and at rest.',
    },
    {
      id: 'q4',
      question: 'Which of the following is a strong password practice?',
      options: [
        'Using your birthday',
        'Using a combination of letters, numbers, and symbols with 12+ characters',
        'Using the same password for all accounts',
        'Writing passwords on sticky notes',
      ],
      correctAnswer: 1,
      explanation: 'Strong passwords use a mix of characters and are at least 12 characters long.',
    },
    {
      id: 'q5',
      question: 'What is phishing?',
      options: [
        'A type of fishing sport',
        'Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities',
        'A software update process',
        'A team building activity',
      ],
      correctAnswer: 1,
      explanation: 'Phishing is a cyber attack that uses deceptive emails or messages to steal information.',
    },
  ],
};
