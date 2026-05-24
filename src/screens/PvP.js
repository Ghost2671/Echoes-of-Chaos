import { useState, useEffect, useRef } from 'react';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171', blue:'#60a5fa', purple:'#c084fc' };

let socketInstance = null;
function getSocket() {
  if (socketInstance) return socketInstance;
  try {
    const { io } = require('socket.io-client');
    socketInstance = io({ transports:['websocket','polling'], reconnectionAttempts:5 });
    return socketInstance;
  } catch { return null; }
}

export default function PvP({ playerId, playerName, codex, onClose, onStartPvpBattle }) {
  const [status, setStatus] = useState('idle'); // idle | connecting | queued | matched | disconnected
  const [queue, setQueue] = useState(0);
  const [opponent, setOpponent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [battleId, setBattleId] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    if (!socket) { setError('Could not connect to server. PvP requires the backend to be running.'); return; }

    socket.emit('player:hello', { playerId, name: playerName });
    socket.on('player:welcomed', () => setStatus('idle'));
    socket.on('queue:joined', ({ position }) => { setStatus('queued'); setQueue(position); });
    socket.on('queue:left', () => setStatus('idle'));
    socket.on('battle:matched', ({ battleId: bid, role, opponent: opp }) => {
      setStatus('matched'); setOpponent(opp); setBattleId(bid);
    });
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', (e) => { setError(`Connection failed: ${e.message}`); setStatus('disconnected'); });

    fetchLeaderboard();
    fetchOnline();
    const timer = setInterval(fetchOnline, 10000);

    return () => {
      clearInterval(timer);
      socket.off('player:welcomed');
      socket.off('queue:joined');
      socket.off('queue:left');
      socket.off('battle:matched');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [playerId]);

  async function fetchLeaderboard() {
    try { const r = await fetch('/api/leaderboard'); const d = await r.json(); setLeaderboard(d||[]); } catch {}
  }
  async function fetchOnline() {
    try { const r = await fetch('/api/online'); const d = await r.json(); setOnlineCount(Array.isArray(d)?d.length:0); } catch {}
  }

  function joinQueue() {
    const socket = socketRef.current;
    if (!socket || !socket.connected) { setError('Not connected to server'); return; }
    const teamSize = Object.values(codex?.team||{}).reduce((s,n)=>s+n,0);
    if (teamSize < 1) { setError('You need at least 1 creature in your team'); return; }
    socket.emit('queue:join', { playerId, codexSnapshot: codex });
    setStatus('connecting');
  }

  function leaveQueue() {
    const socket = socketRef.current;
    if (socket) socket.emit('queue:leave', { playerId });
    setStatus('idle');
  }

  function acceptBattle() {
    if (onStartPvpBattle && battleId && opponent) {
      onStartPvpBattle({ battleId, opponentName: opponent.name, socket: socketRef.current });
    }
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text }}>
      {/* Header */}
      <div style={{ borderBottom:`2px solid ${C.blue}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#080a14' }}>
        <div>
          <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>Online Battling</div>
          <div style={{ fontSize:18, fontWeight:'bold', color:C.blue, textTransform:'uppercase', letterSpacing:3 }}>PvP Arena</div>
          <div style={{ fontSize:8.5, color:C.muted, marginTop:1 }}>{onlineCount} player{onlineCount!==1?'s':''} online</div>
        </div>
        <button onClick={onClose} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'7px 16px', cursor:'pointer', fontSize:10, textTransform:'uppercase' }}>← Hub</button>
      </div>

      <div style={{ padding:20, maxWidth:700, margin:'0 auto' }}>
        {error && (
          <div style={{ background:'#1a0808', border:`1px solid ${C.red}`, borderRadius:8, padding:12, marginBottom:16, fontSize:10, color:C.red }}>
            ⚠ {error}
            <div style={{ marginTop:8, fontSize:9, color:C.muted }}>Make sure the backend server is running (node server.js on port 3001)</div>
          </div>
        )}

        {/* Status card */}
        <div style={{ background:C.panel, border:`1px solid ${status==='matched'?C.green:status==='queued'?C.amber:C.blue}44`, borderRadius:12, padding:20, marginBottom:20, textAlign:'center' }}>
          {status === 'idle' && (
            <>
              <div style={{ fontSize:36, marginBottom:10 }}>⚔</div>
              <div style={{ fontSize:14, fontWeight:'bold', color:C.blue, marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Ready to Battle</div>
              <div style={{ fontSize:9.5, color:C.muted, marginBottom:16, lineHeight:1.6 }}>
                Join the matchmaking queue to fight another player in real-time.<br/>
                Your current team ({Object.values(codex?.team||{}).reduce((s,n)=>s+n,0)} creatures) will be used.
              </div>
              <button onClick={joinQueue} style={{ background:C.blue, color:'#000', border:'none', borderRadius:8, padding:'12px 32px', fontSize:13, fontWeight:'bold', cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                ▶ Join Queue
              </button>
            </>
          )}

          {status === 'connecting' && (
            <div>
              <div style={{ fontSize:24, marginBottom:8 }}>🔄</div>
              <div style={{ color:C.amber, fontSize:13 }}>Connecting to queue...</div>
            </div>
          )}

          {status === 'queued' && (
            <>
              <div style={{ fontSize:24, marginBottom:8 }}>⏳</div>
              <div style={{ fontSize:14, fontWeight:'bold', color:C.amber, marginBottom:6 }}>In Queue — Position #{queue}</div>
              <div style={{ fontSize:9.5, color:C.muted, marginBottom:16 }}>Searching for an opponent. This may take a moment.</div>
              <div style={{ display:'flex', justifyContent:'center', gap:4, marginBottom:16 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:'50%', background:C.amber, animation:`pulse ${0.8+i*0.3}s infinite` }}/>)}
              </div>
              <button onClick={leaveQueue} style={{ background:'transparent', border:`1px solid ${C.red}`, color:C.red, borderRadius:6, padding:'8px 20px', fontSize:10, cursor:'pointer' }}>Leave Queue</button>
            </>
          )}

          {status === 'matched' && (
            <>
              <div style={{ fontSize:24, marginBottom:8 }}>🎉</div>
              <div style={{ fontSize:14, fontWeight:'bold', color:C.green, marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>Match Found!</div>
              <div style={{ fontSize:11, color:C.text, marginBottom:16 }}>vs <strong style={{ color:C.amber }}>{opponent?.name || 'Unknown'}</strong></div>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={acceptBattle} style={{ background:C.green, color:'#000', border:'none', borderRadius:8, padding:'10px 24px', fontSize:12, fontWeight:'bold', cursor:'pointer', textTransform:'uppercase' }}>Start Battle!</button>
                <button onClick={leaveQueue} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'10px 16px', fontSize:10, cursor:'pointer' }}>Decline</button>
              </div>
            </>
          )}

          {status === 'disconnected' && (
            <>
              <div style={{ fontSize:24, marginBottom:8 }}>⚡</div>
              <div style={{ fontSize:13, color:C.red, marginBottom:8 }}>Disconnected from server</div>
              <button onClick={()=>{ socketInstance=null; setStatus('idle'); setError(null); }} style={{ background:C.orange, color:'#000', border:'none', borderRadius:6, padding:'8px 20px', fontSize:10, cursor:'pointer', textTransform:'uppercase' }}>Reconnect</button>
            </>
          )}
        </div>

        {/* How to play */}
        <div style={{ background:C.panel, border:`1px solid #1a1020`, borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>How Online Battle Works</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { icon:'⚔', title:'Build your team', desc:'Add 1-6 creatures to your team in the Collection screen' },
              { icon:'⚡', title:'Join the queue', desc:'Click Join Queue to find an opponent in real-time matchmaking' },
              { icon:'🎮', title:'Battle!', desc:'Use discipline checks, Mugic spells, and strategy to win' },
              { icon:'🏆', title:'Earn coins', desc:'Win coins and climb the leaderboard' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ fontSize:18, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:10, fontWeight:'bold', color:C.text }}>{title}</div>
                  <div style={{ fontSize:8.5, color:C.muted, lineHeight:1.4 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background:C.panel, border:`1px solid #1a1020`, borderRadius:10, padding:16 }}>
          <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>🏆 Leaderboard</div>
          {leaderboard.length === 0 ? (
            <div style={{ color:C.muted, fontSize:10, textAlign:'center', padding:'20px 0' }}>No battles yet. Be the first!</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {leaderboard.map((entry, i) => (
                <div key={entry.playerId} style={{ display:'flex', justifyContent:'space-between', padding:'6px 10px', background:entry.playerId===playerId?'#1a1428':'#0a0810', borderRadius:6, border:`1px solid ${entry.playerId===playerId?C.orange+'44':'#1a1020'}` }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:9, color:i<3?[C.amber,'#aaa','#cd7f32'][i]:C.muted, fontWeight:'bold', width:16 }}>#{i+1}</span>
                    <span style={{ fontSize:10, color:entry.playerId===playerId?C.orange:C.text }}>{entry.name}</span>
                  </div>
                  <div style={{ display:'flex', gap:12, fontSize:9 }}>
                    <span style={{ color:C.green }}>{entry.wins}W</span>
                    <span style={{ color:C.red }}>{entry.losses}L</span>
                    {entry.streak > 1 && <span style={{ color:C.amber }}>🔥{entry.streak}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
