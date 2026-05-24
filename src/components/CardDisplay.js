import { TRIBE_DATA, RARITY_DATA, DISCIPLINE_ICON, DISCIPLINE_COLOR, CARDS } from '../gameData';

export const TRIBE = TRIBE_DATA;

const SET_LABELS = { perim:'Perim', zenith:'Zenith', silent_sands:'Silent Sands', marrillian:"M'arrillian Inv.", dawn:'Dawn of Perim', secrets:'Secrets' };

function MugicNote({ color }) { return <span style={{ color, fontSize: 11 }}>♩</span>; }

export function EnergyBar({ current, max }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = pct > 60 ? '#4ade80' : pct > 30 ? '#fbbf24' : '#f87171';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      <div style={{ flex:1, height:5, background:'#111', borderRadius:3, overflow:'hidden', border:'1px solid #222' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:3, transition:'width 0.3s' }} />
      </div>
      <span style={{ fontSize:9, color:barColor, fontWeight:'bold', minWidth:28, textAlign:'right' }}>{current}/{max}</span>
    </div>
  );
}

// ── CREATURE ──────────────────────────────────────────────────────────────────
function CreatureCard({ card, small, fighter, selected, onClick }) {
  const td = TRIBE_DATA[card.tribe] || TRIBE_DATA.overworld;
  const rd = RARITY_DATA[card.rarity] || RARITY_DATA.common;
  const W = small ? 155 : 215; const H = small ? 218 : 305;
  const artH = small ? 64 : 92; const nameFS = small ? 9 : 11; const statFS = small ? 8 : 9; const atkFS = small ? 7.5 : 9;
  const liveE = fighter?.currentEnergy ?? card.energy; const maxE = fighter?.maxEnergy ?? card.energy;
  return (
    <div onClick={onClick} style={{ width:W, height:H, borderRadius:8, overflow:'hidden', position:'relative', background:td.dark, cursor:onClick?'pointer':'default', flexShrink:0, border:selected?`3px solid #fffde0`:`3px solid ${td.color}`, boxShadow:selected?`0 0 22px #fffde0aa`:`0 0 14px ${td.glow}, inset 0 0 50px rgba(0,0,0,0.9)`, transition:'box-shadow 0.2s', fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${td.color}18 0%,transparent 50%,${td.color}0c 100%)`, pointerEvents:'none' }} />

      {/* Name header */}
      <div style={{ background:`linear-gradient(90deg,${td.dark} 0%,${td.color}cc 35%,${td.color}cc 65%,${td.dark} 100%)`, borderBottom:`2px solid ${td.color}`, padding:small?'3px 6px':'5px 8px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
        <span style={{ color:'#fff', fontWeight:'bold', fontSize:nameFS, textTransform:'uppercase', letterSpacing:0.5, textShadow:`0 0 8px ${td.color}`, maxWidth:'68%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.name}</span>
        <div style={{ display:'flex', gap:1 }}>{Array.from({length:card.mugicCounters||0}).map((_,i)=><MugicNote key={i} color={td.color}/>)}</div>
      </div>

      {/* Art box */}
      <div style={{ height:artH, background:`linear-gradient(180deg,${td.dark}cc 0%,${td.color}25 50%,${td.dark}cc 100%)`, display:'flex', alignItems:'center', justifyContent:'center', borderBottom:`1px solid ${td.color}55`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center,${td.color}20 0%,transparent 70%)` }} />
        <div style={{ fontSize:small?30:46, filter:`drop-shadow(0 0 14px ${td.color})`, zIndex:1 }}>{td.icon}</div>
        <div style={{ position:'absolute', bottom:2, left:5, fontSize:7, color:`${td.color}aa`, textTransform:'uppercase', letterSpacing:0.8 }}>{card.subtype}</div>
        <div style={{ position:'absolute', bottom:2, right:6, fontSize:9, color:'#f87171', fontWeight:'bold' }}>E:{card.energy}</div>
      </div>

      {/* Discipline stats strip */}
      <div style={{ background:'#050505', borderBottom:`1px solid ${td.color}33`, padding:'3px 5px', display:'flex', justifyContent:'space-around' }}>
        {['courage','power','wisdom','speed'].map(d=>{
          const val = fighter?.[d]??card[d];
          return <div key={d} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
            <span style={{ fontSize:6.5, color:DISCIPLINE_COLOR[d], textTransform:'uppercase' }}>{d.slice(0,2)}</span>
            <span style={{ fontSize:statFS, fontWeight:'bold', color:'#ddd' }}>{val}</span>
            <span style={{ fontSize:7 }}>{DISCIPLINE_ICON[d]}</span>
          </div>;
        })}
      </div>

      {/* Live HP bar */}
      {fighter && (
        <div style={{ padding:'2px 6px', borderBottom:`1px solid ${td.color}18` }}>
          <EnergyBar current={liveE} max={maxE} />
          <div style={{ display:'flex', gap:6, marginTop:1 }}>
            {fighter.statusEffects?.burned>0 && <span style={{ fontSize:7, color:'#ef4444' }}>🔥Burn {fighter.statusEffects.burned}</span>}
            {fighter.statusEffects?.confused && <span style={{ fontSize:7, color:'#a78bfa' }}>💫Confused</span>}
            {fighter.statusEffects?.reduceDmg>0 && <span style={{ fontSize:7, color:'#60a5fa' }}>🛡-{fighter.statusEffects.reduceDmg}</span>}
          </div>
        </div>
      )}

      {/* Attacks */}
      <div style={{ overflow:'hidden' }}>
        {(card.attacks||[]).slice(0, small?1:3).map((atk,i)=>(
          <div key={i} style={{ padding:small?'2px 6px':'3px 7px', borderBottom:`1px solid ${td.color}12` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                <span style={{ fontSize:atkFS+2, color:DISCIPLINE_COLOR[atk.disc] }}>{DISCIPLINE_ICON[atk.disc]}</span>
                <span style={{ fontSize:atkFS, color:'#ccc', fontWeight:'600' }}>{atk.name}</span>
              </div>
              <span style={{ fontSize:atkFS+2, fontWeight:'bold', color:'#ff7070' }}>{atk.damage}</span>
            </div>
            {atk.desc&&!small&&<div style={{ fontSize:7, color:'#555', fontStyle:'italic', lineHeight:1.2 }}>{atk.desc}</div>}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:`linear-gradient(90deg,${td.color}55,transparent,${td.color}33)`, borderTop:`1px solid ${td.color}44`, padding:'3px 7px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:7, color:td.color, fontWeight:'bold', textTransform:'uppercase' }}>{td.name}</span>
        <span style={{ fontSize:7, color:rd.color }}>{rd.stars}</span>
        <span style={{ fontSize:7, color:'#444' }}>{SET_LABELS[card.set]||card.set}</span>
      </div>
    </div>
  );
}

// ── BATTLEGEAR ────────────────────────────────────────────────────────────────
function BattlegearCard({ card, small, selected, onClick }) {
  const td = TRIBE_DATA[card.tribe] || TRIBE_DATA.overworld;
  const rd = RARITY_DATA[card.rarity] || RARITY_DATA.common;
  const W = small?155:215; const H = small?185:255;
  return (
    <div onClick={onClick} style={{ width:W, height:H, borderRadius:8, overflow:'hidden', position:'relative', background:td.dark, cursor:onClick?'pointer':'default', flexShrink:0, border:selected?`3px solid #fffde0`:`3px solid ${td.color}77`, boxShadow:selected?`0 0 20px #fffde0aa`:`0 0 10px ${td.glow}55`, fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:`linear-gradient(90deg,${td.dark},${td.color}99,${td.dark})`, borderBottom:`2px solid ${td.color}`, padding:'4px 8px' }}>
        <div style={{ fontSize:7, color:td.color, textTransform:'uppercase', letterSpacing:2 }}>Battlegear</div>
        <div style={{ fontSize:small?9:11, fontWeight:'bold', color:'#fff', textTransform:'uppercase' }}>{card.name}</div>
      </div>
      <div style={{ height:small?52:72, background:`linear-gradient(180deg,${td.dark},${td.color}22)`, display:'flex', alignItems:'center', justifyContent:'center', borderBottom:`1px solid ${td.color}44` }}>
        <div style={{ fontSize:small?24:36, filter:`drop-shadow(0 0 8px ${td.color})` }}>⚙️</div>
      </div>
      <div style={{ padding:'5px 8px' }}>
        {Object.entries(card.bonuses||{}).map(([stat,val])=>(
          <div key={stat} style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
            <span style={{ fontSize:8, color:stat==='energy'?'#f87171':stat==='mugicCounters'?td.color:DISCIPLINE_COLOR[stat]||'#aaa', textTransform:'capitalize' }}>{stat==='mugicCounters'?'♩ Mugic':stat}</span>
            <span style={{ fontSize:9, fontWeight:'bold', color:'#4ade80' }}>+{val}</span>
          </div>
        ))}
        {!small&&card.description&&<div style={{ fontSize:7.5, color:'#777', marginTop:4, lineHeight:1.4, borderTop:`1px solid ${td.color}22`, paddingTop:4 }}>{card.description}</div>}
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:`linear-gradient(90deg,${td.color}44,transparent)`, borderTop:`1px solid ${td.color}33`, padding:'3px 7px', display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:7, color:td.color, textTransform:'uppercase' }}>{td.name}</span>
        <span style={{ fontSize:7, color:rd.color }}>{rd.stars}</span>
      </div>
    </div>
  );
}

// ── MUGIC ─────────────────────────────────────────────────────────────────────
function MugicCard({ card, small, selected, onClick, disabled }) {
  const td = TRIBE_DATA[card.tribe] || TRIBE_DATA.overworld;
  const rd = RARITY_DATA[card.rarity] || RARITY_DATA.common;
  const W = small?155:215; const H = small?185:255;
  return (
    <div onClick={!disabled?onClick:undefined} style={{ width:W, height:H, borderRadius:8, overflow:'hidden', position:'relative', background:td.dark, cursor:onClick&&!disabled?'pointer':'default', flexShrink:0, border:selected?`3px solid #fffde0`:`3px solid ${td.color}77`, boxShadow:selected?`0 0 20px #fffde0aa`:`0 0 10px ${td.glow}55`, opacity:disabled?0.45:1, fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:`linear-gradient(90deg,${td.dark},${td.color}99,${td.dark})`, borderBottom:`2px solid ${td.color}`, padding:'4px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:7, color:td.color, textTransform:'uppercase', letterSpacing:2 }}>Mugic</div>
          <div style={{ fontSize:small?9:11, fontWeight:'bold', color:'#fff', textTransform:'uppercase' }}>{card.name}</div>
        </div>
        <div style={{ display:'flex', gap:1 }}>{Array.from({length:card.cost||0}).map((_,i)=><MugicNote key={i} color={td.color}/>)}</div>
      </div>
      <div style={{ height:small?52:72, background:`linear-gradient(180deg,${td.dark},${td.color}22)`, display:'flex', alignItems:'center', justifyContent:'center', borderBottom:`1px solid ${td.color}44` }}>
        <div style={{ fontSize:small?26:40, filter:`drop-shadow(0 0 10px ${td.color})` }}>♪</div>
      </div>
      <div style={{ padding:'5px 8px' }}>
        <div style={{ fontSize:7.5, color:td.color, marginBottom:3, textTransform:'uppercase', letterSpacing:1 }}>Cost: {card.cost||0} Mugic Counter{card.cost!==1?'s':''}</div>
        <div style={{ fontSize:small?7.5:8.5, color:'#bbb', lineHeight:1.5 }}>{card.description}</div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:`linear-gradient(90deg,${td.color}44,transparent)`, borderTop:`1px solid ${td.color}33`, padding:'3px 7px', display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:7, color:td.color, textTransform:'uppercase' }}>{td.name}</span>
        <span style={{ fontSize:7, color:rd.color }}>{rd.stars}</span>
      </div>
    </div>
  );
}

// ── LOCATION ──────────────────────────────────────────────────────────────────
function LocationCard({ card, small, selected, onClick }) {
  const rd = RARITY_DATA[card.rarity] || RARITY_DATA.common;
  const W = small?155:215; const H = small?185:255;
  const bc = '#8B6914'; const dark = '#0d0900';
  return (
    <div onClick={onClick} style={{ width:W, height:H, borderRadius:8, overflow:'hidden', position:'relative', background:dark, cursor:onClick?'pointer':'default', flexShrink:0, border:selected?`3px solid #fffde0`:`3px solid ${bc}77`, boxShadow:selected?`0 0 20px #fffde0aa`:`0 0 10px rgba(139,105,20,0.4)`, fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:`linear-gradient(90deg,${dark},${bc}cc,${dark})`, borderBottom:`2px solid ${bc}`, padding:'4px 8px' }}>
        <div style={{ fontSize:7, color:'#c8960c', textTransform:'uppercase', letterSpacing:2 }}>Location</div>
        <div style={{ fontSize:small?9:11, fontWeight:'bold', color:'#fff', textTransform:'uppercase' }}>{card.name}</div>
      </div>
      <div style={{ height:small?52:72, background:'linear-gradient(180deg,#0d0900,#2a1c0544)', display:'flex', alignItems:'center', justifyContent:'center', borderBottom:`1px solid ${bc}44` }}>
        <div style={{ fontSize:small?26:40, filter:'drop-shadow(0 0 10px #c8960c)' }}>🌍</div>
      </div>
      <div style={{ padding:'5px 8px' }}>
        <div style={{ fontSize:8, color:'#c8960c', marginBottom:4 }}>Initiative: <span style={{ color:DISCIPLINE_COLOR[card.initiative]||'#aaa', fontWeight:'bold' }}>{(card.initiative||'').toUpperCase()}</span></div>
        {Object.entries(card.allBonuses||{}).map(([s,v])=><div key={s} style={{ fontSize:7.5, color:'#aaa', marginBottom:1 }}>All: <span style={{ color:v>=0?'#4ade80':'#f87171', fontWeight:'bold' }}>{v>=0?'+':''}{v}</span> {s}</div>)}
        {Object.entries(card.tribeBonuses||{}).flatMap(([tribe,bons])=>Object.entries(bons).map(([s,v])=>(
          <div key={tribe+s} style={{ fontSize:7.5, color:TRIBE_DATA[tribe]?.color||'#aaa', marginBottom:1 }}>{TRIBE_DATA[tribe]?.name}: <span style={{ color:v>=0?'#4ade80':'#f87171', fontWeight:'bold' }}>{v>=0?'+':''}{v}</span> {s}</div>
        )))}
        {!small&&card.description&&<div style={{ fontSize:7, color:'#555', fontStyle:'italic', marginTop:4, borderTop:`1px solid ${bc}22`, paddingTop:3, lineHeight:1.3 }}>{card.description}</div>}
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:`linear-gradient(90deg,${bc}44,transparent)`, borderTop:`1px solid ${bc}33`, padding:'3px 7px', display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:7, color:'#c8960c' }}>LOCATION</span>
        <span style={{ fontSize:7, color:rd.color }}>{rd.stars}</span>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CardDisplay({ cardId, small, fighter, selected, onClick, disabled }) {
  const card = CARDS[cardId];
  if (!card) return <div style={{ width:small?155:215, height:small?218:305, background:'#0d0d0d', borderRadius:8, border:'2px solid #222', display:'flex', alignItems:'center', justifyContent:'center', color:'#444', fontSize:10 }}>Unknown Card</div>;
  if (card.cardType==='battlegear') return <BattlegearCard card={card} small={small} selected={selected} onClick={onClick}/>;
  if (card.cardType==='mugic') return <MugicCard card={card} small={small} selected={selected} onClick={onClick} disabled={disabled}/>;
  if (card.cardType==='location') return <LocationCard card={card} small={small} selected={selected} onClick={onClick}/>;
  return <CreatureCard card={card} small={small} fighter={fighter} selected={selected} onClick={onClick}/>;
}
