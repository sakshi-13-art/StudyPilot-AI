import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, Sliders, CheckSquare, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { Course, Topic } from '../types';
import { daysBetween } from '../utils/scheduler';
import { formatDateOffset } from '../utils/sampleData';

interface CoursesViewProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  onResetDefaults: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onUpdateCourses,
  onResetDefaults,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCourseName, setNewCourseName] = useState<string>('');
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newExamDate, setNewExamDate] = useState<string>(formatDateOffset(7));
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newDifficulty, setNewDifficulty] = useState<number>(3);
  const [newConfidence, setNewConfidence] = useState<number>(3);
  const [newTopicsText, setNewTopicsText] = useState<string>('Unit 1: Fundamentals\nUnit 2: Advanced Concepts\nUnit 3: Case Studies & Lab');

  const todayStr = formatDateOffset(0);

  // Update a course field (like confidence slider)
  const handleUpdateField = (courseId: string, field: keyof Course, value: any) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, [field]: value };
      }
      return c;
    });
    onUpdateCourses(updated);
  };

  // Toggle topic completion
  const handleToggleTopic = (courseId: string, topicId: string) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        const updatedTopics = c.topics.map(t => {
          if (t.id === topicId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });
        return { ...c, topics: updatedTopics };
      }
      return c;
    });
    onUpdateCourses(updated);
  };

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // Delete course without window.confirm (iframe safe)
  const handleDeleteCourse = (courseId: string) => {
    if (confirmingDeleteId === courseId) {
      onUpdateCourses(courses.filter(c => c.id !== courseId));
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(courseId);
      setTimeout(() => setConfirmingDeleteId(null), 3000);
    }
  };

  // Add course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim() || !newCourseCode.trim()) return;

    const topicLines = newTopicsText.split('\n').filter(line => line.trim().length > 0);
    const parsedTopics: Topic[] = topicLines.map((title, idx) => ({
      id: `t_${Date.now()}_${idx}`,
      title: title.trim(),
      estimatedMinutes: 60,
      completed: false,
    }));

    const newCourse: Course = {
      id: 'c_' + Date.now(),
      name: newCourseName.trim(),
      code: newCourseCode.trim().toUpperCase(),
      color: 'indigo',
      examDate: newExamDate,
      credits: newCredits,
      difficulty: newDifficulty,
      confidence: newConfidence,
      totalTargetHours: parsedTopics.length * 1.5,
      topics: parsedTopics.length > 0 ? parsedTopics : [
        { id: `t_${Date.now()}_0`, title: 'Core Syllabus Unit 1', estimatedMinutes: 60, completed: false },
      ],
    };

    onUpdateCourses([...courses, newCourse]);
    setShowAddModal(false);
    setNewCourseName('');
    setNewCourseCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">Academic Courses & Examination Deadlines</h2>
          <p className="text-xs text-slate-500">
            StudyPilot AI uses your difficulty ratings and confidence levels to calculate dynamic urgency
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset to CSBS default semester courses"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Curriculum</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => {
          const daysLeft = daysBetween(todayStr, course.examDate);
          const completedTopicsCount = course.topics.filter(t => t.completed).length;
          const totalTopicsCount = course.topics.length;
          const progressPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all shadow-xs"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {course.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    confirmingDeleteId === course.id
                      ? 'bg-rose-100 text-rose-700 font-semibold'
                      : 'text-slate-300 hover:text-rose-600'
                  }`}
                  title={confirmingDeleteId === course.id ? 'Click again to confirm delete' : 'Remove course'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmingDeleteId === course.id && <span>Confirm?</span>}
                </button>
              </div>

              {/* Exam Date & Urgency Indicator */}
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exam: <strong className="text-slate-800">{course.examDate}</strong></span>
                </div>
                <div>
                  {daysLeft <= 0 ? (
                    <span className="text-rose-700 font-bold">Exam Today/Past</span>
                  ) : daysLeft <= 4 ? (
                    <span className="text-rose-600 font-bold">{daysLeft} days left (Urgent)</span>
                  ) : daysLeft <= 8 ? (
                    <span className="text-amber-600 font-semibold">{daysLeft} days left</span>
                  ) : (
                    <span className="text-slate-500">{daysLeft} days left</span>
                  )}
                </div>
              </div>

              {/* Interactive Sliders: Difficulty & Confidence */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-600 font-medium">Subject Difficulty</span>
                    <span className="font-bold text-slate-900">{course.difficulty} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={course.difficulty}
                    onChange={(e) => handleUpdateField(course.id, 'difficulty', Number(e.target.value))}
                    className="w-full accent-slate-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-600 font-medium">Your Confidence Level</span>
                    <span className={`font-bold ${
                      course.confidence <= 2 ? 'text-rose-600' :
                      course.confidence === 3 ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>
                      {course.confidence} / 5 {course.confidence <= 2 ? '(Needs Priority Review)' : course.confidence >= 4 ? '(Confident)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={course.confidence}
                    onChange={(e) => handleUpdateField(course.id, 'confidence', Number(e.target.value))}
                    className={`w-full cursor-pointer ${
                      course.confidence <= 2 ? 'accent-rose-600' :
                      course.confidence === 3 ? 'accent-amber-500' :
                      'accent-emerald-600'
                    }`}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>1: Shaky</span>
                    <span>3: Moderate</span>
                    <span>5: Mastered</span>
                  </div>
                </div>
              </div>

              {/* Syllabus Topics Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Syllabus Topics ({completedTopicsCount}/{totalTopicsCount})
                  </span>
                  <span className="text-slate-400 font-mono">{progressPct}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {course.topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleToggleTopic(course.id, topic.id)}
                      className="w-full flex items-start gap-2 text-left p-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {topic.completed ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-xs ${topic.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {topic.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Add New Academic Course</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Systems"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSBS-401"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Credits ({newCredits})</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Difficulty ({newDifficulty}/5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Confidence ({newConfidence}/5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newConfidence}
                    onChange={(e) => setNewConfidence(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Syllabus Topics (One per line)
                </label>
                <textarea
                  rows={4}
                  value={newTopicsText}
                  onChange={(e) => setNewTopicsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
