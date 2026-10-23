import { Course, RecoveryAudit, StudySession, UserPreferences } from '../types';
import { generateInitialSessions, initialUserPreferences, sampleCourses } from './sampleData';

const STORAGE_KEYS = {
  COURSES: 'studypilot_courses_v1',
  SESSIONS: 'studypilot_sessions_v1',
  PREFERENCES: 'studypilot_prefs_v1',
  LAST_AUDIT: 'studypilot_last_audit_v1',
};

export interface AppState {
  courses: Course[];
  sessions: StudySession[];
  preferences: UserPreferences;
  lastAudit: RecoveryAudit | null;
}

export function loadSavedState(): AppState {
  try {
    const rawCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
    const rawSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const rawPrefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const rawAudit = localStorage.getItem(STORAGE_KEYS.LAST_AUDIT);

    const courses = rawCourses ? JSON.parse(rawCourses) : sampleCourses;
    const sessions = rawSessions ? JSON.parse(rawSessions) : generateInitialSessions(sampleCourses);
    const preferences = rawPrefs ? JSON.parse(rawPrefs) : initialUserPreferences;
    const lastAudit = rawAudit ? JSON.parse(rawAudit) : null;

    return { courses, sessions, preferences, lastAudit };
  } catch (err) {
    console.warn('Failed to parse localStorage, resetting to defaults', err);
    return {
      courses: sampleCourses,
      sessions: generateInitialSessions(sampleCourses),
      preferences: initialUserPreferences,
      lastAudit: null,
    };
  }
}

export function saveState(state: Partial<AppState>) {
  try {
    if (state.courses) localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(state.courses));
    if (state.sessions) localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(state.sessions));
    if (state.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(state.preferences));
    if (state.lastAudit !== undefined) {
      if (state.lastAudit) {
        localStorage.setItem(STORAGE_KEYS.LAST_AUDIT, JSON.stringify(state.lastAudit));
      } else {
        localStorage.removeItem(STORAGE_KEYS.LAST_AUDIT);
      }
    }
  } catch (err) {
    console.warn('Failed to save to localStorage', err);
  }
}

export function resetToDefaults(): AppState {
  localStorage.removeItem(STORAGE_KEYS.COURSES);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  localStorage.removeItem(STORAGE_KEYS.LAST_AUDIT);

  const freshCourses = sampleCourses;
  const freshSessions = generateInitialSessions(freshCourses);
  const freshPrefs = initialUserPreferences;

  saveState({
    courses: freshCourses,
    sessions: freshSessions,
    preferences: freshPrefs,
    lastAudit: null,
  });

  return {
    courses: freshCourses,
    sessions: freshSessions,
    preferences: freshPrefs,
    lastAudit: null,
  };
}
