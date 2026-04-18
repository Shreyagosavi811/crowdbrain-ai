import React from 'react';
import { Activity, Play, Settings, Bell, Zap, Route } from 'lucide-react';

const MasterBrain = ({ context, updateContext, runScenario, aiData }) => {
  const { aiEnabled, phase, scenario, zones } = context;

  const handleZoneChange = (e, zone) => {
    updateContext('zones', { ...zones, [zone]: parseInt(e.target.value) });
  };

  return (
    <div className="master-brain">
      <div className="glass-panel">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 className="gradient-text" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
            <Activity /> Crowd Brain - Master Panel
          </h1>
          <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
            <button 
              className={`glass-btn ${context.useGroq ? 'active' : ''}`}
              onClick={() => updateContext('useGroq', !context.useGroq)}
              style={{background: context.useGroq ? 'linear-gradient(135deg, #10b981, #059669)' : ''}}
            >
              <Zap size={18}/> Real Groq LLM
            </button>
            <button 
              className={`glass-btn ${aiEnabled ? 'active ai-active-glow' : 'danger'}`}
              onClick={() => updateContext('aiEnabled', !aiEnabled)}
            >
              <Zap size={18}/> {aiEnabled ? 'AI ACTIVE' : 'AI Disabled'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3><Play size={18}/> 🎬 Scenario Simulation Mode</h3>
          <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem'}}>Trigger real-world events</p>
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            <button className="glass-btn" style={{fontSize: '0.8rem', padding: '0.5rem 0.75rem'}} onClick={() => runScenario('Arijit Concert')}>Arijit Concert</button>
            <button className="glass-btn" style={{fontSize: '0.8rem', padding: '0.5rem 0.75rem'}} onClick={() => runScenario('IPL Stadium Exit')}>IPL Stadium Exit</button>
            <button className="glass-btn" style={{fontSize: '0.8rem', padding: '0.5rem 0.75rem'}} onClick={() => runScenario('Diwali Mela')}>Diwali Mela</button>
            <button className="glass-btn" style={{fontSize: '0.8rem', padding: '0.5rem 0.75rem'}} onClick={() => runScenario('Ganpati Visarjan')}>Ganpati Visarjan</button>
            <button className="glass-btn" style={{fontSize: '0.8rem', padding: '0.5rem 0.75rem'}} onClick={() => runScenario('Railway Rush (Diwali)')}>Railway Rush</button>
          </div>
        </div>

        <div className="glass-panel">
          <h3><Settings size={18}/> 📊 Impact Metrics</h3>
          <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem'}}>Real-time AI value</p>
          <div className="grid-2">
            <div className="metric-card">
              <h4>Wait Reduction</h4>
              <p>{aiData?.metrics?.waitReduction || "0%"}</p>
            </div>
            <div className="metric-card">
              <h4>Congestion</h4>
              <p style={{color: 'var(--accent-green)'}}>-{aiData?.metrics?.congestionReduction || "0%"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel flex-row" style={{gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start'}}>
        <div style={{flex: '1 1 300px'}}>
          <h3><Route size={18}/> Live Crowd Sandbox</h3>
          <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem'}}>Drag to simulate sudden surges</p>
          
          <div className="map-sandbox">
            {Object.keys(zones).map(z => {
              let levelClass = zones[z] < 40 ? 'low' : zones[z] < 75 ? 'medium' : 'high';
              return (
                <div key={z} className={`map-zone ${levelClass}`}>
                  <h3>{z}</h3>
                  <span className="count">{zones[z]}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{width: '250px', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <h4>Manual Overrides</h4>
          {Object.keys(zones).map(z => (
            <div className="control-group" key={z}>
              <label>{z}</label>
              <input 
                type="range" className="range-slider" 
                min="0" max="100" 
                value={zones[z]} 
                onChange={(e) => handleZoneChange(e, z)} 
              />
            </div>
          ))}
          <div className="control-group">
            <label>Event Phase</label>
            <select 
              value={phase} 
              onChange={e => updateContext('phase', e.target.value)}
              style={{width:'100%', padding:'0.5rem', background:'var(--bg-input)', color:'var(--text-primary)', borderRadius:'4px', border:'1px solid var(--bg-panel-border)'}}
            >
              <option>Entry</option>
              <option>Peak</option>
              <option>Exit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{marginBottom:'1rem'}}><Bell size={18}/> System Logs & AI Assertions (Backend)</h3>
        <div style={{background:'var(--bg-input)', padding:'1rem', borderRadius:'8px', fontFamily:'monospace', fontSize:'0.85rem', color:'var(--accent-cyan)'}}>
          <p>&gt; [Core Engine] {aiData?.mainSuggestion}</p>
          <p>&gt; [Prediction] {aiData?.prediction}</p>
          <p>&gt; [Timing] {aiData?.timing}</p>
          {aiData?.safetyAlert && <p style={{color:'var(--accent-red)'}}>&gt; [Safety Alert TRIGGERED] {aiData?.safetyAlert?.text}</p>}
        </div>
      </div>
    </div>
  );
};

export default MasterBrain;
