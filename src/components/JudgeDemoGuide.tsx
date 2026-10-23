import React from 'react';
import { Award, Zap, CheckCircle2, ShieldCheck, ArrowRight, Code, Terminal, Layers } from 'lucide-react';

interface JudgeDemoGuideProps {
  onOpenRecovery: () => void;
  onNavigateToSchedule: () => void;
}

export const JudgeDemoGuide: React.FC<JudgeDemoGuideProps> = ({
  onOpenRecovery,
  onNavigateToSchedule,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          <Award className="w-4 h-4 text-indigo-600" />
          <span>Hackathon Evaluation & Pitch Guide</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          StudyPilot AI — Autonomous Study Planning & Recovery Agent
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Developed for university students managing multi-subject course loads with unpredictable schedules. 
          When students miss study sessions or encounter emergencies, traditional static calendars break. 
          StudyPilot AI provides <strong>deterministic mathematical scheduling</strong> and <strong>autonomous dynamic recovery</strong> with full explainability.
        </p>
      </div>

      {/* 60-Second Demo Script for Sakshi */}
      <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-indigo-950 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span>60-Second Winning Pitch Script for Judges</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-600 text-white rounded-full">
            Recommended Demo Flow
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-white rounded-lg border border-indigo-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-slate-900">State the Core Problem:</strong>
              <p className="mt-0.5 text-slate-600">
                "Judges, every student makes a study timetable, but life happens—a lab runs late, an exam moves up, or you get sick. Static timetables fail because manual recalculation across 5 subjects with different exam dates is overwhelming."
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-indigo-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-slate-900">Show the Conflict:</strong>
              <p className="mt-0.5 text-slate-600">
                Click on the <strong>Schedule tab</strong>. Point out yesterday's missed 90-minute Data Structures lab session and the upcoming Linear Algebra exam in 4 days.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-indigo-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-slate-900">Trigger Autonomous Recovery:</strong>
              <p className="mt-0.5 text-slate-600">
                Click <strong>"Recovery Agent"</strong>. Demonstrate the 1-click test scenarios (e.g. "Missed Yesterday" or "Sudden 2h Lost Time") and click <strong>"Execute Autonomous Recovery"</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-indigo-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">4</span>
            <div>
              <strong className="text-slate-900">Highlight the Explainable Audit Log:</strong>
              <p className="mt-0.5 text-slate-600">
                Show the audit trail! "Notice how the agent didn't just push tasks blindly: it shifted DSA into Saturday's buffer, and compressed a high-confidence Machine Learning review by 20 minutes to preserve time for low-confidence Linear Algebra!"
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={onOpenRecovery}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Open Autonomous Recovery Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNavigateToSchedule}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            View Live Schedule
          </button>
        </div>
      </div>

      {/* Comparison: Traditional vs StudyPilot AI */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Why StudyPilot AI Wins Over Traditional Calendars
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold text-slate-700">Capability</th>
                <th className="py-2.5 px-3 font-semibold text-slate-500">Google Calendar / Notion</th>
                <th className="py-2.5 px-3 font-bold text-indigo-700">StudyPilot AI Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">Dynamic Urgency Scoring</td>
                <td className="py-2.5 px-3 text-slate-500">Manual / Static slots</td>
                <td className="py-2.5 px-3 text-indigo-700 font-medium">Algorithmic (Exam days, difficulty, confidence, credits)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">Missed Session Handling</td>
                <td className="py-2.5 px-3 text-rose-600">Event remains red / ignored</td>
                <td className="py-2.5 px-3 text-emerald-700 font-medium">Autonomous conflict detection & buffer redistribution</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">Capacity Preservation</td>
                <td className="py-2.5 px-3 text-slate-500">Causes burnout & overlaps</td>
                <td className="py-2.5 px-3 text-indigo-700 font-medium">Strict weekday/weekend capacity limits with adaptive compression</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">Explainability</td>
                <td className="py-2.5 px-3 text-slate-500">None</td>
                <td className="py-2.5 px-3 text-emerald-700 font-medium">Full audit trail explaining every shift and compression reason</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Deterministic Mathematical Formula */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-slate-600" />
          <h3 className="text-base font-bold text-slate-900">Deterministic Scheduling Algorithm</h3>
        </div>
        <p className="text-xs text-slate-600">
          Rather than relying on ungrounded generative black boxes that hallucinate invalid dates, StudyPilot AI uses a verified constraint optimization formula:
        </p>
        
        <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-2">
          <div className="text-indigo-400 font-semibold">// Priority Formulation (0 - 100 scale)</div>
          <div>Priority = UrgencyScore + ConfidenceDeficit + DifficultyWeight + CreditWeight</div>
          <div className="text-slate-400 text-[11px] pt-1">
            · UrgencyScore = 14 / max(1, daysUntilExam) * 12<br />
            · ConfidenceDeficit = (6 - confidenceLevel) * 5.6<br />
            · DifficultyWeight = courseDifficulty * 3.8<br />
            · CreditWeight = academicCredits * 2.2
          </div>
        </div>
      </div>

      {/* Tech Stack & Architecture (Honest Hackathon Submission) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-600" />
          <h3 className="text-base font-bold text-slate-900">Architecture & Hackathon Decisions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900">React 19 + TypeScript:</strong>
            <p className="text-slate-500 mt-1">
              Zero build errors, strictly typed models for courses, sessions, and recovery audit trails.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900">Zero-Latency In-Browser:</strong>
            <p className="text-slate-500 mt-1">
              Deterministic constraint solving executed instantly in client memory with localStorage persistence.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900">Tailwind CSS v4:</strong>
            <p className="text-slate-500 mt-1">
              Responsive typography, clean 1440px viewport layouts, and accessible contrast ratios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
