# 🚀 CrowdBrain AI  
**Real-Time Crowd Experience Assistant for Large-Scale Events**

---

## 🧠 Overview  
CrowdBrain AI is an intelligent crowd management system designed to improve safety, reduce waiting time, and enhance attendee experience at large-scale events such as concerts, stadiums, festivals, and public gatherings.

It not only monitors crowd conditions but actively **guides users using AI-powered decisions**.

---

## 🎯 Problem Statement  
Large-scale events often face:
- Overcrowded entry/exit points  
- Long waiting queues  
- Lack of real-time navigation  
- Delayed manual intervention  

This leads to inefficiency and potential safety risks.

---

## 💡 Solution  

### 🔹 Master Brain (Admin Panel)
- Monitors crowd density  
- Detects congestion  
- Generates real-time routing strategies  

### 🔹 User App (Attendee Interface)
- Provides personalized navigation  
- Suggests safer & faster routes  
- Sends real-time alerts  

---

## 🔥 Key Features  

- 📊 Real-Time Crowd Simulation  
- 🤖 AI Decision Engine  
- 📍 QR-Based Location Detection  
- 🚨 Smart Safety Alerts (🔴 🟡 🟢)  
- 🎭 Dual Mode (Demo + Live Operations)  

---

## 🏗️ Tech Stack  

**Frontend**
- React (Vite)  
- Custom CSS (Glassmorphism UI)  

**AI Engine**
- Prompt Engineering System  
- Groq (Llama3)  

---

## 🔐 Security  

API keys are managed using environment variables.

### Backend Proxy Example

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3001);

---
.env
GROQ_API_KEY=your_api_key_here

🧪 Testing

Basic unit test for AI engine:

import { describe, it, expect } from "vitest";
import { generateAIResponses } from "../src/PromptEngine";

describe("AI Engine", () => {
  it("returns structured output", () => {
    const context = {
      zones: { "Gate A": 90, "Gate C": 20 },
      userLocation: "Gate A"
    };

    const result = generateAIResponses(context);

    expect(result).toHaveProperty("mainSuggestion");
    expect(result).toHaveProperty("reasoning");
  });
});

---

Run:

npm run test
♿ Accessibility
Semantic HTML
ARIA labels for UI controls

Example:

<button aria-label="Toggle Theme">🌙</button>
⚡ Performance
Optimized re-renders using React hooks

Example:

const aiResult = useMemo(() => generateAIResponses(context), [context]);
☁️ Google Technologies (Planned)
Firebase (real-time sync)
Google Maps API (crowd heatmaps)
Cloud Functions
🎬 Demo

Live App:
👉[ https://your-live-link.vercel.app](https://crowdbrainai.vercel.app/)

GitHub Repository

👉 [https://github.com/your-username/crowdbrain-ai](https://github.com/Shreyagosavi811/crowdbrain-ai)

📸 Screenshots

<img width="1365" height="767" alt="Screenshot 2026-04-20 183408" src="https://github.com/user-attachments/assets/69b7a078-daae-474b-a271-c0d1ebfc4000" />
<img width="1365" height="767" alt="Screenshot 2026-04-20 183745" src="https://github.com/user-attachments/assets/ecd92720-bf5f-4e64-9464-d3b7b5f2ef8f" />
<img width="1365" height="767" alt="Screenshot 2026-04-20 183950" src="https://github.com/user-attachments/assets/c63bd589-7390-49d6-b85f-acdaad55943a" />

🚀 Future Scope
Computer Vision for real crowd detection
Mobile app (React Native)
Real-time notifications
WebSocket backend
🏆 Built For

PromptWars Virtual Hackathon

#BuildwithAI #PromptWarsVirtual #Antigravity

👩‍💻 Author

Shreya Gosavi

💬 Feedback

Open to feedback and suggestions.
