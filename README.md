# 🧠 CrowdBrain AI

### Intelligent Crowd Experience Assistant for Large-Scale Events

---

##  Overview

CrowdBrain AI is an intelligent, real-time crowd management system designed to improve physical event experiences at large-scale venues like stadiums, concerts, festivals, and public gatherings.

It predicts crowd movement, reduces waiting time, and ensures safety by delivering AI-powered, personalized guidance directly to attendees.
---

##  Problem Statement

Large-scale events in India face major challenges:

* Unstructured crowd movement
* Long waiting times at food stalls and exits
* Sudden crowd surges during peak moments
* Lack of real-time guidance for attendees
* Safety risks due to overcrowding

Existing solutions fail to adapt to **dynamic and behavior-driven crowd patterns**.

---

##  Solution

CrowdBrain AI provides a **dual-interface intelligent system**:


 1. Master Brain (Control Panel)
Monitors crowd density across zones
Predicts congestion hotspots
Generates AI decisions in real-time
Dispatches smart alerts

 2. User App (Attendee Side)
Receives personalized recommendations
Gets real-time alerts & safe routes
Reduces wait time and avoids crowd
---

##  Key Features

### Core AI Engines

* **Decision Engine** – “What should I do now?”
* **Prediction Engine** – Forecasts crowd surges
* **Timing Engine** – Suggests optimal timing for actions

###  Experience Layer

* **Personalization Engine** – Tailored recommendations
* **AI Chat Assistant** – Interactive guidance system
* **Smart Notification System** – Proactive alerts

###  Safety Layer

* **Risk Detection System** – Identifies high-risk zones
* **Alert System** – Sends real-time safety warnings

###  Demo & Simulation

* Scenario-based simulation:

  * Concert crowd surge
  * Stadium exit rush
  * Festival food court congestion
* Before/After AI comparison
* Live impact metrics (wait time reduction, congestion reduction)

*  QR-Based Real-World Integration
Scan QR at any zone
Instantly get location-based guidance

---

## 🇮🇳 Indian Event Scenarios

*  Concert Crowd (Entry Surge)
*  Stadium Exit (Mass Exit)
*  Festival / Mela Crowd
*  Ganpati Visarjan
*  Railway Station Rush

---

##🧠 AI & Prompt Engineering

This system uses a Multi-Agent Prompt Architecture:

* 1. Location Agent (QR-Based)
Detects user zone
Updates context
* 2. Master Brain Agent
Analyzes crowd density
Predicts movement
Generates routing strategy
* 3. User Guidance Agent
Provides:
Action
Reason
Impact
* 4. Notification Agent
Generates short, actionable alerts
---

##  Tech Stack

### Frontend

* React (Vite)
* CSS (Glassmorphism UI)

### AI Layer

* Groq API (LLaMA models)

### Backend / Services

* Firebase (optional for notifications)

### Simulation

* Custom event simulation using `setInterval`

---

##  How It Works

1. Event conditions are simulated (crowd density, event phase)
2. AI analyzes real-time data
3. Predicts future crowd behavior
4. Generates recommendations
5. Sends alerts to users
6. Displays optimized routes and actions

---
Demo Flow
Start with normal crowd state
Trigger scenario (e.g., IPL Exit / Ganpati Visarjan)
Watch:
Crowd spike
AI detection
User notification
Observe:
Reduced wait time
Safer routing

Live Demo : https://crowdbrain-o2lxl68vj-shreya-gosavis-projects.vercel.app/
---

##  Impact

*  Up to **40% reduction in waiting time**
*  Improved crowd movement efficiency
*  Enhanced safety through early alerts
*  Seamless user experience

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/crowdbrain-ai.git
cd crowdbrain-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file:

```env
VITE_GROQ_API_KEY=your_api_key_here
```

### 4. Run the app

```bash
npm run dev
```

---

##  Deployment

Deploy easily using:

* Vercel
* Netlify

---

##  Future Scope

* Real-time IoT sensor integration
* CCTV-based crowd detection
* Government disaster management integration
* Mobile app deployment

---

##  Why CrowdBrain AI?

* Real-time AI decision-making
* Proactive notification system
* Indian event-focused solution
* Scalable architecture
* High-impact user experience


---

##  License

This project is for hackathon/demo purposes.

“CrowdBrain AI doesn’t just monitor crowds — it intelligently guides them.”
