import { Course, StudySession, UserPreferences } from '../types';

// Helper to format date as YYYY-MM-DD
export function formatDateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const initialUserPreferences: UserPreferences = {
  studentName: 'Sakshi Sisode',
  targetExamPeriod: 'Semester V Midterms & Lab Evaluations',
  weekdayHoursPerDay: 3.5,
  weekendHoursPerDay: 6.0,
  breakIntervalMinutes: 10,
  preferredStudySlots: ['afternoon', 'evening'],
};

export const sampleCourses: Course[] = [
  {
    id: 'c1',
    name: 'Data Structures & Algorithms',
    code: 'CSBS-301',
    color: 'indigo',
    examDate: formatDateOffset(5), // 5 days from now
    credits: 4,
    difficulty: 5,
    confidence: 2, // Low confidence -> high priority!
    totalTargetHours: 18,
    topics: [
      { id: 't1_1', title: 'Dynamic Programming (Memoization & Tabulation)', estimatedMinutes: 90, completed: false },
      { id: 't1_2', title: 'Graph Algorithms: Dijkstra & Bellman-Ford', estimatedMinutes: 90, completed: false },
      { id: 't1_3', title: 'Disjoint Set Union & Minimum Spanning Trees', estimatedMinutes: 60, completed: false },
      { id: 't1_4', title: 'Segment Trees and Range Queries', estimatedMinutes: 90, completed: false },
      { id: 't1_5', title: 'Binary Search Trees & AVL Rotations', estimatedMinutes: 60, completed: true },
    ],
  },
  {
    id: 'c2',
    name: 'Operating Systems & Concurrency',
    code: 'CSBS-302',
    color: 'emerald',
    examDate: formatDateOffset(8), // 8 days from now
    credits: 4,
    difficulty: 4,
    confidence: 3,
    totalTargetHours: 14,
    topics: [
      { id: 't2_1', title: 'Virtual Memory & Page Replacement (LRU, FIFO)', estimatedMinutes: 75, completed: false },
      { id: 't2_2', title: 'Semaphore & Mutex Synchronization Deadlocks', estimatedMinutes: 90, completed: false },
      { id: 't2_3', title: 'CPU Scheduling Algorithms (Round Robin, SRTF)', estimatedMinutes: 60, completed: false },
      { id: 't2_4', title: 'File System Inodes & Directory Implementation', estimatedMinutes: 60, completed: false },
    ],
  },
  {
    id: 'c3',
    name: 'Applied Machine Learning',
    code: 'CSBS-303',
    color: 'amber',
    examDate: formatDateOffset(11), // 11 days from now
    credits: 3,
    difficulty: 4,
    confidence: 4,
    totalTargetHours: 10,
    topics: [
      { id: 't3_1', title: 'Backpropagation & Gradient Descent Optimization', estimatedMinutes: 90, completed: false },
      { id: 't3_2', title: 'Regularization (L1 Lasso vs L2 Ridge) & Dropout', estimatedMinutes: 60, completed: false },
      { id: 't3_3', title: 'Support Vector Machines & Kernel Trick', estimatedMinutes: 60, completed: false },
      { id: 't3_4', title: 'Decision Trees & Random Forests', estimatedMinutes: 60, completed: true },
    ],
  },
  {
    id: 'c4',
    name: 'Linear Algebra & Matrix Methods',
    code: 'MATH-204',
    color: 'rose',
    examDate: formatDateOffset(4), // 4 days from now! High urgency!
    credits: 3,
    difficulty: 4,
    confidence: 2, // Low confidence & close exam
    totalTargetHours: 12,
    topics: [
      { id: 't4_1', title: 'Eigenvalues, Eigenvectors & Diagonalization', estimatedMinutes: 90, completed: false },
      { id: 't4_2', title: 'Singular Value Decomposition (SVD)', estimatedMinutes: 75, completed: false },
      { id: 't4_3', title: 'Gram-Schmidt Orthogonalization Process', estimatedMinutes: 60, completed: false },
      { id: 't4_4', title: 'Vector Spaces, Subspaces & Basis', estimatedMinutes: 60, completed: true },
    ],
  },
  {
    id: 'c5',
    name: 'Computer Networks & Protocols',
    code: 'CSBS-305',
    color: 'sky',
    examDate: formatDateOffset(14), // 14 days from now
    credits: 3,
    difficulty: 3,
    confidence: 4,
    totalTargetHours: 8,
    topics: [
      { id: 't5_1', title: 'TCP 3-Way Handshake, Flow & Congestion Control', estimatedMinutes: 60, completed: false },
      { id: 't5_2', title: 'Subnetting, CIDR & IP Addressing Calculations', estimatedMinutes: 60, completed: false },
      { id: 't5_3', title: 'Routing Protocols: OSPF vs BGP Fundamentals', estimatedMinutes: 60, completed: false },
    ],
  },
];

// Initial pre-allocated schedule for the upcoming days
export function generateInitialSessions(courses: Course[]): StudySession[] {
  const sessions: StudySession[] = [];
  
  // Day 0 (Today)
  sessions.push({
    id: 's_today_1',
    courseId: 'c4',
    courseName: 'Linear Algebra & Matrix Methods',
    courseCode: 'MATH-204',
    topicTitle: 'Eigenvalues, Eigenvectors & Diagonalization',
    topicId: 't4_1',
    date: formatDateOffset(0),
    startTime: '16:00',
    durationMinutes: 90,
    status: 'scheduled',
    priorityScore: 92,
    priorityLevel: 'critical',
    notes: 'Exam in 4 days! High importance practice proofs.',
  });

  sessions.push({
    id: 's_today_2',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CSBS-301',
    topicTitle: 'Dynamic Programming (Memoization & Tabulation)',
    topicId: 't1_1',
    date: formatDateOffset(0),
    startTime: '18:00',
    durationMinutes: 90,
    status: 'scheduled',
    priorityScore: 89,
    priorityLevel: 'critical',
    notes: 'Solve 0/1 Knapsack and Longest Common Subsequence.',
  });

  // Day -1 (Yesterday) - marked as missed to demonstrate recovery trigger!
  sessions.push({
    id: 's_yest_1',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CSBS-301',
    topicTitle: 'Graph Algorithms: Dijkstra & Bellman-Ford',
    topicId: 't1_2',
    date: formatDateOffset(-1),
    startTime: '17:00',
    durationMinutes: 90,
    status: 'missed', // Missed session that triggers recovery!
    priorityScore: 88,
    priorityLevel: 'critical',
    notes: 'Lab ran over time yesterday; was unable to complete.',
  });

  // Day +1 (Tomorrow)
  sessions.push({
    id: 's_d1_1',
    courseId: 'c4',
    courseName: 'Linear Algebra & Matrix Methods',
    courseCode: 'MATH-204',
    topicTitle: 'Singular Value Decomposition (SVD)',
    topicId: 't4_2',
    date: formatDateOffset(1),
    startTime: '16:30',
    durationMinutes: 75,
    status: 'scheduled',
    priorityScore: 90,
    priorityLevel: 'critical',
  });

  sessions.push({
    id: 's_d1_2',
    courseId: 'c2',
    courseName: 'Operating Systems & Concurrency',
    courseCode: 'CSBS-302',
    topicTitle: 'Virtual Memory & Page Replacement (LRU, FIFO)',
    topicId: 't2_1',
    date: formatDateOffset(1),
    startTime: '18:15',
    durationMinutes: 75,
    status: 'scheduled',
    priorityScore: 78,
    priorityLevel: 'high',
  });

  // Day +2
  sessions.push({
    id: 's_d2_1',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CSBS-301',
    topicTitle: 'Disjoint Set Union & Minimum Spanning Trees',
    topicId: 't1_3',
    date: formatDateOffset(2),
    startTime: '16:00',
    durationMinutes: 60,
    status: 'scheduled',
    priorityScore: 84,
    priorityLevel: 'high',
  });

  sessions.push({
    id: 's_d2_2',
    courseId: 'c2',
    courseName: 'Operating Systems & Concurrency',
    courseCode: 'CSBS-302',
    topicTitle: 'Semaphore & Mutex Synchronization Deadlocks',
    topicId: 't2_2',
    date: formatDateOffset(2),
    startTime: '17:30',
    durationMinutes: 90,
    status: 'scheduled',
    priorityScore: 79,
    priorityLevel: 'high',
  });

  // Day +3
  sessions.push({
    id: 's_d3_1',
    courseId: 'c4',
    courseName: 'Linear Algebra & Matrix Methods',
    courseCode: 'MATH-204',
    topicTitle: 'Gram-Schmidt Orthogonalization Process',
    topicId: 't4_3',
    date: formatDateOffset(3),
    startTime: '15:00',
    durationMinutes: 60,
    status: 'scheduled',
    priorityScore: 94,
    priorityLevel: 'critical',
  });

  sessions.push({
    id: 's_d3_2',
    courseId: 'c3',
    courseName: 'Applied Machine Learning',
    courseCode: 'CSBS-303',
    topicTitle: 'Backpropagation & Gradient Descent Optimization',
    topicId: 't3_1',
    date: formatDateOffset(3),
    startTime: '16:30',
    durationMinutes: 90,
    status: 'scheduled',
    priorityScore: 72,
    priorityLevel: 'medium',
  });

  // Day +4 (Linear Algebra Exam Day!)
  sessions.push({
    id: 's_d4_1',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CSBS-301',
    topicTitle: 'Segment Trees and Range Queries',
    topicId: 't1_4',
    date: formatDateOffset(4),
    startTime: '17:00',
    durationMinutes: 90,
    status: 'scheduled',
    priorityScore: 86,
    priorityLevel: 'high',
  });

  // Day +5 (DSA Exam Day!)
  sessions.push({
    id: 's_d5_1',
    courseId: 'c2',
    courseName: 'Operating Systems & Concurrency',
    courseCode: 'CSBS-302',
    topicTitle: 'CPU Scheduling Algorithms (Round Robin, SRTF)',
    topicId: 't2_3',
    date: formatDateOffset(5),
    startTime: '16:00',
    durationMinutes: 60,
    status: 'scheduled',
    priorityScore: 80,
    priorityLevel: 'high',
  });

  // Day +6
  sessions.push({
    id: 's_d6_1',
    courseId: 'c3',
    courseName: 'Applied Machine Learning',
    courseCode: 'CSBS-303',
    topicTitle: 'Regularization (L1 Lasso vs L2 Ridge) & Dropout',
    topicId: 't3_2',
    date: formatDateOffset(6),
    startTime: '15:00',
    durationMinutes: 60,
    status: 'scheduled',
    priorityScore: 68,
    priorityLevel: 'medium',
  });

  // Day +7
  sessions.push({
    id: 's_d7_1',
    courseId: 'c5',
    courseName: 'Computer Networks & Protocols',
    courseCode: 'CSBS-305',
    topicTitle: 'TCP 3-Way Handshake, Flow & Congestion Control',
    topicId: 't5_1',
    date: formatDateOffset(7),
    startTime: '16:00',
    durationMinutes: 60,
    status: 'scheduled',
    priorityScore: 65,
    priorityLevel: 'medium',
  });

  return sessions;
}
