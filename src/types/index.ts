export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type SessionStatus = 'scheduled' | 'completed' | 'missed' | 'in_progress';

export interface Topic {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind color token or hex
  examDate: string; // ISO date string YYYY-MM-DD
  credits: number; // 1-5
  difficulty: number; // 1-5
  confidence: number; // 1-5
  topics: Topic[];
  totalTargetHours: number;
}

export interface StudySession {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  topicTitle: string;
  topicId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  status: SessionStatus;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  notes?: string;
  completedAt?: string;
}

export interface DailyCapacity {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  availableMinutes: number;
  allocatedMinutes: number;
  notes?: string;
}

export interface RecoveryAction {
  id: string;
  type: 'rescheduled' | 'compressed' | 'promoted' | 'shifted_to_buffer';
  sessionId: string;
  courseName: string;
  topicTitle: string;
  originalDate: string;
  newDate: string;
  originalDuration: number;
  newDuration: number;
  reason: string;
}

export interface RecoveryAudit {
  timestamp: string;
  triggerReason: string;
  hoursRecovered: number;
  actions: RecoveryAction[];
  feasibilityScore: number; // 0-100%
  conflictsResolved: number;
}

export interface UserPreferences {
  studentName: string;
  targetExamPeriod: string;
  weekdayHoursPerDay: number;
  weekendHoursPerDay: number;
  breakIntervalMinutes: number;
  preferredStudySlots: ('morning' | 'afternoon' | 'evening')[];
}
