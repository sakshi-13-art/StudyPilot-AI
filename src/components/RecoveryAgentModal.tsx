import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Zap, Sliders, Info, Sparkles, Clock } from 'lucide-react';
import { Course, RecoveryAudit, StudySession, UserPreferences } from '../types';
import { runAutonomousRecovery, detectScheduleConflicts } from '../utils/scheduler';
import { formatDateOffset } from '../utils/sampleData';

interface RecoveryAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  sessions: StudySession[];
  preferences: UserPreferences;
  lastAudit: RecoveryAudit | null;
  onApplyRecovery: (updatedSessions: StudySession[], audit: RecoveryAudit) => void;
  onUpdateCourses: (courses: Course[]) => void;
}

export const RecoveryAgentModal: React.FC<RecoveryAgentModalProps> = ({
  isOpen,
  onClose,
  courses,
  sessions,
  preferences,
  lastAudit,
  onApplyRecovery,
  onUpdateCourses,
}) => {
  const [selectedDisruption, setSelectedDisruption] = useState<'missed_session' | 'reduced_today' | 'exam_moved' | 'confidence_drop' | 'manual_optimize'>('missed_session');
  const [disruptionNote, setDisruptionNote] = useState<string>('Missed yesterday’s 90m Data Structures session due to lab overtime');
  const [lostMinutes, setLostMinutes] = useState<number>(120);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const conflicts = detectScheduleConflicts(sessions, courses, preferences);

  const handleRunRecovery = () => {
    setIsProcessing(true);
    
    // Slight human-like settling delay for visual clarity in live demos
    setTimeout(() => {
      const result = runAutonomousRecovery(sessions, courses, preferences, {
        type: selectedDisruption,
        details: disruptionNote,
        lostMinutesToday: lostMinutes,
      });

      onApplyRecovery(result.updatedSessions, result.audit);
      setIsProcessing(false);
    }, 280);
  };

  // Preset demo triggers designed for 1-click judging demonstration
  const setDemoScenario = (scenario: 'missed' | 'emergency' | 'exam_moved' | 'confidence') => {
    if (scenario === 'missed') {
      setSelectedDisruption('missed_session');
      setDisruptionNote('Missed 90m DSA session yesterday due to university lab overload');
    } else if (scenario === 'emergency') {
      setSelectedDisruption('reduced_today');
      setLostMinutes(120);
      setDisruptionNote('Unexpected department event today: available study capacity reduced by 2 hours');
    } else if (scenario === 'exam_moved') {
      setSelectedDisruption('exam_moved');
      setDisruptionNote('Operating Systems exam pulled forward 3 days earlier by professor');
      // Update OS exam date
      const updated = courses.map(c => {
        if (c.code === 'CSBS-302') {
          return { ...c, examDate: formatDateOffset(5) }; // from 8 to 5
        }
        return c;
      });
      onUpdateCourses(updated);
    } else if (scenario === 'confidence') {
      setSelectedDisruption('confidence_drop');
      setDisruptionNote('Failed mock quiz: Linear Algebra confidence dropped from 3 to 1');
      const updated = courses.map(c => {
        if (c.code === 'MATH-204') {
          return { ...c, confidence: 1 };
        }
        return c;
      });
      onUpdateCourses(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Autonomous Study Recovery Agent</h2>
              <p className="text-xs text-slate-500">Deterministic constraint solver & dynamic plan recalibration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Conflict Status Banner */}
          <div className={`p-4 rounded-lg border ${
            conflicts.hasConflicts 
              ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-start gap-3">
              {conflicts.hasConflicts ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-sm">
                  {conflicts.hasConflicts 
                    ? `Schedule Conflict Detected (${conflicts.missedCount} unresolved missed sessions)`
                    : 'Current Plan is Feasible & In Equilibrium'}
                </div>
                <p className="leading-relaxed opacity-90">
                  {conflicts.hasConflicts 
                    ? 'Static schedules break when deadlines clash or sessions are missed. The Autonomous Recovery Agent re-distributes your workload into feasible buffers without manual guesswork.'
                    : 'All upcoming syllabus requirements fit within your allocated daily capacity. Use the simulator below to test how the agent adapts to unexpected disruptions.'}
                </p>
                {conflicts.urgentCourseDeficits.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-amber-200/60 font-medium">
                    Priority Attention: {conflicts.urgentCourseDeficits.map(d => `${d.courseName} (Exam in ${d.daysLeft}d, Confidence ${d.confidence}/5)`).join(' · ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Demo Scenarios (For Hackathon Judges) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Judge Demo: Quick Disruption Scenarios
              </label>
              <span className="text-xs text-indigo-600 font-medium">1-Click Test Cases</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoScenario('missed')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  selectedDisruption === 'missed_session' 
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  1. Missed Past Session
                </div>
                <div className="text-slate-500 mt-1 leading-normal">
                  Yesterday’s 90m DSA lab session was missed. Re-distribute before exam in 5 days.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoScenario('emergency')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  selectedDisruption === 'reduced_today' 
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  2. Sudden Lost Time (2h)
                </div>
                <div className="text-slate-500 mt-1 leading-normal">
                  Emergency cut today’s available time to 1 hour. Evict low priority to weekend buffer.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoScenario('exam_moved')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  selectedDisruption === 'exam_moved' 
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  3. Exam Date Advanced
                </div>
                <div className="text-slate-500 mt-1 leading-normal">
                  Operating Systems exam moved 3 days earlier. Reprioritize urgency and compress review.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoScenario('confidence')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  selectedDisruption === 'confidence_drop' 
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-rose-600" />
                  4. Confidence Drop
                </div>
                <div className="text-slate-500 mt-1 leading-normal">
                  Scored poorly on Linear Algebra mock quiz. Confidence drops to 1/5; needs emergency priority.
                </div>
              </button>
            </div>
          </div>

          {/* Disruption Details Form */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Disruption Note / Context
              </label>
              <input
                type="text"
                value={disruptionNote}
                onChange={(e) => setDisruptionNote(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the schedule interruption..."
              />
            </div>

            {selectedDisruption === 'reduced_today' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hours Lost Today: {(lostMinutes / 60).toFixed(1)} hrs ({lostMinutes} mins)
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="30"
                  value={lostMinutes}
                  onChange={(e) => setLostMinutes(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={handleRunRecovery}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Recalibrating Schedule...' : 'Execute Autonomous Recovery'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Formula: Priority = Urgency(1/Days) + Deficit(6-Conf) + Difficulty(1.2) + Weight(0.8)
            </p>
          </div>

          {/* Explainable Audit Log of Last Recovery */}
          {lastAudit && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Explainable Recalibration Audit Trail</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Executed at {lastAudit.timestamp} · Feasibility {lastAudit.feasibilityScore}%
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                <div className="font-medium text-slate-800">
                  Trigger: <span className="text-slate-600 font-normal">{lastAudit.triggerReason}</span>
                </div>
                <div className="text-slate-700 font-medium">
                  Modifications Applied ({lastAudit.actions.length} actions taken, {lastAudit.hoursRecovered}h recovered):
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {lastAudit.actions.map((act) => (
                    <div key={act.id} className="p-2.5 bg-white rounded border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{act.courseName}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                          act.type === 'compressed' ? 'bg-amber-100 text-amber-800' :
                          act.type === 'shifted_to_buffer' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {act.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Topic: <span className="font-medium text-slate-800">{act.topicTitle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Original: {act.originalDate} ({act.originalDuration}m)</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-800">New: {act.newDate} ({act.newDuration}m)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        Why: {act.reason}
                      </p>
                    </div>
                  ))}

                  {lastAudit.actions.length === 0 && (
                    <div className="text-slate-500 italic py-2 text-center">
                      Zero conflicts found; schedule already balanced optimally.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            StudyPilot AI · Deterministic Constraint Solver
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
