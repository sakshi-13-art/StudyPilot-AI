import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, 
  Play, Sparkles, Filter, ChevronLeft, ChevronRight, RefreshCw, BookOpen
} from 'lucide-react';
import { Course, StudySession, UserPreferences, RecoveryAudit } from '../types';
import { formatDateOffset } from '../utils/sampleData';
import { daysBetween } from '../utils/scheduler';

interface DashboardViewProps {
  courses: Course[];
  sessions: StudySession[];
  preferences: UserPreferences;
  lastAudit: RecoveryAudit | null;
  onUpdateSessionStatus: (sessionId: string, newStatus: StudySession['status']) => void;
  onOpenRecovery: () => void;
  onStartFocusSession: (session: StudySession) => void;
  onNavigateToCourses: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  sessions,
  preferences,
  lastAudit,
  onUpdateSessionStatus,
  onOpenRecovery,
  onStartFocusSession,
  onNavigateToCourses,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const todayStr = formatDateOffset(0);
  const selectedDateStr = formatDateOffset(selectedDayOffset);

  // Compute metrics
  const activeCoursesCount = courses.length;
  const totalUpcomingSessions = sessions.filter(s => s.date >= todayStr && s.status !== 'completed').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const missedSessions = sessions.filter(s => s.status === 'missed');
  
  // Find nearest exam
  const sortedExams = [...courses]
    .map(c => ({ ...c, daysUntil: daysBetween(todayStr, c.examDate) }))
    .filter(c => c.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
  const nextExam = sortedExams[0];

  // Sessions for selected date
  const filteredSessions = sessions.filter(s => {
    if (s.date !== selectedDateStr) return false;
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  // Calculate day workload
  const selectedDayTotalMinutes = sessions
    .filter(s => s.date === selectedDateStr && s.status !== 'missed')
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const isWeekend = selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6;
  const maxCapacityMinutes = (isWeekend ? preferences.weekendHoursPerDay : preferences.weekdayHoursPerDay) * 60;
  const dayCapacityPct = Math.min(100, Math.round((selectedDayTotalMinutes / maxCapacityMinutes) * 100));

  // Color mapping helper
  const getCourseColorBorder = (color: string) => {
    switch (color) {
      case 'indigo': return 'border-indigo-500';
      case 'emerald': return 'border-emerald-500';
      case 'amber': return 'border-amber-500';
      case 'rose': return 'border-rose-500';
      case 'sky': return 'border-sky-500';
      default: return 'border-slate-400';
    }
  };

  const getCourseColorBg = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-50 text-indigo-700';
      case 'emerald': return 'bg-emerald-50 text-emerald-700';
      case 'amber': return 'bg-amber-50 text-amber-700';
      case 'rose': return 'bg-rose-50 text-rose-700';
      case 'sky': return 'bg-sky-50 text-sky-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Upcoming Workload</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {totalUpcomingSessions} <span className="text-xs font-normal text-slate-500">sessions</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {completedSessions} completed this week
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Target Subjects</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {activeCoursesCount} <span className="text-xs font-normal text-slate-500">enrolled</span>
          </div>
          <button
            onClick={onNavigateToCourses}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 inline-flex items-center gap-1 cursor-pointer"
          >
            Manage syllabus <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Nearest Deadline</div>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            {nextExam ? nextExam.name : 'None'}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            {nextExam ? `${nextExam.daysUntil} days remaining (${nextExam.examDate})` : 'All cleared'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Plan Equilibrium</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono tabular-nums">
            {lastAudit ? `${lastAudit.feasibilityScore}%` : '96%'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {missedSessions.length > 0 ? (
              <span className="text-amber-600 font-semibold">{missedSessions.length} un-recovered session</span>
            ) : (
              'Zero conflicts active'
            )}
          </div>
        </div>
      </div>

      {/* Missed Sessions Recovery Callout (if any exist) */}
      {missedSessions.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-900">
                Action Required: {missedSessions.length} Study Session Missed / Interrupted
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                Past session on {missedSessions[0].date} ({missedSessions[0].courseName} - {missedSessions[0].topicTitle}) was not completed.
                Run the Autonomous Recovery Agent to recalibrate your remaining days without falling behind.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenRecovery}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Launch Recovery Agent</span>
          </button>
        </div>
      )}

      {/* 7-Day Horizon Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">7-Day Study Horizon</h2>
            <p className="text-xs text-slate-500">Select any day to inspect and manage scheduled blocks</p>
          </div>
          <div className="text-xs text-slate-500">
            Selected Day Load:{' '}
            <span className="font-semibold text-slate-900 font-mono">
              {(selectedDayTotalMinutes / 60).toFixed(1)}h / {(maxCapacityMinutes / 60).toFixed(1)}h
            </span>
          </div>
        </div>

        {/* Day selection buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[-1, 0, 1, 2, 3, 4, 5, 6].map((offset) => {
            const dateStr = formatDateOffset(offset);
            const d = new Date(dateStr + 'T00:00:00');
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = d.getDate();
            const isToday = offset === 0;
            const isSelected = selectedDayOffset === offset;

            // Day sessions stats
            const daySessions = sessions.filter(s => s.date === dateStr);
            const hasMissed = daySessions.some(s => s.status === 'missed');
            const allDone = daySessions.length > 0 && daySessions.every(s => s.status === 'completed');
            const count = daySessions.length;

            return (
              <button
                key={offset}
                onClick={() => setSelectedDayOffset(offset)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-indigo-600 text-[9px] text-white font-bold rounded">
                    Today
                  </span>
                )}
                <div className="text-[11px] font-medium text-slate-500 uppercase">{dayName}</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">{dayNum}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                  {hasMissed ? (
                    <span className="text-amber-600 font-bold">Missed</span>
                  ) : allDone ? (
                    <span className="text-emerald-600 font-medium">Done</span>
                  ) : (
                    <span>{count} session{count !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Controls Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>
                Schedule for {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              {selectedDayOffset === 0 && (
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                  Today
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Capacity allocated: {dayCapacityPct}% ({(selectedDayTotalMinutes / 60).toFixed(1)}h / {(maxCapacityMinutes / 60).toFixed(1)}h max)
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-4 space-y-3">
          {filteredSessions.map((session) => {
            const course = courses.find(c => c.id === session.courseId);
            const isCompleted = session.status === 'completed';
            const isMissed = session.status === 'missed';

            return (
              <div
                key={session.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-slate-50 border-slate-200 opacity-75' 
                    : isMissed 
                    ? 'bg-amber-50/50 border-amber-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className={`px-2 py-0.5 rounded font-medium text-[11px] ${course ? getCourseColorBg(course.color) : 'bg-slate-100 text-slate-700'}`}>
                        {session.courseCode}
                      </span>
                      <span className="font-semibold text-slate-900">{session.courseName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {session.startTime} ({session.durationMinutes} mins)
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className={`text-[11px] font-semibold uppercase ${
                        session.priorityLevel === 'critical' ? 'text-rose-600' :
                        session.priorityLevel === 'high' ? 'text-amber-600' :
                        'text-slate-600'
                      }`}>
                        Priority: {session.priorityScore} ({session.priorityLevel})
                      </span>
                    </div>

                    <div className="text-sm font-medium text-slate-800">
                      {session.topicTitle}
                    </div>

                    {session.notes && (
                      <div className="text-xs text-slate-500 italic">
                        {session.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isCompleted && !isMissed && (
                      <button
                        onClick={() => onStartFocusSession(session)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Start focus timer for this session"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}

                    {/* Toggle Complete */}
                    <button
                      onClick={() => onUpdateSessionStatus(session.id, isCompleted ? 'scheduled' : 'completed')}
                      className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                        isCompleted
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Complete'}</span>
                    </button>

                    {/* Toggle Missed */}
                    <button
                      onClick={() => onUpdateSessionStatus(session.id, isMissed ? 'scheduled' : 'missed')}
                      className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                        isMissed
                          ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      title={isMissed ? 'Clear missed state' : 'Mark as missed session'}
                    >
                      <XCircle className={`w-4 h-4 ${isMissed ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">{isMissed ? 'Missed' : 'Missed'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-800">
                No study sessions scheduled for this day
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Enjoy your rest or buffer period! If you have missed sessions from other days, use the Autonomous Recovery Agent to shift them here.
              </p>
              <button
                onClick={onOpenRecovery}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Distribute Buffer Hours</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
