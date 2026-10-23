import React, { useState, useEffect } from 'react';
import { TopNavigation, ActiveTab } from './components/TopNavigation';
import { DashboardView } from './components/DashboardView';
import { CoursesView } from './components/CoursesView';
import { RecoveryAgentModal } from './components/RecoveryAgentModal';
import { FocusTimerView } from './components/FocusTimerView';
import { JudgeDemoGuide } from './components/JudgeDemoGuide';
import { PreferencesModal } from './components/PreferencesModal';
import { Course, RecoveryAudit, StudySession, UserPreferences } from './types';
import { loadSavedState, saveState, resetToDefaults } from './utils/storage';
import { detectScheduleConflicts } from './utils/scheduler';
import { Settings, RefreshCw, Sparkles, BookOpen, Clock, Award } from 'lucide-react';

export default function App() {
  // Load state from local storage or fallback to realistic CSBS initial data
  const [courses, setCourses] = useState<Course[]>(() => loadSavedState().courses);
  const [sessions, setSessions] = useState<StudySession[]>(() => loadSavedState().sessions);
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadSavedState().preferences);
  const [lastAudit, setLastAudit] = useState<RecoveryAudit | null>(() => loadSavedState().lastAudit);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState<boolean>(false);
  const [activeFocusSession, setActiveFocusSession] = useState<StudySession | null>(null);

  // Sync state to local storage on change
  useEffect(() => {
    saveState({ courses, sessions, preferences, lastAudit });
  }, [courses, sessions, preferences, lastAudit]);

  // Check conflicts
  const conflicts = detectScheduleConflicts(sessions, courses, preferences);

  // Handlers
  const handleUpdateSessionStatus = (sessionId: string, newStatus: StudySession['status']) => {
    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });
    setSessions(updated);
  };

  const handleApplyRecovery = (updatedSessions: StudySession[], audit: RecoveryAudit) => {
    setSessions(updatedSessions);
    setLastAudit(audit);
  };

  const handleUpdateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  const handleResetDefaults = () => {
    const fresh = resetToDefaults();
    setCourses(fresh.courses);
    setSessions(fresh.sessions);
    setPreferences(fresh.preferences);
    setLastAudit(fresh.lastAudit);
  };

  const handleStartFocusSession = (session: StudySession) => {
    setActiveFocusSession(session);
    setActiveTab('timer');
  };

  const handleCompleteSession = (sessionId: string) => {
    handleUpdateSessionStatus(sessionId, 'completed');
    
    // Also mark topic complete in course if linked
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession && targetSession.topicId) {
      setCourses(prev =>
        prev.map(c => {
          if (c.id === targetSession.courseId) {
            return {
              ...c,
              topics: c.topics.map(t =>
                t.id === targetSession.topicId ? { ...t, completed: true } : t
              ),
            };
          }
          return c;
        })
      );
    }
  };

  const handleInterruptedSession = (sessionId: string, elapsedMinutes: number) => {
    // Mark as missed/interrupted
    handleUpdateSessionStatus(sessionId, 'missed');
    // Open recovery modal immediately to resolve!
    setIsRecoveryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasConflicts={conflicts.hasConflicts}
        onOpenRecovery={() => setIsRecoveryModalOpen(true)}
      />

      {/* Subheader Profile & Quick Toolbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-900">{preferences.studentName}</span>
            <span className="text-slate-400">/</span>
            <span>{preferences.targetExamPeriod}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-mono">
              Daily Target: {preferences.weekdayHoursPerDay}h (Wk) · {preferences.weekendHoursPerDay}h (Wknd)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreferencesModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all demo courses and sample sessions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' && (
          <DashboardView
            courses={courses}
            sessions={sessions}
            preferences={preferences}
            lastAudit={lastAudit}
            onUpdateSessionStatus={handleUpdateSessionStatus}
            onOpenRecovery={() => setIsRecoveryModalOpen(true)}
            onStartFocusSession={handleStartFocusSession}
            onNavigateToCourses={() => setActiveTab('courses')}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            courses={courses}
            onUpdateCourses={handleUpdateCourses}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'recovery' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Autonomous Study Recovery Center</h2>
                <p className="text-xs text-slate-500">
                  When life causes interruptions, StudyPilot AI uses a deterministic constraint solver to recalibrate your entire schedule.
                </p>
              </div>
              <button
                onClick={() => setIsRecoveryModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Open Interactive Simulator</span>
              </button>
            </div>

            {/* Embedded Recovery Dashboard */}
            <JudgeDemoGuide
              onOpenRecovery={() => setIsRecoveryModalOpen(true)}
              onNavigateToSchedule={() => setActiveTab('schedule')}
            />
          </div>
        )}

        {activeTab === 'timer' && (
          <FocusTimerView
            sessions={sessions}
            courses={courses}
            activeSession={activeFocusSession}
            onCompleteSession={handleCompleteSession}
            onInterruptedSession={handleInterruptedSession}
            onSelectSession={setActiveFocusSession}
          />
        )}

        {activeTab === 'guide' && (
          <JudgeDemoGuide
            onOpenRecovery={() => setIsRecoveryModalOpen(true)}
            onNavigateToSchedule={() => setActiveTab('schedule')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-800">StudyPilot AI</span> — Autonomous Academic Planning & Recovery Agent.
            Built for Hackathon Solo Web Dev Challenge.
          </div>
          <div className="text-slate-400">
            In-Browser Deterministic Constraint Engine · Data persists locally via browser storage
          </div>
        </div>
      </footer>

      {/* Recovery Agent Interactive Modal */}
      <RecoveryAgentModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        courses={courses}
        sessions={sessions}
        preferences={preferences}
        lastAudit={lastAudit}
        onApplyRecovery={handleApplyRecovery}
        onUpdateCourses={handleUpdateCourses}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        preferences={preferences}
        onSavePreferences={setPreferences}
      />
    </div>
  );
}
