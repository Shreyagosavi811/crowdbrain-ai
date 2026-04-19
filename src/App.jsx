import { useState, useEffect, useRef } from 'react';
import MasterBrain from './components/MasterBrain';
import MasterBrainLive from './components/MasterBrainLive';
import UserApp from './components/UserApp';
import AnimatedBackground from './components/AnimatedBackground';
import { generateAIResponses, generateGroqResponses } from './PromptEngine';

function App() {
  const [currentView, setCurrentView] = useState('demo'); // 'demo' | 'live'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [systemLogs, setSystemLogs] = useState([]);
  const [showCriticalOverlay, setShowCriticalOverlay] = useState(false);

  const [context, setContext] = useState({
    aiEnabled: true,
    useGroq: false, 
    phase: 'Entry',
    time: 'Early',
    scenario: 'Normal',
    persona: 'Family',
    userLocation: 'Gate A',
    zones: {
      'Gate A': 40,
      'Gate C': 20,
      'Main Stage': 10,
      'Food Court': 15
    },
    zoneDeltas: {
      'Gate A': '',
      'Gate C': '',
      'Main Stage': '',
      'Food Court': ''
    }
  });

  const [aiData, setAiData] = useState({});
  const [isLoadingGroq, setIsLoadingGroq] = useState(false);

  // Keep track of last major state to avoid duplicate logs
  const lastRiskRef = useRef('');

  // 1. Live Feel Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setContext(prev => {
        const newZones = { ...prev.zones };
        const newDeltas = { ...prev.zoneDeltas };
        Object.keys(newZones).forEach(zone => {
          const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          const newVal = Math.min(100, Math.max(0, newZones[zone] + jitter));
          newDeltas[zone] = newVal > newZones[zone] ? 'tick-up' : (newVal < newZones[zone] ? 'tick-down' : '');
          newZones[zone] = newVal;
        });
        
        // Reset deltas shortly after to allow CSS re-trigger
        setTimeout(() => {
          setContext(p => ({ ...p, zoneDeltas: { 'Gate A': '', 'Gate C': '', 'Main Stage': '', 'Food Court': '' }}));
        }, 500);

        return { ...prev, zones: newZones, zoneDeltas: newDeltas };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // 2. React to Context Changes & Build Logs
  useEffect(() => {
    const fetchAI = async () => {
      let data = {};
      if (context.useGroq && context.aiEnabled) {
        setIsLoadingGroq(true);
        const groqResult = await generateGroqResponses(context);
        data = groqResult || generateAIResponses(context);
        setIsLoadingGroq(false);
      } else {
        data = generateAIResponses(context);
      }
      setAiData(data);

      // System Log Builder & Alerts
      if (data.riskLevel && data.riskLevel !== lastRiskRef.current) {
        const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let newLogs = [];
        if (data.riskLevel === '🔴 High') {
          newLogs.push({ time: timeStr, message: `High density detected across zones.` });
          newLogs.push({ time: timeStr, message: `Alert sent to local users.` });
          newLogs.push({ time: timeStr, message: `Suggested action: ${data.mainSuggestion}` });
          
          // Trigger Audio & Visual Flashing
          triggerCriticalAlarm();
          setShowCriticalOverlay(true);
          setTimeout(() => setShowCriticalOverlay(false), 4500);

        } else if (data.riskLevel === '🟡 Medium') {
          newLogs.push({ time: timeStr, message: `Elevated activity. AI monitoring.` });
        } else if (lastRiskRef.current === '🔴 High' && data.riskLevel === '🟢 Low') {
          newLogs.push({ time: timeStr, message: `Crowds dissipated. Status normalized.` });
        }
        
        if (newLogs.length > 0) {
          setSystemLogs(prev => [...newLogs, ...prev].slice(0, 15)); // Keep last 15
        }
        lastRiskRef.current = data.riskLevel;
      }
    };
    fetchAI();
  }, [context.phase, context.time, context.persona, context.scenario, context.aiEnabled, context.useGroq]);

  useEffect(() => {
    if (!context.useGroq || !context.aiEnabled) {
      const data = generateAIResponses(context);
      setAiData(data);
    }
  }, [context.zones]);

  const updateContext = (key, value) => {
    setContext(prev => ({ ...prev, [key]: value }));
  };

  const runScenario = (scenarioName) => {
    updateContext('scenario', scenarioName);
    updateContext('aiEnabled', true);
    
    // Switch to Demo View if interacting with Demo buttons
    if (currentView !== 'demo') setCurrentView('demo');
    
    if (scenarioName === 'Arijit Concert') {
      updateContext('zones', { 'Gate A': 85, 'Gate C': 30, 'Main Stage': 20, 'Food Court': 10 });
    } else if (scenarioName === 'Ganpati Visarjan') {
      updateContext('zones', { 'Gate A': 98, 'Gate C': 70, 'Main Stage': 95, 'Food Court': 80 });
    } else if (scenarioName === 'Railway Rush (Diwali)') {
      updateContext('zones', { 'Gate A': 80, 'Gate C': 90, 'Main Stage': 10, 'Food Court': 60 });
    } else if (scenarioName === 'IPL Stadium Exit') {
      updateContext('zones', { 'Gate A': 90, 'Gate C': 85, 'Main Stage': 10, 'Food Court': 20 });
    } else if (scenarioName === 'Diwali Mela') {
      updateContext('zones', { 'Gate A': 40, 'Gate C': 50, 'Main Stage': 30, 'Food Court': 95 });
    }
  };

  const triggerCriticalAlarm = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (delay) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }, delay);
      };

      playBeep(0);
      playBeep(400);
      playBeep(800);
      playBeep(1200);
    } catch(e) { console.error("Audio block", e) }
  };

  return (
    <div className={theme === 'light' ? 'light-mode' : ''} style={{display:'flex', flexDirection:'column', height:'100vh', width:'100vw', position:'relative', transition:'background 0.3s, color 0.3s'}}>
      
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Global Flashing Overlay */}
      {showCriticalOverlay && (
        <div className="global-alert-overlay">
          ⚠️ CRITICAL CROWD RISK DETECTED
          <div style={{fontSize:'1rem', marginTop:'0.5rem', fontWeight:'normal'}}>Autonomous safety routers engaged.</div>
        </div>
      )}

      {/* Top Level Nav */}
      <div style={{background:'var(--header-bg)', padding:'1rem 2rem', display:'flex', gap:'2rem', borderBottom:'1px solid var(--bg-panel-border)', alignItems:'center', transition:'all 0.3s', flexWrap: 'wrap'}}>
        
        {/* Theme Toggle */}
        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginRight:'1rem'}}>
          <span style={{cursor:'pointer', filter: theme==='light' ? 'grayscale(0)' : 'grayscale(1)'}} onClick={()=>setTheme('light')}>☀️</span>
          <div 
            style={{width:'40px', height:'20px', background:'var(--bg-input)', borderRadius:'20px', position:'relative', cursor:'pointer', border:'1px solid var(--bg-panel-border)'}}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <div style={{width:'16px', height:'16px', background:'var(--accent-cyan)', borderRadius:'50%', position:'absolute', top:'1px', left: theme==='dark' ? '22px' : '2px', transition:'left 0.3s'}}></div>
          </div>
          <span style={{cursor:'pointer', filter: theme==='dark' ? 'grayscale(0)' : 'grayscale(1)'}} onClick={()=>setTheme('dark')}>🌙</span>
        </div>

        <span 
          style={{color: currentView === 'demo' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor:'pointer', fontWeight:'bold', borderBottom: currentView === 'demo' ? '2px solid var(--accent-cyan)' : 'none', paddingBottom:'0.5rem'}}
          onClick={() => setCurrentView('demo')}
        >
          Presentation Demo Board
        </span>
        <span 
           style={{color: currentView === 'live' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor:'pointer', fontWeight:'bold', borderBottom: currentView === 'live' ? '2px solid var(--accent-cyan)' : 'none', paddingBottom:'0.5rem'}}
           onClick={() => setCurrentView('live')}
        >
          Live Operations Control Room
        </span>
        
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(0,255,100,0.1)', padding:'0.5rem 1rem', borderRadius:'20px', color:'var(--accent-green)', fontWeight:'bold', fontSize:'0.8rem'}}>
          <div style={{width:'8px', height:'8px', background:'var(--accent-green)', borderRadius:'50%', animation:'pulse 1s infinite alternate'}}></div>
          LIVE SIMULATION RUNNING
        </div>
      </div>

      <div className="app-container" style={{height:'calc(100vh - 60px)', padding:'1rem'}}>
        {/* LEFT: Dynamic Panel based on View */}
        {currentView === 'demo' ? (
          <MasterBrain 
            context={context} 
            updateContext={updateContext} 
            runScenario={runScenario}
            aiData={aiData}
            isLoadingGroq={isLoadingGroq}
          />
        ) : (
          <MasterBrainLive 
            context={context}
            aiData={aiData}
            systemLogs={systemLogs}
          />
        )}

        {/* RIGHT: The User's Phone (Hidden in Live Mode) */}
        {currentView === 'demo' && (
          <div className="user-app-container">
            <UserApp 
              context={context}
              aiData={aiData} 
              updateContext={updateContext}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
