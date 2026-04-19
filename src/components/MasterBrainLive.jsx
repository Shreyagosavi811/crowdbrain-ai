import React from 'react';
import { Activity, ShieldCheck, Database, Camera, Radio } from 'lucide-react';
import Logo from './Logo';

const MasterBrainLive = ({ context, aiData, systemLogs }) => {
  const { zones } = context;

  return (
    <div className="master-brain">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--bg-panel-border)', paddingBottom:'1rem', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem'}}>
        <div style={{display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'}}>
          <Logo width={200} height={60} />
          <span style={{fontSize:'1.1rem', color:'var(--text-secondary)', borderLeft:'1px solid var(--bg-panel-border)', paddingLeft:'1rem'}}>Live Operations Control</span>
        </div>
        <div style={{display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap'}}>
          <span style={{color: 'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.85rem'}}>
            <Camera size={14}/> CCTV Linked
          </span>
          <span style={{color: 'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.85rem'}}>
            <Database size={14}/> Sensors Active
          </span>
          <span className="glass-btn" style={{background: 'rgba(0,200,100,0.1)', color: 'var(--accent-green)', borderColor: 'transparent'}}>
            <ShieldCheck size={18}/> System Auto-Piloting
          </span>
        </div>
      </div>

      {/* System Status & QR Deployment */}
      <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap'}}>
        <div style={{flex: '1 1 300px', background: 'rgba(0,255,100,0.05)', border: '1px solid rgba(0,255,100,0.2)', padding:'0.75rem 1rem', borderRadius:'8px', display:'flex', alignItems:'center', gap:'1rem', fontSize:'0.9rem', color:'var(--text-primary)', flexWrap:'wrap'}}>
           <span style={{display:'flex', alignItems:'center', gap:'0.25rem'}}><span style={{height:8, width:8, borderRadius:'50%', background:'var(--accent-green)', display:'inline-block', animation:'pulse 1.5s infinite alternate'}}></span> System Status: Monitoring</span>
           <span style={{color:'var(--text-secondary)'}}>|</span>
           <span style={{color:'var(--accent-cyan)'}}>AI Active</span>
           <span style={{color:'var(--text-secondary)'}}>|</span>
           <span style={{color:'var(--accent-orange)'}}>{systemLogs.filter(log => log.message.includes('Alert')).length} Alerts Sent</span>
        </div>

        <div style={{background: 'var(--bg-widget)', border: '1px solid var(--widget-border)', padding:'0.5rem 1rem', borderRadius:'8px', display:'flex', alignItems:'center', gap:'1rem'}}>
          <div style={{background:'white', padding:'4px', borderRadius:'4px'}}>
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} alt="QR" width="36" height="36" style={{display:'block'}}/>
          </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <div style={{fontSize:'0.75rem', color:'var(--accent-cyan)', fontWeight:'bold', textTransform:'uppercase'}}>Public Deployment</div>
            <div style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>Scan to open User App</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3><Radio size={18}/> Live Sensor Data (Read-Only)</h3>
           <div className="map-sandbox" style={{background:'transparent', border:'none', height:'auto', padding:'0', marginTop:'1rem'}}>
            {Object.keys(context.zones).map((zone, i) => {
              const val = context.zones[zone];
              const deltaClass = context.zoneDeltas ? context.zoneDeltas[zone] : '';
              let level = 'low';
              if (val > 50) level = 'medium';
              if (val > 80) level = 'high';
              return (
                <div key={i} className={`map-zone ${level}`}>
                  <h3>{zone}</h3>
                  <span className={`count ${deltaClass}`}>{val}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-panel" style={{display:'flex', flexDirection:'column'}}>
          <h3>🧠 AI Decision Log</h3>
          <div style={{flex: 1, background:'var(--bg-input)', marginTop:'1rem', borderRadius:'8px', padding:'1rem', overflowY:'auto', border:'1px solid var(--bg-panel-border)', maxHeight:'200px'}}>
            {systemLogs.length === 0 ? (
              <p style={{color:'var(--text-secondary)', fontStyle:'italic'}}>No incidents recorded...</p>
            ) : (
              systemLogs.map((log, i) => (
                <p key={i} style={{fontSize:'0.85rem', color:'var(--text-primary)', marginBottom:'0.5rem', borderBottom:'1px solid var(--bg-panel-border)', paddingBottom:'0.5rem'}}>
                  <span style={{color:'var(--accent-cyan)'}}>[{log.time}]</span> {log.message}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    
      <div className="glass-panel">
         <h3>Auto-Dispatch Hub</h3>
         <div style={{display:'flex', gap:'2rem', marginTop:'1rem', alignItems:'center', flexWrap:'wrap'}}>
            <div style={{flex:'1 1 200px'}}>
              <p style={{fontSize:'0.85rem', color:'var(--text-secondary)'}}>Current Crowd Directives:</p>
              <p style={{color:'var(--text-primary)', marginTop:'0.5rem', fontSize:'1.1rem'}}>{aiData?.mainSuggestion}</p>
            </div>
            
            {/* AI Risk Output */}
            <div style={{background:'var(--bg-input)', padding:'1rem', borderRadius:'8px', minWidth:'150px', textAlign:'center'}}>
                <p style={{fontSize:'0.7rem', color:'var(--text-secondary)', textTransform:'uppercase'}}>AI Risk Analysis</p>
                <p style={{fontSize:'1.2rem', marginTop:'0.25rem'}}>{aiData?.riskLevel}</p>
                <p style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'0.25rem'}}>Confidence: <span style={{color:'var(--accent-cyan)'}}>{aiData?.confidence}</span></p>
            </div>

            {/* Human Fail-Safe Override */}
            <div style={{minWidth:'200px'}}>
              <p style={{fontSize:'0.7rem', color:'var(--text-secondary)', textTransform:'uppercase', marginBottom:'0.5rem'}}>Human Fail-Safe Controls</p>
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
