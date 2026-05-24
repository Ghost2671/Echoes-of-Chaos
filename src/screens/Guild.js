import { useState } from 'react';
import { NPC_GUILD_MEMBERS, TRIBE_DATA, FIXED_OPPONENTS } from '../gameData';

const C={bg:'#07070a',panel:'#0d0d12',orange:'#F26522',amber:'#F5A623',text:'#EDE0CC',muted:'#4a3f5a',green:'#4ade80',red:'#f87171',blue:'#60a5fa',purple:'#c084fc',border:'#1a1625'};

const EMBLEMS=['⚔️','🛡️','🌟','🔥','💀','🌊','🐜','🌪️','👑','💎','🗡️','🏆'];
const GUILD_RANKS=['Rookie','Veteran','Elite','Champion','Legend','Grand Master'];

function getRankColor(rank) {
  const m={Rookie:C.muted,Veteran:C.green,Elite:C.blue,Champion:C.purple,Legend:C.amber,['Grand Master']:'#ff6b6b'};
  return m[rank]||C.muted;
}

export default function Guild({guild,coins,wins,onUpdateGuild,onClose}) {
  const [tab,setTab]=useState(guild?'roster':'create');
  const [guildName,setGuildName]=useState('');
  const [emblem,setEmblem]=useState('⚔️');
  const [guildTribe,setGuildTribe]=useState('overworld');
  const [showRecruit,setShowRecruit]=useState(false);
  const [challengeMsg,setChallengeMsg]=useState(null);

  function createGuild() {
    if(!guildName.trim()) return;
    const newGuild={
      name:guildName.trim(),emblem,tribe:guildTribe,
      founded:new Date().toLocaleDateString(),
      members:[{id:'you',name:'You',rank:'Rookie',tribe:guildTribe,avatar:'🎮',wins:wins||0,losses:0,motto:'Let the battles begin!',isPlayer:true}],
      wins:0,losses:0,rank:'Rookie',points:0,
      challengesCompleted:0,
    };
    onUpdateGuild(newGuild);
    setTab('roster');
  }

  function recruitMember(npc) {
    if(!guild) return;
    if(guild.members.find(m=>m.id===npc.id)) return;
    if(coins<100) {setChallengeMsg('Need 100 coins to recruit!');setTimeout(()=>setChallengeMsg(null),2000);return;}
    const updated={...guild,members:[...guild.members,{...npc}]};
    onUpdateGuild(updated,{spendCoins:100});
    setShowRecruit(false);
  }

  function doChallenge(difficulty) {
    const rewardMap={easy:150,medium:300,hard:600};
    const winsNeeded={easy:5,medium:15,hard:30};
    const curWins=wins||0;
    if(curWins<(winsNeeded[difficulty]||0)){
      setChallengeMsg(`Need ${winsNeeded[difficulty]} total wins. You have ${curWins}.`);
      setTimeout(()=>setChallengeMsg(null),3000);
      return;
    }
    const reward=rewardMap[difficulty]||150;
    const newPoints=(guild.points||0)+reward/10;
    const newWins=(guild.wins||0)+1;
    const newCompleted=(guild.challengesCompleted||0)+1;
    let newRank=guild.rank||'Rookie';
    const thresholds=[[0,'Rookie'],[5,'Veteran'],[15,'Elite'],[30,'Champion'],[60,'Legend'],[100,'Grand Master']];
    for(const [n,r] of thresholds){if(newCompleted>=n)newRank=r;}
    onUpdateGuild({...guild,wins:newWins,points:newPoints,rank:newRank,challengesCompleted:newCompleted},{earnCoins:reward});
    setChallengeMsg(`🏆 Challenge complete! +${reward} coins`);
    setTimeout(()=>setChallengeMsg(null),3000);
  }

  function disbandGuild() {
    if(!window.confirm('Disband your guild? This cannot be undone.')) return;
    onUpdateGuild(null);
    setTab('create');
  }

  const td=TRIBE_DATA[guild?.tribe||guildTribe]||TRIBE_DATA.overworld;

  if(!guild||tab==='create') {
    return (
      <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text}}>
        <div style={{borderBottom:`2px solid ${C.orange}`,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0806'}}>
          <div>
            <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Chaotic Hub</div>
            <div style={{fontSize:20,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>Guild</div>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase',letterSpacing:1}}>← Hub</button>
        </div>

        <div style={{maxWidth:560,margin:'40px auto',padding:'0 20px'}}>
          <div style={{background:C.panel,borderRadius:14,border:'1px solid #1a1625',padding:32}}>
            <div style={{textAlign:'center',marginBottom:28}}>
              <div style={{fontSize:48,marginBottom:10}}>{emblem}</div>
              <div style={{fontSize:18,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>Create Your Guild</div>
              <div style={{fontSize:9,color:C.muted,marginTop:4}}>Unite your Chaotic allies under one banner</div>
            </div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Guild Name</div>
              <input value={guildName} onChange={e=>setGuildName(e.target.value)} maxLength={28} placeholder="Enter guild name…" style={{width:'100%',background:'#111',border:`1px solid ${C.orange}44`,borderRadius:8,padding:'10px 14px',color:C.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
            </div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Guild Emblem</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {EMBLEMS.map(e=>(
                  <button key={e} onClick={()=>setEmblem(e)} style={{width:42,height:42,fontSize:20,background:emblem===e?C.orange+'33':'#111',border:`2px solid ${emblem===e?C.orange:'#333'}`,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Tribal Alliance</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {Object.entries(TRIBE_DATA).map(([id,td])=>(
                  <button key={id} onClick={()=>setGuildTribe(id)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${guildTribe===id?td.color:'#333'}`,background:guildTribe===id?td.color+'22':'transparent',color:guildTribe===id?td.color:C.muted,fontSize:9,cursor:'pointer',textTransform:'uppercase',letterSpacing:0.5}}>
                    {td.icon} {td.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={createGuild} disabled={!guildName.trim()} style={{width:'100%',background:guildName.trim()?`linear-gradient(90deg,${C.orange},${C.amber})`:'#1a1020',color:guildName.trim()?'#000':'#444',border:'none',borderRadius:10,padding:'14px',fontSize:14,fontWeight:'bold',cursor:guildName.trim()?'pointer':'not-allowed',textTransform:'uppercase',letterSpacing:2}}>
              ⚔ Found Guild
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableRecruits=NPC_GUILD_MEMBERS.filter(npc=>!guild.members.find(m=>m.id===npc.id));

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text}}>
      {/* Header */}
      <div style={{background:`linear-gradient(90deg,#0a0806,${td.color}33,#0a0806)`,borderBottom:`2px solid ${td.color}`,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{fontSize:36,filter:`drop-shadow(0 0 8px ${td.color}88)`}}>{guild.emblem}</div>
          <div>
            <div style={{fontSize:8,color:td.color,textTransform:'uppercase',letterSpacing:2}}>{TRIBE_DATA[guild.tribe]?.name||''} Guild · Founded {guild.founded}</div>
            <div style={{fontSize:20,fontWeight:'bold',color:C.text,textTransform:'uppercase',letterSpacing:2}}>{guild.name}</div>
            <div style={{display:'flex',gap:10,marginTop:2}}>
              <span style={{fontSize:9,color:getRankColor(guild.rank),fontWeight:'bold',textTransform:'uppercase'}}>{guild.rank}</span>
              <span style={{fontSize:9,color:C.muted}}>{guild.members.length} Members</span>
              <span style={{fontSize:9,color:C.green}}>🏆 {guild.wins} Wins</span>
              <span style={{fontSize:9,color:C.amber}}>✦ {Math.round(guild.points||0)} Points</span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase'}}>← Hub</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,padding:'0 20px',background:'#0a0806',borderBottom:'1px solid #1a1020'}}>
        {['roster','challenges','leaderboard'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',background:tab===t?C.panel:'transparent',border:'none',borderBottom:tab===t?`2px solid ${td.color}`:'2px solid transparent',color:tab===t?td.color:C.muted,fontSize:10,cursor:'pointer',fontWeight:tab===t?'bold':'normal',textTransform:'uppercase',letterSpacing:1}}>
            {t==='roster'?'👥 Roster':t==='challenges'?'⚔ Challenges':'🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {challengeMsg&&(
        <div style={{position:'fixed',top:80,left:'50%',transform:'translateX(-50%)',background:challengeMsg.startsWith('🏆')?'#0a2a0a':'#2a0a0a',border:`1px solid ${challengeMsg.startsWith('🏆')?C.green:C.red}`,color:challengeMsg.startsWith('🏆')?C.green:C.red,padding:'10px 24px',borderRadius:8,zIndex:1000,fontSize:11,fontWeight:'bold'}}>
          {challengeMsg}
        </div>
      )}

      {/* Roster Tab */}
      {tab==='roster'&&(
        <div style={{padding:'20px',maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>{guild.members.length} Members</div>
            <button onClick={()=>setShowRecruit(!showRecruit)} style={{background:td.color+'22',border:`1px solid ${td.color}`,color:td.color,borderRadius:6,padding:'6px 16px',cursor:'pointer',fontSize:9,textTransform:'uppercase',letterSpacing:1}}>+ Recruit (💰100)</button>
          </div>

          {showRecruit&&availableRecruits.length>0&&(
            <div style={{background:C.panel,border:`1px solid ${td.color}44`,borderRadius:10,padding:14,marginBottom:16}}>
              <div style={{fontSize:9,color:td.color,textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>Available Recruits</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
                {availableRecruits.map(npc=>{
                  const ntd=TRIBE_DATA[npc.tribe]||{};
                  return (
                    <div key={npc.id} style={{background:'#0a0a0a',border:`1px solid ${ntd.color||'#333'}33`,borderRadius:8,padding:10,display:'flex',alignItems:'center',gap:10}}>
                      <div style={{fontSize:24}}>{npc.avatar}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:'bold',color:C.text}}>{npc.name}</div>
                        <div style={{fontSize:8,color:ntd.color||C.muted,textTransform:'uppercase'}}>{ntd.name}</div>
                        <div style={{fontSize:8,color:C.muted}}>{npc.wins}W / {npc.losses}L</div>
                      </div>
                      <button onClick={()=>recruitMember(npc)} style={{background:C.amber+'22',border:`1px solid ${C.amber}`,color:C.amber,borderRadius:5,padding:'5px 10px',cursor:'pointer',fontSize:8,textTransform:'uppercase'}}>Recruit</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {showRecruit&&availableRecruits.length===0&&<div style={{color:C.muted,fontSize:10,marginBottom:16,padding:10}}>All available Chaotic players have already been recruited!</div>}

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
            {guild.members.map(m=>{
              const mtd=TRIBE_DATA[m.tribe]||{};
              const rankColor=getRankColor(m.rank);
              return (
                <div key={m.id} style={{background:C.panel,border:`1px solid ${mtd.color||'#333'}33`,borderRadius:10,padding:14,display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:32,filter:`drop-shadow(0 0 6px ${mtd.color||'#fff'}66)`}}>{m.avatar}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div style={{fontSize:12,fontWeight:'bold',color:C.text}}>{m.name}</div>
                      <div style={{fontSize:8,color:rankColor,fontWeight:'bold',textTransform:'uppercase'}}>{m.rank}</div>
                    </div>
                    <div style={{fontSize:8,color:mtd.color||C.muted,textTransform:'uppercase',marginBottom:4}}>{mtd.icon} {mtd.name}</div>
                    <div style={{display:'flex',gap:10}}>
                      <span style={{fontSize:8,color:C.green}}>🏆 {m.wins} W</span>
                      <span style={{fontSize:8,color:C.red}}>💀 {m.losses} L</span>
                    </div>
                    {m.motto&&<div style={{fontSize:8,color:C.muted,fontStyle:'italic',marginTop:4}}>"{m.motto}"</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{marginTop:24,paddingTop:16,borderTop:'1px solid #1a1020'}}>
            <button onClick={disbandGuild} style={{background:'transparent',border:'1px solid #f87171',color:C.red,borderRadius:6,padding:'6px 16px',cursor:'pointer',fontSize:9,textTransform:'uppercase'}}>⚠ Disband Guild</button>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {tab==='challenges'&&(
        <div style={{padding:'20px',maxWidth:800,margin:'0 auto'}}>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:16}}>Guild Challenges Completed: {guild.challengesCompleted||0}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
            {[
              {id:'easy',label:'Scout Challenge',desc:'Defeat 5 opponents to prove your worth',icon:'⚔️',color:C.green,wins:5,reward:150},
              {id:'medium',label:'Veteran Trial',desc:'Achieve 15 total wins in battle',icon:'🛡️',color:C.blue,wins:15,reward:300},
              {id:'hard',label:'Legend\'s Gauntlet',desc:'Reach 30 total wins to become a champion',icon:'👑',color:C.amber,wins:30,reward:600},
              {id:'easy',label:'Story Arc I',desc:'Clear 3 story battle opponents',icon:'📖',color:C.green,wins:5,reward:150},
              {id:'medium',label:'Tribal Mastery',desc:'Win battles with 3 different tribes',icon:'🌍',color:C.blue,wins:15,reward:300},
              {id:'hard',label:'Grand Tournament',desc:'30 wins — Prove yourself the greatest Chaotic player',icon:'🏆',color:'#ff6b6b',wins:30,reward:600},
            ].map((ch,i)=>{
              const canDo=(wins||0)>=(ch.wins);
              return (
                <div key={i} style={{background:C.panel,border:`1px solid ${canDo?ch.color+'55':'#1a1020'}`,borderRadius:12,overflow:'hidden'}}>
                  <div style={{background:`linear-gradient(135deg,#0a0a0a,${ch.color}22)`,padding:'14px 16px',borderBottom:`1px solid ${ch.color}22`}}>
                    <div style={{fontSize:24,marginBottom:6}}>{ch.icon}</div>
                    <div style={{fontSize:12,fontWeight:'bold',color:ch.color,textTransform:'uppercase',letterSpacing:1}}>{ch.label}</div>
                    <div style={{fontSize:8.5,color:C.muted,marginTop:4,lineHeight:1.5}}>{ch.desc}</div>
                  </div>
                  <div style={{padding:'10px 16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <span style={{fontSize:9,color:C.muted}}>Requires: {ch.wins} wins</span>
                      <span style={{fontSize:9,color:C.amber}}>💰 +{ch.reward}</span>
                    </div>
                    <div style={{width:'100%',height:4,background:'#111',borderRadius:2,marginBottom:10,overflow:'hidden'}}>
                      <div style={{width:`${Math.min(100,((wins||0)/ch.wins)*100)}%`,height:'100%',background:ch.color,borderRadius:2}}/>
                    </div>
                    <button onClick={()=>doChallenge(ch.id)} disabled={!canDo} style={{width:'100%',background:canDo?ch.color+'22':'#0a0a0a',border:`1px solid ${canDo?ch.color:'#333'}`,color:canDo?ch.color:'#444',borderRadius:7,padding:'8px',fontSize:9,cursor:canDo?'pointer':'not-allowed',textTransform:'uppercase',letterSpacing:1}}>
                      {canDo?'Claim Reward':'Locked'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {tab==='leaderboard'&&(
        <div style={{padding:'20px',maxWidth:700,margin:'0 auto'}}>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:16}}>Top Guilds in Chaotic</div>
          {[
            {name:'Overworld Vanguard',emblem:'⚔️',tribe:'overworld',rank:'Grand Master',wins:2341,points:8823},
            {name:'Inferno Legion',emblem:'🔥',tribe:'underworld',rank:'Legend',wins:1987,points:7430},
            {name:'Desert Wind Clan',emblem:'🌪️',tribe:'mipedian',rank:'Legend',wins:1742,points:6621},
            {name:guild.name,emblem:guild.emblem,tribe:guild.tribe,rank:guild.rank,wins:guild.wins,points:Math.round(guild.points||0),isYou:true},
            {name:"Deep Tide Alliance",emblem:'🌊',tribe:'marrillian',rank:'Champion',wins:1234,points:5010},
            {name:'Hive Collective',emblem:'🐜',tribe:'danian',rank:'Champion',wins:1102,points:4760},
            {name:'All-Tribe Crusaders',emblem:'💎',tribe:'overworld',rank:'Elite',wins:892,points:3200},
            {name:'Shadow Hunters',emblem:'💀',tribe:'underworld',rank:'Elite',wins:756,points:2900},
          ].sort((a,b)=>(b.points||0)-(a.points||0)).map((g,i)=>{
            const gtd=TRIBE_DATA[g.tribe]||{};
            return (
              <div key={i} style={{background:g.isYou?C.panel+'aa':C.panel,border:`1px solid ${g.isYou?(td.color||C.orange):'#1a1020'}`,borderRadius:8,padding:'12px 16px',marginBottom:8,display:'flex',alignItems:'center',gap:14}}>
                <div style={{fontSize:18,fontWeight:'bold',color:i<3?C.amber:C.muted,width:24,textAlign:'center'}}>{i+1}</div>
                <div style={{fontSize:24}}>{g.emblem}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:'bold',color:g.isYou?gtd.color||C.orange:C.text}}>{g.name}{g.isYou&&' (You)'}</div>
                  <div style={{fontSize:8,color:gtd.color||C.muted,textTransform:'uppercase'}}>{gtd.name} · {g.rank}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,fontWeight:'bold',color:C.amber}}>✦ {g.points}</div>
                  <div style={{fontSize:8,color:C.muted}}>🏆 {g.wins} wins</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
