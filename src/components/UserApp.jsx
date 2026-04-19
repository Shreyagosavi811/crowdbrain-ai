import React, { useState } from 'react';
import { User, MapPin, Compass, ShieldAlert, Heart, Info, HandHeart, Settings, Route, ArrowRight, QrCode } from 'lucide-react';
import { askChatBot } from '../PromptEngine';

const UserApp = ({ context, aiData, updateContext }) => {
  const { persona, zones, userLocation } = context;
  const [showRoute, setShowRoute] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

  const [activeNotification, setActiveNotification] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const notifRef = React.useRef(null);

  React.useEffect(() => {
    if (!context.aiEnabled) {
      setActiveNotification(null);
      notifRef.current = null;
      return;
    }

    let rawNotif = null;
    if (aiData?.safetyAlert) {
      rawNotif = {
        title: 'Safety Alert',
        text: aiData.safetyAlert.text,
        type: 'urgent',
        icon: <ShieldAlert size={16}/>,
        color: 'var(--accent-red)'
      };
    } else if (aiData?.notification) {
      rawNotif = {
        title: aiData.notification.title,
        text: aiData.notification.text,
        type: 'info',
        icon: <Info size={16}/>,
        color: 'var(--accent-cyan)'
      };
    }

    const showTimer = setTimeout(() => {
      if (rawNotif && (!notifRef.current || notifRef.current.text !== rawNotif.text)) {
        setIsFadingOut(false);
        setActiveNotification(rawNotif);
        notifRef.current = rawNotif;

        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setActiveNotification(null);
            notifRef.current = null;
            setIsFadingOut(false);
          }, 300);
        }, 4000);
      }
    }, 600);

    return () => clearTimeout(showTimer);
  }, [aiData, context.aiEnabled]);

  // Auto-calculate the safest destination
  const safestZone = Object.keys(zones).reduce((a, b) => zones[a] < zones[b] ? a : b);

  const handleQRScan = () => {
    if (!context.aiEnabled) return;
    const locs = ['Gate A', 'Gate C', 'Main Stage', 'Food Court'];
    const nextLoc = locs[(locs.indexOf(userLocation) + 1) % locs.length];
    
    updateContext('userLocation', nextLoc);
    
    const density = zones[nextLoc];
    let instruction = "Enjoy the event safely.";
    let type = "info";
    let color = "var(--accent-cyan)";
    
    if (density > 75) {
      instruction = `High crowd detected. Move to ${safestZone} for a safer route.`;
      type = "urgent";
      color = "var(--accent-red)";
    } else if (density > 40) {
      instruction = "Moderate crowd. Keep moving to prevent bottlenecks.";
    }

    const qrNotif = {
      title: 'QR Scan Synced',
      text: `You are at ${nextLoc}. ${instruction}`,
      type: type,
      icon: <QrCode size={16}/>,
      color: color
    };

    setIsFadingOut(false);
    setActiveNotification(qrNotif);
    notifRef.current = qrNotif;

    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setActiveNotification(null);
        notifRef.current = null;
        setIsFadingOut(false);
      }, 300);
    }, 4500);
  };

  const handleChat = async () => {
    if (!chatText.trim()) return;
    const q = chatText;
    setChatText('');
    setChatHistory(prev => [...prev, {role:'user', text: q}]);
    setIsChatting(true);
    const answer = await askChatBot(q, context);
    setChatHistory(prev => [...prev, {role:'assistant', text: answer}]);
    setIsChatting(false);
  };

  return (
    <div className="user-app-container">
      <div className="mobile-frame">
        <div className="notch"></div>
        
        {/* Smart Debounced Notification Overlay */}
        {activeNotification && (
          <div className={`push-notification ${activeNotification.type} ${isFadingOut ? 'fade-out' : ''}`}>
            <h4 style={{display:'flex', alignItems:'center', gap:'0.5rem', margin:0, color: activeNotification.color}}>
              {activeNotification.icon} {activeNotification.title}
            </h4>
            <p>{activeNotification.text}</p>
          </div>
        )}

        <div className="app-header">
          <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
            <div style={{background:'linear-gradient(135deg, var(--accent-orange), var(--accent-red))', padding:'8px', borderRadius:'50%'}}>
              <User size={18} color="white"/>
            </div>
            <div>
              <p style={{fontSize:'0.7rem', color:'var(--text-secondary)', margin:0}}>Welcome</p>
              <h3 style={{fontSize:'1rem', margin:0, color:'var(--text-primary)'}}>{persona}</h3>
            </div>
          </div>
          <Compass className="gradient-text"/>
        </div>

        <div className="app-content">
          <div className={`widget ${context.aiEnabled ? 'ai-active-glow' : ''}`} style={{background: 'var(--bg-widget)', borderColor: 'var(--widget-border)', transition: 'all 0.3s ease'}}>
            <h3 className="widget-title" style={{color: 'var(--accent-cyan)'}}>Decision Engine <br/><span style={{fontSize:'0.6rem', color:'var(--text-secondary)', fontWeight:'normal'}}>What should I do now?</span></h3>
            
            {context.aiEnabled && (
              <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.25rem'}}>
                📍 You are at: <strong style={{color:'var(--text-primary)'}}>{context.userLocation}</strong>
              </p>
            )}

            <p className="suggestion-text">{aiData?.mainSuggestion}</p>
            {context.aiEnabled && (
              <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', fontStyle:'italic', marginTop:'0.5rem', marginBottom:'0.5rem'}}>
                ↳ {aiData?.reasoning}
              </p>
            )}

            {/* User Impact Highlight */}
            {context.aiEnabled && (
               <div style={{background: 'var(--bg-input)', borderRadius:'6px', padding:'0.75rem', marginTop:'1rem', marginBottom:'1rem', borderLeft:'3px solid var(--accent-green)'}}>
                 <p style={{fontSize:'0.8rem', color:'var(--text-primary)', margin:0, display:'flex', alignItems:'center', gap:'0.5rem'}}>
                   ⏱ Saved {aiData?.metrics?.waitReduction || '~6 minutes'}
                 </p>
                 <p style={{fontSize:'0.8rem', color:'var(--text-primary)', margin:'0.25rem 0 0 0', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                   🚶 Avoided high congestion
                 </p>
               </div>
            )}

            {!showRoute ? (
              <button className="actionable-btn" style={{padding: '1rem', fontSize: '1.1rem', boxShadow: '0 8px 25px rgba(0, 210, 255, 0.4)'}} onClick={() => setShowRoute(true)}>View Safe Route</button>
            ) : (
              <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(0,255,100,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,100,0.3)'}}>
                 <h4 style={{margin:0, color:'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.5rem'}}><Route size={16}/> Active Safe Route</h4>
                 
                 <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1rem', fontSize:'0.75rem', color:'var(--text-primary)', textAlign:'center'}}>
                    <div style={{background:'var(--bg-panel-border)', padding:'0.5rem', borderRadius:'6px', flex:1}}>{userLocation}</div>
                    <ArrowRight size={14} color="var(--text-secondary)" style={{margin:'0 0.25rem'}}/>
                    <div style={{background:'var(--bg-panel-border)', padding:'0.5rem', borderRadius:'6px', flex:1}}>Service Lane</div>
                    <ArrowRight size={14} color="var(--text-secondary)" style={{margin:'0 0.25rem'}}/>
                    <div style={{background:'var(--accent-green)', color:'#000', padding:'0.5rem', borderRadius:'6px', fontWeight:'bold', flex:1}}>{safestZone}</div>
                 </div>
                 
                 <button style={{marginTop:'1rem', width:'100%', padding:'0.5rem', background:'transparent', border:'1px solid var(--bg-panel-border)', color:'var(--text-secondary)', borderRadius:'4px', cursor:'pointer'}} onClick={() => setShowRoute(false)}>Close Navigation</button>
              </div>
            )}
          </div>

          <div className="widget" style={{background: 'var(--bg-panel)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 className="widget-title" style={{color:'var(--text-secondary)', margin:0}}>User Simulator Input</h3>
              <button 
                onClick={handleQRScan}
                style={{display:'flex', alignItems:'center', gap:'0.25rem', background:'var(--accent-cyan)', color:'#000', border:'none', padding:'4px 8px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:'bold', cursor:'pointer'}}
              >
                <QrCode size={12}/> SCAN QR
              </button>
            </div>
            <div style={{display:'flex', gap:'0.5rem', marginTop:'0.75rem'}}>
              <select 
                value={context.userLocation} 
                onChange={(e) => updateContext('userLocation', e.target.value)}
                 style={{flex:1, padding:'6px', background:'var(--bg-input)', color:'var(--text-primary)', border:'1px solid var(--bg-panel-border)', borderRadius:'4px', fontSize:'0.8rem'}}
              >
                <option>Gate A</option>
                <option>Gate C</option>
                <option>Main Stage</option>
                <option>Food Court</option>
              </select>
              <select 
                value={persona} 
                onChange={(e) => updateContext('persona', e.target.value)}
                 style={{flex:1, padding:'6px', background:'var(--bg-input)', color:'var(--text-primary)', border:'1px solid var(--bg-panel-border)', borderRadius:'4px', fontSize:'0.8rem'}}
              >
                <option>Family</option>
                <option>Foodie</option>
                <option>Quick Exit</option>
              </select>
            </div>
          </div>

          <div className="widget">
            <h3 className="widget-title"><Heart size={14} style={{display:'inline', marginRight:'4px'}}/> Personalization ({persona} at {context.userLocation})</h3>
            <p style={{fontSize:'0.9rem', color:'var(--text-secondary)'}}>{aiData?.personalization}</p>
          </div>
          
          {/* Indian Context Feature */}
          {context.aiEnabled && (
            <div className="widget" style={{borderLeft: '4px solid var(--accent-green)'}}>
              <h3 className="widget-title"><HandHeart size={14} style={{display:'inline', marginRight:'4px'}}/> Safe Reunion Point</h3>
              <p style={{fontSize:'0.9rem', color:'var(--text-secondary)'}}>{aiData?.reunion}</p>
            </div>
          )}

          <div className="widget" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'transparent', border:'none', padding:0}}>
            <div className="widget" style={{margin:0}}>
              <h3 className="widget-title">Crowd Radar</h3>
              <p style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{aiData?.prediction}</p>
            </div>
            <div className="widget" style={{margin:0}}>
              <h3 className="widget-title">Smart Timing</h3>
              <p style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{aiData?.timing}</p>
            </div>
          </div>

          <div className="widget" style={{padding:'0.5rem', background:'var(--bg-panel)', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <h3 className="widget-title" style={{margin:'0'}}>Ask AI Assistant</h3>
            <div style={{maxHeight:'150px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.5rem', padding:'0.25rem'}}>
              {chatHistory.length === 0 && <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontStyle:'italic'}}>Ask about queues, food, or exits...</p>}
              {chatHistory.map((msg, i) => (
                <div key={i} style={{background: msg.role === 'user' ? 'var(--chat-user-bg)' : 'var(--chat-ai-bg)', color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--chat-ai-color)', padding:'0.5rem 0.75rem', borderRadius:'6px', fontSize:'0.8rem', alignSelf: msg.role==='user'?'flex-end':'flex-start', maxWidth:'80%'}}>
                  {msg.text}
                </div>
              ))}
              {isChatting && <div style={{color:'var(--text-secondary)', fontSize:'0.7rem'}}>AI is thinking...</div>}
            </div>
            <div style={{display:'flex', gap:'0.25rem'}}>
              <input 
                type="text" 
                placeholder="Message AI..." 
                value={chatText} 
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                style={{flex:1, padding:'8px', background:'var(--bg-input)', border:'1px solid var(--bg-panel-border)', color:'var(--text-primary)', borderRadius:'4px', fontSize:'0.8rem'}} 
              />
              <button 
                onClick={handleChat} 
                style={{background:'var(--accent-cyan)', color:'#000', border:'none', padding:'0 12px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div style={{padding:'1rem', background:'var(--bg-panel)', borderTop:'1px solid var(--bg-panel-border)', display:'flex', justifyContent:'space-around'}}>
          <MapPin color="var(--accent-cyan)" />
          <User color="var(--text-secondary)" />
          <Settings color="var(--text-secondary)" />
        </div>
      </div>
    </div>
  );
};

export default UserApp;
