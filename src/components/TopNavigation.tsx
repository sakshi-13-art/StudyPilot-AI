import React from 'react';
import { Calendar, BookOpen, RefreshCw, Clock, Award, AlertCircle } from 'lucide-react';

export type ActiveTab = 'schedule' | 'courses' | 'recovery' | 'timer' | 'guide';

interface TopNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasConflicts: boolean;
  onOpenRecovery: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  hasConflicts,
  onOpenRecovery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                SP
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                  StudyPilot AI
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400">
                  Autonomous Academic Agent
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule & Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses & Deadlines</span>
            </button>

            <button
              onClick={() => setActiveTab('recovery')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === 'recovery'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Autonomous Recovery</span>
              {hasConflicts && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Schedule conflict detected" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'timer'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Focus Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Judge Demo Guide</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenRecovery}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer ${
                hasConflicts
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{hasConflicts ? 'Resolve Conflicts' : 'Recovery Agent'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'schedule' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'courses' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'recovery' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Recovery {hasConflicts && '(!)'}
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'timer' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-indigo-600 bg-indigo-50'
            }`}
          >
            Judge Guide
          </button>
        </div>
      </div>
    </header>
  );
};
