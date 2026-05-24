import { useState, useEffect, useRef } from 'react';
import { CARDS, TRIBE_DATA, RARITY_DATA } from '../gameData';
import CardDisplay from '../components/CardDisplay';
import { makeFighter } from '../utils';

const C={bg:'#07070a',panel:'#0d0d12',orange:'#F26522',amber:'#F5A623',text:'#EDE0CC',muted:'#4a3f5a',green:'#4ade80',red:'#f87171',blue:'#60a5fa',purple:'#c084fc'};

// Simulated PvP rooms
const DUMMY_ROOMS=[
  {id:'r1',host:'Kaz_Overworld',tribe:'overworld',status:'waiting',players:1,maxPlayers:2},
  {id:'r2',host:'SandStorm99',tribe:'mipedian',status:'waiting',players:1,maxPlayers:2},
  {id:'r3',host:'DeepWater_Phelphor',tribe:'marrillian',status:'in_game',players:2,maxPlayers:2},
  {id:'r4',host:'InfernoLord',tribe:'underworld',status:'waiting',players:1,maxPlayers:2},
  {id:'r5',host:'HiveMind_Danian',tribe:'danian',status:'in_game',players:2,maxPlayers:2},
];

export default function PvP({codex,collection,coins,onClose,onStartBattle}) {
  const [tab,setTab]=useState('lobby');
  const [rooms,setRooms]=useState(DUMMY_ROOMS);
  const [inRoom,setInRoom]=useState(null);
  const [msg,setMsg]=useState(null);
  const [roomName,setRoomName]=useState('');
  const [searching,setSearching]=useState(false);
  const [countdown,setCountdown]=useState(null);
  const [chatMessages,setChatMessages]=useState([
    {user:'System',text:'Welcome to Chaotic PvP!',color:C.orange},
    {user:'Kaz_Overworld',text:'Who wants to battle? Overworld is unbeatable!',color:TRIBE_DATA.overworld.color},
    {user:'SandStorm99',text:'Mipedians are fastest! Come fight me',color:TRIBE_DATA.mipedian.color},
    {user:'DeepWater_Phelphor',text:"M'arrillians will overwhelm you all",color:TRIBE_DATA.marrillian.color},
  ]);
  const [chatInput,setChatInput]=useState('');
  const chatRef=useRef(null);

  const teamSize=Object.values(codex?.team||{}).reduce((s,n)=>s+n,0);
  const hasValidTeam=teamSize>0;

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[chatMessages]);

  // Simulate other players joining/chatting
  useEffect(()=>{
    const msgs=[
      {user:'InfernoLord',text:'Chaor destroys all challengers!',color:TRIBE_DATA.underworld.color},
      {user:'HiveMind_Danian',text:'The hive is unstoppable',color:TRIBE_DATA.danian.color},
      {user:'Kaz_Overworld',text:'Anyone want a rematch?',color:TRIBE_DATA.overworld.color},
      {user:'System',text:'New player joined Chaotic!',color:C.orange},
      {user:'SandStorm99',text:'GG everyone',color:TRIBE_DATA.mipedian.color},
    ];
    let i=0;
    const interval=setInterval(()=>{
      if(i<msgs.length){
        setChatMessages(prev=>[...prev,msgs[i]].slice(-50));
        i++;
      }
    },8000+Math.random()*6000);
    return()=>clearInterval(interval);
  },[]);

  function showMsg(text,color=C.green){
    setMsg({text,color});
    setTimeout(()=>setMsg(null),3000);
  }

  function sendChat(){
    if(!chatInput.trim()) return;
    setChatMessages(prev=>[...prev,{user:'You',text:chatInput.trim(),color:C.amber}].slice(-50));
    setChatInput('');
  }

  function createRoom(){
    if(!hasValidTeam){showMsg('Build a team in Collection first!',C.red);return;}
    const r={id:'my_room',host:'You',tribe:Object.keys(TRIBE_DATA)[0],status:'waiting',players:1,maxPlayers:2,isOwn:true};
    setInRoom(r);
    setRooms(prev=>[r,...prev]);
    setTab('room');
    setChatMessages(prev=>[...prev,{user:'System',text:'You created a room! Waiting for opponent…',color:C.orange}].slice(-50));
    // Simulate opponent joining after delay
    setTimeout(()=>{
      setInRoom(r2=>r2?{...r2,players:2,status:'ready',opponent:'Random_Challenger'}:r2);
      setChatMessages(prev=>[...prev,{user:'System',text:'Random_Challenger has joined your room!',color:C.green}].slice(-50));
    },4000+Math.random()*4000);
  }

  function joinRoom(room){
    if(!hasValidTeam){showMsg('Build a team in Collection first!',C.red);return;}
    if(room.status==='in_game'){showMsg('That battle is already underway!',C.red);return;}
    setInRoom({...room,players:2,status:'ready',opponent:room.host,isJoiner:true});
    setTab('room');
    setChatMessages(prev=>[...prev,{user:'System',text:`You joined ${room.host}'s room!`,color:C.green}].slice(-50));
  }

  function quickMatch(){
    if(!hasValidTeam){showMsg('Build a team in Collection first!',C.red);return;}
    setSearching(true);
    showMsg('Finding opponent…',C.blue);
    setTimeout(()=>{
      setSearching(false);
      const names=['Perim_Master','Shadow_Kaz','TribeWalker','ElementLord','ChaoticPro99'];
      const opName=names[Math.floor(Math.random()*names.length)];
      const r={id:'quick',host:opName,tribe:Object.keys(TRIBE_DATA)[Math.floor(Math.random()*5)],status:'ready',players:2,maxPlayers:2,opponent:opName,isJoiner:true};
      setInRoom(r);
      setTab('room');
      setChatMessages(prev=>[...prev,{user:'System',text:`Matched with ${opName}!`,color:C.green}].slice(-50));
    },2000+Math.random()*3000);
  }

  function startBattle(){
    if(!inRoom||inRoom.players<2) return;
    setCountdown(3);
    const timer=setInterval(()=>{
      setCountdown(c=>{
        if(c<=1){clearInterval(timer);return null;}
        return c-1;
      });
    },1000);
    setTimeout(()=>{
      // Launch PvP simulation — use AI as stand-in for opponent
      onStartBattle('pvp',inRoom.opponent||'PvP Opponent');
      setInRoom(null);setTab('lobby');
    },3500);
  }

  function leaveRoom(){
    setInRoom(null);setTab('lobby');setCountdown(null);
    setChatMessages(prev=>[...prev,{user:'System',text:'You left the room.',color:C.muted}].slice(-50));
  }

  const statsRows=[
    {label:'PvP Wins',value:'—',color:C.green},
    {label:'PvP Losses',value:'—',color:C.red},
    {label:'Win Rate',value:'—',color:C.amber},
    {label:'Rank',value:'Unranked',color:C.blue},
  ];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      {/* Header */}
      <div style={{borderBottom:`2px solid ${C.orange}`,padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0806',flexShrink:0}}>
        <div>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Chaotic Hub</div>
          <div style={{fontSize:18,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>PvP Arena</div>
          <div style={{fontSize:9,color:C.muted,marginTop:1}}>Battle other Chaotic players · {rooms.filter(r=>r.status==='waiting').length} rooms open</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {!hasValidTeam&&<div style={{fontSize:9,color:C.red,background:'#1a0a0a',border:'1px solid #f87171',borderRadius:5,padding:'4px 10px'}}>⚠ No team in codex!</div>}
          <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase',letterSpacing:1}}>← Hub</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,padding:'0 18px',background:'#0a0806',borderBottom:'1px solid #1a1020',flexShrink:0}}>
        {['lobby','room','stats'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',background:tab===t?C.panel:'transparent',border:'none',borderBottom:tab===t?`2px solid ${C.orange}`:'2px solid transparent',color:tab===t?C.orange:C.muted,fontSize:10,cursor:'pointer',fontWeight:tab===t?'bold':'normal',textTransform:'uppercase',letterSpacing:1}}>
            {t==='lobby'?'🏟 Lobby':t==='room'?`🔴 Room${inRoom?' ('+inRoom.players+'/2)':''}`:'📊 Stats'}
          </button>
        ))}
      </div>

      {msg&&<div style={{position:'fixed',top:80,left:'50%',transform:'translateX(-50%)',background:'#0a0a14',border:`1px solid ${msg.color}`,color:msg.color,padding:'10px 24px',borderRadius:8,zIndex:1000,fontSize:11,fontWeight:'bold'}}>{msg.text}</div>}
      {countdown&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,fontSize:80,fontWeight:'bold',color:C.orange}}>{countdown}</div>}

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* Lobby Tab */}
        {tab==='lobby'&&(
          <div style={{flex:1,display:'flex',overflow:'hidden'}}>
            <div style={{flex:1,overflowY:'auto',padding:16}}>
              {/* Action buttons */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
                <button onClick={quickMatch} disabled={!hasValidTeam||searching} style={{background:hasValidTeam?'linear-gradient(135deg,#1a4a0a,#2a6a1a)':'#0a0a0a',border:`1px solid ${hasValidTeam?C.green:'#333'}`,color:hasValidTeam?C.green:'#444',borderRadius:10,padding:16,cursor:hasValidTeam?'pointer':'not-allowed',textAlign:'left',transition:'all 0.2s'}}>
                  <div style={{fontSize:24,marginBottom:6}}>{searching?'⏳':'⚡'}</div>
                  <div style={{fontSize:11,fontWeight:'bold',textTransform:'uppercase',letterSpacing:1}}>{searching?'Searching…':'Quick Match'}</div>
                  <div style={{fontSize:8,color:C.muted,marginTop:3}}>Auto-match with another player</div>
                </button>
                <button onClick={createRoom} disabled={!hasValidTeam} style={{background:hasValidTeam?'linear-gradient(135deg,#1a1a4a,#2a2a6a)':'#0a0a0a',border:`1px solid ${hasValidTeam?C.blue:'#333'}`,color:hasValidTeam?C.blue:'#444',borderRadius:10,padding:16,cursor:hasValidTeam?'pointer':'not-allowed',textAlign:'left',transition:'all 0.2s'}}>
                  <div style={{fontSize:24,marginBottom:6}}>🏟</div>
                  <div style={{fontSize:11,fontWeight:'bold',textTransform:'uppercase',letterSpacing:1}}>Create Room</div>
                  <div style={{fontSize:8,color:C.muted,marginTop:3}}>Create a private battle room</div>
                </button>
                <div style={{background:C.panel,border:'1px solid #1a1020',borderRadius:10,padding:16}}>
                  <div style={{fontSize:24,marginBottom:6}}>📊</div>
                  <div style={{fontSize:11,fontWeight:'bold',color:C.muted,textTransform:'uppercase',letterSpacing:1}}>Your Deck</div>
                  <div style={{fontSize:8,color:teamSize>0?C.green:C.red,marginTop:3}}>{teamSize}/{6} creatures loaded</div>
                </div>
              </div>

              {/* Room list */}
              <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>Open Rooms ({rooms.filter(r=>r.status==='waiting').length})</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {rooms.map(room=>{
                  const td=TRIBE_DATA[room.tribe]||{};
                  const waiting=room.status==='waiting';
                  return (
                    <div key={room.id} style={{background:C.panel,border:`1px solid ${waiting?td.color+'33':'#1a1020'}`,borderRadius:8,padding:'12px 16px',display:'flex',alignItems:'center',gap:14,opacity:waiting?1:0.5}}>
                      <div style={{fontSize:24}}>{td.icon||'⚡'}</div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                          <span style={{fontSize:11,fontWeight:'bold',color:C.text}}>{room.host}'s Room</span>
                          <span style={{fontSize:8,background:waiting?C.green+'22':C.red+'22',color:waiting?C.green:C.red,border:`1px solid ${waiting?C.green:C.red}`,borderRadius:3,padding:'1px 5px',textTransform:'uppercase'}}>{waiting?'OPEN':'IN GAME'}</span>
                        </div>
                        <div style={{fontSize:8,color:td.color||C.muted,textTransform:'uppercase'}}>{td.name} Tribe</div>
                      </div>
                      <div style={{fontSize:9,color:C.muted}}>{room.players}/{room.maxPlayers} players</div>
                      {waiting&&!room.isOwn&&(
                        <button onClick={()=>joinRoom(room)} disabled={!hasValidTeam} style={{background:hasValidTeam?td.color+'22':'transparent',border:`1px solid ${hasValidTeam?td.color||C.orange:'#333'}`,color:hasValidTeam?td.color||C.orange:'#444',borderRadius:6,padding:'7px 16px',cursor:hasValidTeam?'pointer':'not-allowed',fontSize:9,fontWeight:'bold',textTransform:'uppercase'}}>
                          Join →
                        </button>
                      )}
                      {room.isOwn&&<span style={{fontSize:8,color:C.muted}}>Your Room</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Chat */}
            <div style={{width:240,borderLeft:'1px solid #1a1020',display:'flex',flexDirection:'column',flexShrink:0}}>
              <div style={{padding:'10px 12px',borderBottom:'1px solid #1a1020',fontSize:9,color:C.orange,textTransform:'uppercase',letterSpacing:1}}>💬 Chaotic Chat</div>
              <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:'8px 12px'}}>
                {chatMessages.map((m,i)=>(
                  <div key={i} style={{marginBottom:5}}>
                    <span style={{fontSize:8.5,fontWeight:'bold',color:m.color||C.text}}>{m.user}: </span>
                    <span style={{fontSize:8.5,color:'#aaa'}}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:8,borderTop:'1px solid #1a1020',display:'flex',gap:4}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Chat…" style={{flex:1,background:'#111',border:'1px solid #333',borderRadius:5,padding:'5px 8px',color:C.text,fontSize:9,outline:'none'}}/>
                <button onClick={sendChat} style={{background:C.orange,color:'#000',border:'none',borderRadius:5,padding:'0 8px',cursor:'pointer',fontSize:10,fontWeight:'bold'}}>→</button>
              </div>
            </div>
          </div>
        )}

        {/* Room Tab */}
        {tab==='room'&&(
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
            {!inRoom?(
              <div style={{textAlign:'center',color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>🏟</div>
                <div style={{fontSize:13}}>You're not in a room</div>
                <button onClick={()=>setTab('lobby')} style={{marginTop:12,background:'transparent',border:`1px solid ${C.orange}`,color:C.orange,borderRadius:6,padding:'8px 20px',cursor:'pointer',fontSize:10,textTransform:'uppercase'}}>Go to Lobby</button>
              </div>
            ):(
              <div style={{background:C.panel,border:`1px solid ${C.orange}44`,borderRadius:14,padding:32,maxWidth:500,width:'100%',textAlign:'center'}}>
                <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>Battle Room</div>
                <div style={{fontSize:20,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3,marginBottom:20}}>⚔ Versus ⚔</div>

                <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',marginBottom:24}}>
                  <div>
                    <div style={{fontSize:32,marginBottom:6}}>🎮</div>
                    <div style={{fontSize:12,fontWeight:'bold',color:C.text}}>You</div>
                    <div style={{fontSize:9,color:C.green}}>✅ Ready</div>
                    <div style={{fontSize:8,color:C.muted,marginTop:3}}>{teamSize} creatures</div>
                  </div>
                  <div style={{fontSize:28,color:C.muted}}>VS</div>
                  <div>
                    <div style={{fontSize:32,marginBottom:6}}>🤖</div>
                    <div style={{fontSize:12,fontWeight:'bold',color:C.text}}>{inRoom.opponent||'Waiting…'}</div>
                    <div style={{fontSize:9,color:inRoom.players>=2?C.green:C.muted}}>{inRoom.players>=2?'✅ Ready':'⏳ Joining…'}</div>
                  </div>
                </div>

                <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16}}>
                  <div style={{fontSize:9,color:C.muted,padding:'5px 10px',background:'#0a0a0a',borderRadius:5,border:'1px solid #222'}}>{inRoom.players}/2 Players</div>
                  <div style={{fontSize:9,color:inRoom.status==='ready'?C.green:C.muted,padding:'5px 10px',background:'#0a0a0a',borderRadius:5,border:'1px solid #222'}}>{inRoom.status==='ready'?'⚡ READY':'⏳ WAITING'}</div>
                </div>

                <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                  <button onClick={leaveRoom} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:8,padding:'10px 20px',cursor:'pointer',fontSize:10,textTransform:'uppercase'}}>Leave Room</button>
                  <button onClick={startBattle} disabled={inRoom.players<2} style={{background:inRoom.players>=2?C.orange:'#1a1020',color:inRoom.players>=2?'#000':'#444',border:'none',borderRadius:8,padding:'10px 28px',cursor:inRoom.players>=2?'pointer':'not-allowed',fontSize:12,fontWeight:'bold',textTransform:'uppercase',letterSpacing:2}}>
                    {inRoom.players>=2?'⚔ Start Battle!':'⏳ Waiting…'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {tab==='stats'&&(
          <div style={{flex:1,overflowY:'auto',padding:20}}>
            <div style={{maxWidth:600,margin:'0 auto'}}>
              <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1020',padding:20,marginBottom:16}}>
                <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:12}}>Your PvP Record</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {statsRows.map(s=>(
                    <div key={s.label} style={{background:'#0a0a0a',borderRadius:8,padding:14,border:`1px solid ${s.color}22`}}>
                      <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{s.label}</div>
                      <div style={{fontSize:20,fontWeight:'bold',color:s.color}}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1020',padding:20}}>
                <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:12}}>Global Leaderboard</div>
                {[
                  {name:'Kaz_Overworld',wins:342,tribe:'overworld',rank:'Grand Master'},
                  {name:'InfernoLord',wins:287,tribe:'underworld',rank:'Legend'},
                  {name:'SandStorm99',wins:234,tribe:'mipedian',rank:'Legend'},
                  {name:'DeepWater_Phelphor',wins:198,tribe:'marrillian',rank:'Champion'},
                  {name:'HiveMind_Danian',wins:167,tribe:'danian',rank:'Champion'},
                  {name:'You',wins:0,tribe:'overworld',rank:'Unranked',isYou:true},
                ].sort((a,b)=>b.wins-a.wins).map((p,i)=>{
                  const td=TRIBE_DATA[p.tribe]||{};
                  return (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #111',opacity:p.isYou?0.7:1}}>
                      <div style={{fontSize:13,fontWeight:'bold',color:i<3?C.amber:C.muted,width:20}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <span style={{fontSize:10,fontWeight:'bold',color:p.isYou?C.orange:C.text}}>{p.name}</span>
                        <span style={{fontSize:8,color:td.color||C.muted,marginLeft:8,textTransform:'uppercase'}}>{td.name}</span>
                      </div>
                      <div style={{fontSize:9,color:C.muted,textTransform:'uppercase'}}>{p.rank}</div>
                      <div style={{fontSize:10,fontWeight:'bold',color:C.green,width:60,textAlign:'right'}}>{p.wins} W</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
