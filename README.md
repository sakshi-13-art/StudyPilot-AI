# StudyPilot AI — Autonomous Study Planning & Recovery Agent

> Built by Sakshi Sisode (CSBS) for the 3-Hour Solo Web Development Hackathon.

## 📌 Problem Statement
College and STEM students frequently struggle to balance multiple technical subjects and looming exam deadlines. Traditional study timetable apps provide static schedules that completely collapse when unexpected events occur (such as falling ill, a lab assignment running late, or sudden academic burnout). Students are forced to manually recalculate their entire schedule or abandon it altogether.

## 🚀 The Solution: Autonomous Dynamic Recovery
**StudyPilot AI** is an intelligent academic planner powered by a **deterministic constraint solver** and **autonomous dynamic recovery agent**. 

Instead of manual guesswork, StudyPilot AI uses a mathematical formula:
$$\text{Priority (0–100)} = \text{UrgencyScore} + \text{ConfidenceDeficit} + \text{DifficultyWeight} + \text{CreditWeight}$$

When life causes an interruption:
1. **Detects Schedule Conflicts**: Flags missed sessions, overallocated study days, and low-confidence subjects with imminent exam deadlines.
2. **Autonomous Recalibration**: Automatically redistributes missed workload into future buffer slots without exceeding daily study capacity limits.
3. **Adaptive Workload Compression**: Intelligently compresses review time for high-confidence topics (rated 4/5 or 5/5) to protect focus time for critical, low-confidence subjects.
4. **Explainable Audit Trail**: Provides a step-by-step breakdown explaining every shift, duration compression, and rationale.

---

## 🛠️ Tech Stack
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
* **Build Tool**: Vite
* **Architecture**: Client-side deterministic constraint solver with `localStorage` persistence and an optional Express production runner (`server.js`)
* **State Management**: Reactive React hooks with automated persistence

---

## 💻 How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or newer)
* [npm](https://www.npmjs.com/)

### Installation & Startup
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/studypilot-ai.git

# 2. Navigate to the project directory
cd studypilot-ai

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure
```text
├── index.html                  # HTML entry point with Plus Jakarta Sans fonts
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── server.js                   # Production static & SPA server
├── src/
│   ├── App.tsx                 # Main application layout and tab navigation
│   ├── index.css               # Global Tailwind CSS styles
│   ├── main.tsx                # React entry point
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Course, Session, Audit)
│   ├── utils/
│   │   ├── scheduler.ts        # Priority algorithm, conflict detector, recovery solver
│   │   ├── sampleData.ts       # Realistic CSBS curriculum dataset
│   │   └── storage.ts          # LocalStorage persistence & state hydration
│   └── components/
│       ├── TopNavigation.tsx       # 3-Zone top navigation with conflict alerts
│       ├── DashboardView.tsx       # 7-Day horizon strip & timeline
│       ├── RecoveryAgentModal.tsx  # Interactive recovery simulator with 1-click test cases
│       ├── CoursesView.tsx         # Interactive confidence/difficulty sliders & syllabus
│       ├── FocusTimerView.tsx      # Pomodoro sprint timer with interruption logging
│       ├── JudgeDemoGuide.tsx      # Hackathon pitch script & comparison matrix
│       └── PreferencesModal.tsx    # Daily study capacity configuration
```

---

## 🏆 Key Features Demonstrated
1. **7-Day Study Horizon**: Visual timeline from yesterday to next week with daily capacity indicators.
2. **1-Click Disruption Simulator**: Quick demo test cases for hackathon judges ("Missed Past Session", "Sudden Lost Time Today", "Exam Date Advanced", "Confidence Drop").
3. **Interactive Confidence Sliders**: Real-time recalculation of urgency scores as students rate their subject mastery from 1 to 5.
4. **Active Focus Timer**: Pomodoro study timer directly linked to scheduled blocks.
5. **Zero Dead Clicks**: Every button, slider, checkbox, and modal is fully functional.
