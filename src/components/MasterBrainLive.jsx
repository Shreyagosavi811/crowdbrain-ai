import React from 'react';
import { Activity, ShieldCheck, Database, Camera, Radio } from 'lucide-react';

const MasterBrainLive = ({ context, aiData, systemLogs }) => {
  const { zones } = context;

  return (
    <div className="master-brain">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--bg-panel-border)', paddingBottom:'1rem', marginBottom:'1rem'}}>
        <h1 style={{display:'flex', alignItems:'center', gap:'0.5rem', color: 'var(--text-primary)', fontSize:'1.4rem'}}>
          <Activity color="var(--accent-cyan)" /> Live Operations Control
        </h1>
        <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
          <span style={{color: 'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.85rem'}}>
            <Camera size={14}/> CCTV Linked
          </span>
          <span style={{color: 'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.85rem'}}>
            <Database size={14}/> Sensors Active
          </span>
          <span className="glass-btn" style={{background: 'rgba(0,200,100,0.1)', color: '#00ff88', borderColor: 'transparent'}}>
            <ShieldCheck size={18}/> System Auto-Piloting
          </span>
        </div>
      </div>

      {/* System Status Banner */}
      <div style={{background: 'rgba(0,255,100,0.05)', border: '1px solid rgba(0,255,100,0.2)', padding:'0.75rem 1rem', borderRadius:'8px', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', fontSize:'0.9rem', color:'var(--text-primary)'}}>
         <span style={{display:'flex', alignItems:'center', gap:'0.25rem'}}><span style={{height:8, width:8, borderRadius:'50%', background:'var(--accent-green)', display:'inline-block'}}></span> System Status: Monitoring</span>
         <span style={{color:'#555'}}>|</span>
         <span style={{color:'var(--accent-cyan)'}}>AI Active</span>
         <span style={{color:'#555'}}>|</span>
         <span style={{color:'var(--accent-orange)'}}>{systemLogs.filter(log => log.message.includes('Alert')).length} Alerts Sent</span>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3><Radio size={18}/> Live Sensor Data (Read-Only)</h3>
           <div className="map-sandbox" style={{background:'transparent', border:'none', height:'auto', padding:'0', marginTop:'1rem'}}>
            {Object.keys(zones).map(z => {
              let levelClass = zones[z] < 40 ? 'low' : zones[z] < 75 ? 'medium' : 'high';
              return (
                <div key={z} className={`map-zone ${levelClass}`} style={{height:'100px'}}>
                  <h3 style={{fontSize:'0.8rem'}}>{z}</h3>
                  <span className="count" style={{fontSize:'1.2rem'}}>{zones[z]}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel" style={{display:'flex', flexDirection:'column'}}>
          <h3>🧠 AI Decision Log</h3>
          <div style={{flex: 1, background:'var(--bg-input)', marginTop:'1rem', borderRadius:'8px', padding:'1rem', overflowY:'auto', border:'1px solid var(--bg-panel-border)', maxHeight:'200px'}}>
            {systemLogs.length === 0 ? (
              <p style={{color:'#555', fontStyle:'italic'}}>No incidents recorded...</p>
            ) : (
              systemLogs.map((log, i) => (
                <p key={i} style={{fontSize:'0.85rem', color:'#ccc', marginBottom:'0.5rem', borderBottom:'1px solid #222', paddingBottom:'0.5rem'}}>
                  <span style={{color:'var(--accent-cyan)'}}>[{log.time}]</span> {log.message}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    
      <div className="glass-panel">
         <h3>Auto-Dispatch Hub</h3>
         <div style={{display:'flex', gap:'2rem', marginTop:'1rem', alignItems:'center'}}>
            <div style={{flex:1}}>
              <p style={{fontSize:'0.85rem', color:'#aaa'}}>Current Crowd Directives:</p>
              <p style={{color:'#fff', marginTop:'0.5rem', fontSize:'1.1rem'}}>{aiData?.mainSuggestion}</p>
            </div>
            
            {/* AI Risk Output */}
            <div style={{background:'var(--bg-input)', padding:'1rem', borderRadius:'8px', minWidth:'150px', textAlign:'center'}}>
                <p style={{fontSize:'0.7rem', color:'var(--text-secondary)', textTransform:'uppercase'}}>AI Risk Analysis</p>
                <p style={{fontSize:'1.2rem', marginTop:'0.25rem'}}>{aiData?.riskLevel}</p>
                <p style={{fontSize:'0.8rem', color:'#aaa', marginTop:'0.25rem'}}>Confidence: <span style={{color:'var(--accent-cyan)'}}>{aiData?.confidence}</span></p>
            </div>

            {/* Human Fail-Safe Override */}
            <div style={{minWidth:'200px'}}>
              <p style={{fontSize:'0.7rem', color:'#aaa', textTransform:'uppercase', marginBottom:'0.5rem'}}>Human Fail-Safe Controls</p>
              <button className="glass-btn danger" style={{width:'100%', fontSize:'0.8rem'}}>
                🚨 Manual Override: Open Gate C
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MasterBrainLive;
