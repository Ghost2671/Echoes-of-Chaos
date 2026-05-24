import { useState, useEffect } from 'react';
import { STARTING_COLLECTION, STARTING_CODEX, STARTING_COINS, CARDS, FIXED_OPPONENTS } from './gameData';
import { generateOpponent } from './utils';
import Battle, { buildBattleState } from './screens/Battle';
import Shop from './screens/Shop';
import Collection from './screens/Collection';
import PvP from './screens/PvP';
import Trading from './screens/Trading';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171', blue:'#60a5fa', purple:'#c084fc' };

const SAVE_KEY = 'chaotic-v3';
const PLAYER_ID_KEY = 'chaotic-player-id';

function getPlayerId() {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) { id = 'player_' + Math.random().toString(36).slice(2,10); localStorage.setItem(PLAYER_ID_KEY, id); }
  return id;
}

function buildInitialState() {
  return {
    screen: 'hub', coins: STARTING_COINS,
    collection: { ...STARTING_COLLECTION },
    codex: { ...STARTING_CODEX },
    battle: null,
    highestWave: 0,     // highest fixed opponent beaten (0-based, so 0 means wave 1 unlocked)
    endlessWave: 0,     // current endless wave number (0 = not in endless mode)
    playerName: 'Perim Warrior',
  };
}

function loadState() {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? { ...buildInitialState(), ...JSON.parse(s) } : buildInitialState(); }
  catch { return buildInitialState(); }
}

export default function App() {
  const [gs, setGs] = useState(loadState);
  const [playerId] = useState(getPlayerId);

  useEffect(() => {
    const { battle, ...save } = gs;
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [gs]);

  function nav(screen) { setGs(p => ({ ...p, screen })); }

  const teamSize = Object.values(gs.codex?.team || {}).reduce((s,n)=>s+n,0);
  const teamValid = teamSize >= 1;

  function startBattle(opponentData) {
    if (!teamValid) return;
    const battle = buildBattleState(gs.codex, opponentData);
    if (!battle) return;
    setGs(p => ({ ...p, screen: 'battle', battle }));
  }

  function onUpdateBattle(b) { setGs(p => ({ ...p, battle: b })); }

  function onEndBattle(victory, coinsEarned) {
    setGs(p => {
      const opp = p.battle?.opponentData;
      let highestWave = p.highestWave;
      let endlessWave = p.endlessWave;
      if (victory && opp) {
        if (!opp.generated) {
          const waveIndex = FIXED_OPPONENTS.findIndex(o => o.id === opp.id);
          if (waveIndex !== -1) highestWave = Math.max(highestWave, waveIndex + 1);
        } else {
          endlessWave = Math.max(endlessWave, opp.wave + 1);
        }
      }
      return { ...p, screen:'hub', battle:null, coins: p.coins + (coinsEarned||0), highestWave, endlessWave };
    });
  }

  function onBuyPack(packId, cardIds, cost) {
    setGs(p => {
      const c = { ...p.collection };
      for (const id of cardIds) c[id] = (c[id]||0)+1;
      return { ...p, coins: p.coins - cost, collection: c };
    });
  }

  function onCodexChange(codex) { setGs(p => ({ ...p, codex })); }

  function onTradeComplete(newCollection, coinChange) {
    setGs(p => ({ ...p, collection: newCollection, coins: p.coins + coinChange }));
  }

  function resetAll() { localStorage.removeItem(SAVE_KEY); setGs(buildInitialState()); }

  const { screen, coins, collection, codex, battle, highestWave, endlessWave, playerName } = gs;
  const totalCards = Object.values(collection).reduce((a,b)=>a+b,0);
  const inEndless = highestWave >= FIXED_OPPONENTS.length;
  const currentEndlessWave = endlessWave || (inEndless ? FIXED_OPPONENTS.length + 1 : 0);

  if (screen==='battle'&&battle) return <Battle state={battle} onUpdateBattle={onUpdateBattle} onEndBattle={onEndBattle} />;
  if (screen==='shop') return <Shop coins={coins} onBuyPack={onBuyPack} onClose={()=>nav('hub')} />;
  if (screen==='collection') return <Collection collection={collection} codex={codex} onCodexChange={onCodexChange} onClose={()=>nav('hub')} />;
  if (screen==='pvp') return <PvP playerId={playerId} playerName={playerName} codex={codex} onClose={()=>nav('hub')} onStartPvpBattle={()=>nav('hub')} />;
  if (screen==='trading') return <Trading collection={collection} coins={coins} onTradeComplete={onTradeComplete} onClose={()=>nav('hub')} playerId={playerId} playerName={playerName} />;

  // ── HUB ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text }}>
      {/* Scan-line overlay */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(242,101,34,0.012) 3px,rgba(242,101,34,0.012) 4px)', pointerEvents:'none', zIndex:0 }} />

      <div style={{ position:'relative', zIndex:1 }}>
        {/* Header */}
        <div style={{ borderBottom:`2px solid ${C.orange}`, padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0c0900' }}>
          <div>
            <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:3, marginBottom:2 }}>Digital Battling System</div>
            <div style={{ fontSize:26, fontWeight:'bold', color:C.orange, textTransform:'uppercase', letterSpacing:4, textShadow:`0 0 22px ${C.orange}77` }}>Echoes of Chaos</div>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:1, marginTop:2 }}>Scan · Battle · Conquer · Trade</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:22, fontWeight:'bold', color:C.amber }}>💰 {coins}</div>
            <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{totalCards} cards scanned</div>
          </div>
        </div>

        <div style={{ padding:'18px 22px', maxWidth:920, margin:'0 auto' }}>
          {/* Team status */}
          <div style={{ background:C.panel, border:`1px solid ${teamValid?C.orange+'44':'#3a1a1a'}`, borderRadius:8, padding:'10px 16px', marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:8.5, color:C.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>Battle Codex</div>
              <div style={{ fontSize:13, fontWeight:'bold', color:teamValid?C.orange:'#f87171', textTransform:'uppercase', letterSpacing:0.5 }}>
                {teamValid ? `✓ Ready — ${teamSize} creature${teamSize!==1?'s':''} · ${Object.values(codex?.mugic||{}).reduce((s,n)=>s+n,0)} mugic` : '✗ Add at least 1 creature to your team'}
              </div>
            </div>
            <button onClick={()=>nav('collection')} style={{ background:'transparent', color:C.orange, border:`1px solid ${C.orange}55`, borderRadius:6, padding:'7px 16px', fontSize:10, cursor:'pointer', textTransform:'uppercase', letterSpacing:0.5 }}>Edit Codex</button>
          </div>

          {/* Nav grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:22 }}>
            {[
              { label:'Collection', icon:'📡', desc:`${totalCards} cards. Build your team.`, color:'#3A80C9', action:()=>nav('collection') },
              { label:'Scanner Shop', icon:'⚡', desc:'Open packs from all 6 Chaotic sets.', color:C.orange, action:()=>nav('shop') },
              { label:'PvP Arena', icon:'⚔', desc:'Battle other players online.', color:C.blue, action:()=>nav('pvp') },
              { label:'Trade Post', icon:'🤝', desc:'Trade cards with NPCs and players.', color:C.amber, action:()=>nav('trading') },
            ].map(({ label, icon, desc, color, action }) => (
              <div key={label} onClick={action} style={{ background:C.panel, border:`1px solid ${color}44`, borderRadius:10, padding:'16px 14px', cursor:'pointer', transition:'border-color 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.boxShadow=`0 0 14px ${color}33`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=color+'44';e.currentTarget.style.boxShadow='none';}}>
                <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
                <div style={{ fontWeight:'bold', fontSize:12, color, textTransform:'uppercase', letterSpacing:0.5, marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:9.5, color:C.muted, lineHeight:1.4 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Battle opponents */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:9.5, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>⚔ Story Battles</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {FIXED_OPPONENTS.map((opp, i) => {
                const unlocked = i <= highestWave;
                const beaten = i < highestWave;
                return (
                  <div key={opp.id} onClick={()=>unlocked&&teamValid&&startBattle(opp)} style={{ background:C.panel, border:`1px solid ${unlocked?opp.color+'66':'#14100a'}`, borderRadius:8, padding:'11px 14px', cursor:unlocked&&teamValid?'pointer':'not-allowed', opacity:unlocked?1:0.4, display:'flex', justifyContent:'space-between', alignItems:'center', transition:'box-shadow 0.15s' }}
                    onMouseEnter={e=>{if(unlocked&&teamValid)e.currentTarget.style.boxShadow=`0 0 14px ${opp.color}33`;}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';}}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:5, height:34, borderRadius:3, background:unlocked?opp.color:'#2a1a0a', boxShadow:unlocked?`0 0 6px ${opp.color}`:'none', flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:8.5, color:unlocked?opp.color:C.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:1 }}>Wave {i+1} — {opp.subtitle}</div>
                        <div style={{ fontSize:13, fontWeight:'bold', color:unlocked?C.text:C.muted, textTransform:'uppercase', letterSpacing:0.3 }}>{opp.name}</div>
                        <div style={{ fontSize:8, color:C.muted, marginTop:1 }}>{opp.team.length} creatures · 💰 {opp.reward} reward</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                      {beaten && <span style={{ fontSize:8.5, color:C.green, fontWeight:'bold', textTransform:'uppercase' }}>✓ Beaten</span>}
                      {unlocked&&!beaten && <span style={{ fontSize:8.5, color:C.orange, fontWeight:'bold', textTransform:'uppercase' }}>▶ Challenge</span>}
                      {!unlocked && <span style={{ fontSize:8.5, color:C.muted }}>🔒 Locked</span>}
                      {unlocked&&!teamValid && <span style={{ fontSize:7.5, color:C.red }}>No team</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Endless battle section */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:9.5, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>∞ Endless Battle Generator</div>
            {!inEndless ? (
              <div style={{ background:C.panel, border:'1px solid #1a1020', borderRadius:8, padding:'14px 16px', color:C.muted, fontSize:10 }}>
                🔒 Beat all 7 story battles to unlock Endless Mode. Current progress: {highestWave}/7
              </div>
            ) : (
              <div>
                <div style={{ fontSize:9, color:C.muted, marginBottom:10 }}>Procedurally generated opponents that scale with each wave. Battle endlessly!</div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {[0,1,2].map(offset => {
                    const wave = currentEndlessWave + offset;
                    const opp = generateOpponent(wave);
                    return (
                      <div key={wave} onClick={()=>offset===0&&teamValid&&startBattle(opp)} style={{ background:C.panel, border:`1px solid ${offset===0?opp.color+'55':'#1a1020'}`, borderRadius:8, padding:'11px 14px', cursor:offset===0&&teamValid?'pointer':'default', opacity:offset===0?1:0.5, display:'flex', justifyContent:'space-between', alignItems:'center' }}
                        onMouseEnter={e=>{if(offset===0&&teamValid)e.currentTarget.style.boxShadow=`0 0 14px ${opp.color}33`;}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';}}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:5, height:34, borderRadius:3, background:offset===0?opp.color:'#1a1020', flexShrink:0 }} />
                          <div>
                            <div style={{ fontSize:8.5, color:offset===0?opp.color:C.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:1 }}>Wave {wave} — {opp.subtitle}</div>
                            <div style={{ fontSize:13, fontWeight:'bold', color:C.text }}>{opp.name}</div>
                            <div style={{ fontSize:8, color:C.muted, marginTop:1 }}>{opp.team.length} creatures · 💰 {opp.reward} reward</div>
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          {offset===0 && <span style={{ fontSize:8.5, color:C.orange, fontWeight:'bold', textTransform:'uppercase' }}>▶ Battle Now</span>}
                          {offset>0 && <span style={{ fontSize:8.5, color:C.muted }}>Up next</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button onClick={resetAll} style={{ background:'transparent', color:'#1a1020', border:'none', fontSize:9, cursor:'pointer', letterSpacing:1 }}>Reset all progress</button>
        </div>
      </div>
    </div>
  );
}
