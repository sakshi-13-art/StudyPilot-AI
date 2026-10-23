import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { StudySession, Course } from '../types';
import { formatDateOffset } from '../utils/sampleData';

interface FocusTimerViewProps {
  sessions: StudySession[];
  courses: Course[];
  activeSession: StudySession | null;
  onCompleteSession: (sessionId: string) => void;
  onInterruptedSession: (sessionId: string, elapsedMinutes: number) => void;
  onSelectSession: (session: StudySession) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  sessions,
  courses,
  activeSession,
  onCompleteSession,
  onInterruptedSession,
  onSelectSession,
}) => {
  const todayStr = formatDateOffset(0);
  const todaySessions = sessions.filter(s => s.date === todayStr && s.status !== 'completed');

  // Default timer state
  const [selectedDurationMin, setSelectedDurationMin] = useState<number>(
    activeSession ? activeSession.durationMinutes : 45
  );
  const [secondsRemaining, setSecondsRemaining] = useState<number>(selectedDurationMin * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  // Sync with active session when selected
  useEffect(() => {
    if (activeSession) {
      setSelectedDurationMin(activeSession.durationMinutes);
      setSecondsRemaining(activeSession.durationMinutes * 60);
      setIsRunning(false);
    }
  }, [activeSession]);

  // Interval timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      handleFinishSuccess();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsRemaining]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(selectedDurationMin * 60);
  };

  const handleSelectPreset = (minutes: number) => {
    setSelectedDurationMin(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
  };

  const handleFinishSuccess = () => {
    if (activeSession) {
      onCompleteSession(activeSession.id);
      setCompletionMessage(`Great work! Completed "${activeSession.topicTitle}" (${selectedDurationMin} mins).`);
      setTimeout(() => setCompletionMessage(null), 4000);
    }
  };

  const handleLogInterruption = () => {
    const elapsedMinutes = Math.max(1, Math.round((selectedDurationMin * 60 - secondsRemaining) / 60));
    setIsRunning(false);
    if (activeSession) {
      onInterruptedSession(activeSession.id, elapsedMinutes);
    }
  };

  // Format mm:ss
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const totalSeconds = selectedDurationMin * 60;
  const progressPct = totalSeconds > 0 ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Active Focus Workspace</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Deep work sprint with integrated recovery tracking. If life interrupts this session, StudyPilot AI will automatically re-balance your study plan.
        </p>
      </div>

      {completionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{completionMessage}</span>
        </div>
      )}

      {/* Target Session Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Target Session from Today's Schedule
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {todaySessions.map((s) => {
            const isSelected = activeSession?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSession(s)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-[11px] font-semibold text-indigo-700">
                  {s.courseCode} · {s.startTime} ({s.durationMinutes}m)
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                  {s.topicTitle}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Priority Score: {s.priorityScore} ({s.priorityLevel})
                </div>
              </button>
            );
          })}

          {todaySessions.length === 0 && (
            <div className="col-span-2 text-center py-4 text-xs text-slate-400 italic">
              All today's sessions completed, or none scheduled. You can run a custom sprint below.
            </div>
          )}
        </div>
      </div>

      {/* Focus Timer Display */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-6">
        {/* Preset duration buttons */}
        <div className="flex justify-center items-center gap-2">
          {[25, 45, 60, 90].map((m) => (
            <button
              key={m}
              onClick={() => handleSelectPreset(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDurationMin === m
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m} mins
            </button>
          ))}
        </div>

        {/* Big Digit Display */}
        <div className="py-6">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold text-slate-900 tracking-tight tabular-nums">
            {timeDisplay}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            {activeSession ? `Active: ${activeSession.courseName}` : 'Custom Study Sprint'}
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={toggleRunning}
            className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Sprint</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start Focus Sprint'}</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Completion & Interruption Triggers */}
        {activeSession && (
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              onClick={handleFinishSuccess}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mark Session Finished & Logged</span>
            </button>

            <button
              onClick={handleLogInterruption}
              className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="If you had to stop early, the Recovery Agent will reschedule the remainder"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Interrupted Early? (Run Recovery)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
