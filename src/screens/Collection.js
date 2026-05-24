import { useState, useMemo } from 'react';
import { CARDS, TRIBE_DATA, RARITY_DATA, MAX_TEAM_SIZE, MAX_MUGIC } from '../gameData';
import CardDisplay from '../components/CardDisplay';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171' };

const TABS = [
  { id:'creatures', label:'Creatures', icon:'⚔' },
  { id:'battlegear', label:'Battlegear', icon:'⚙' },
  { id:'mugic', label:'Mugic', icon:'♪' },
  { id:'locations', label:'Locations', icon:'🌍' },
  { id:'team', label:'My Team', icon:'👥' },
];

const TRIBES = ['all', 'overworld', 'underworld', 'mipedian', 'marrillian', 'danian'];
const RARITIES = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function Collection({ collection, codex, onCodexChange, onClose }) {
  const [tab, setTab] = useState('creatures');
  const [search, setSearch] = useState('');
  const [filterTribe, setFilterTribe] = useState('all');
  const [filterRarity, setFilterRarity] = useState('all');
  const [selectedBgCreature, setSelectedBgCreature] = useState(null);

  const team = codex?.team || {};
  const battlegear = codex?.battlegear || {};
  const mugic = codex?.mugic || {};

  const teamCreatures = Object.entries(team).flatMap(([id,n])=>Array(n).fill(id));
  const mugicCards = Object.entries(mugic).flatMap(([id,n])=>Array(n).fill(id));
  const teamSize = teamCreatures.length;
  const mugicCount = mugicCards.length;

  // Collect all cards in collection by type
  const byType = useMemo(() => {
    const res = { creatures:[], battlegear:[], mugic:[], locations:[] };
    for (const [id, count] of Object.entries(collection)) {
      const c = CARDS[id]; if (!c || !count) continue;
      const key = c.cardType === 'creature' ? 'creatures' : c.cardType === 'battlegear' ? 'battlegear' : c.cardType === 'mugic' ? 'mugic' : c.cardType === 'location' ? 'locations' : null;
      if (key) res[key].push({ id, count, card:c });
    }
    for (const k of Object.keys(res)) res[k].sort((a,b)=>{ const ro={legendary:5,epic:4,rare:3,uncommon:2,common:1}; return (ro[b.card.rarity]||0)-(ro[a.card.rarity]||0); });
    return res;
  }, [collection]);

  function filtered(list) {
    return list.filter(({ id, card }) => {
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTribe !== 'all' && card.tribe !== filterTribe) return false;
      if (filterRarity !== 'all' && card.rarity !== filterRarity) return false;
      return true;
    });
  }

  // Team actions
  function addToTeam(id) {
    if (teamSize >= MAX_TEAM_SIZE) return;
    const cur = team[id] || 0;
    const inColl = collection[id] || 0;
    if (cur >= inColl) return;
    onCodexChange({ ...codex, team: { ...team, [id]: cur + 1 } });
  }
  function removeFromTeam(id) {
    const cur = team[id] || 0;
    if (cur <= 0) return;
    const newTeam = { ...team, [id]: cur - 1 };
    if (newTeam[id] === 0) delete newTeam[id];
    const newBg = { ...battlegear };
    if (newTeam[id] === undefined) delete newBg[id];
    onCodexChange({ ...codex, team: newTeam, battlegear: newBg });
  }
  function assignBattlegear(creatureId, bgId) {
    if (!team[creatureId]) return;
    if (!bgId) {
      const nb = { ...battlegear }; delete nb[creatureId];
      onCodexChange({ ...codex, battlegear: nb });
    } else {
      onCodexChange({ ...codex, battlegear: { ...battlegear, [creatureId]: bgId } });
    }
  }
  function addMugic(id) {
    if (mugicCount >= MAX_MUGIC) return;
    const cur = mugic[id] || 0;
    if (cur >= (collection[id]||0)) return;
    onCodexChange({ ...codex, mugic: { ...mugic, [id]: cur + 1 } });
  }
  function removeMugic(id) {
    const cur = mugic[id] || 0;
    if (cur <= 0) return;
    const nm = { ...mugic, [id]: cur - 1 };
    if (nm[id] === 0) delete nm[id];
    onCodexChange({ ...codex, mugic: nm });
  }

  const myBgCards = byType.battlegear;

  const Pill = ({ label, active, onClick, color }) => (
    <button onClick={onClick} style={{ padding:'3px 10px', borderRadius:12, border:`1px solid ${active?(color||C.orange):'#2a2030'}`, background:active?(color||C.orange)+'22':'transparent', color:active?(color||C.orange):'#555', fontSize:8.5, cursor:'pointer', textTransform:'capitalize' }}>{label}</button>
  );

  const TribePill = ({ t }) => {
    const td = TRIBE_DATA[t];
    return <Pill label={td?.name||t} active={filterTribe===t} onClick={()=>setFilterTribe(t)} color={td?.color} />;
  };

  const RarityPill = ({ r }) => {
    const rd = RARITY_DATA[r];
    return <Pill label={rd?.label||r} active={filterRarity===r} onClick={()=>setFilterRarity(r)} color={rd?.color} />;
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ borderBottom:`2px solid ${C.orange}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0c0a10', flexShrink:0 }}>
        <div>
          <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>Codex Archive</div>
          <div style={{ fontSize:18, fontWeight:'bold', color:C.orange, textTransform:'uppercase', letterSpacing:3 }}>My Collection</div>
          <div style={{ fontSize:8.5, color:C.muted, marginTop:2 }}>Team: {teamSize}/{MAX_TEAM_SIZE} · Mugic: {mugicCount}/{MAX_MUGIC}</div>
        </div>
        <button onClick={onClose} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'7px 16px', cursor:'pointer', fontSize:10, textTransform:'uppercase' }}>← Hub</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:`1px solid #1a1020`, flexShrink:0, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 18px', background:tab===t.id?'#1a0d2a':'transparent', borderBottom:tab===t.id?`2px solid ${C.orange}`:'2px solid transparent', color:tab===t.id?C.orange:C.muted, fontSize:10, cursor:'pointer', border:'none', borderBottom:tab===t.id?`2px solid ${C.orange}`:'2px solid transparent', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* Team builder tab */}
        {tab === 'team' && (
          <div style={{ flex:1, overflowY:'auto', padding:16 }}>
            <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>Your Battle Team ({teamSize}/{MAX_TEAM_SIZE} creatures · {mugicCount}/{MAX_MUGIC} mugic)</div>

            {/* Creature slots */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:9, color:C.orange, marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>⚔ Team Creatures</div>
              {teamSize === 0 && <div style={{ color:C.muted, fontSize:10, padding:'20px 0' }}>No creatures in team. Go to the Creatures tab to add some.</div>}
              {Object.entries(team).filter(([,n])=>n>0).flatMap(([id,n])=>Array(n).fill(id).map((cid,ci)=>(
                <div key={cid+ci} style={{ background:C.panel, border:`1px solid #1a1020`, borderRadius:8, padding:10, marginBottom:8, display:'flex', gap:10, alignItems:'flex-start' }}>
                  <CardDisplay cardId={cid} small />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:'bold', color:C.text, marginBottom:6 }}>{CARDS[cid]?.name}</div>
                    {/* Battlegear assignment */}
                    <div style={{ marginBottom:6 }}>
                      <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>BATTLEGEAR:</div>
                      {ci === 0 && ( // Only allow battlegear assignment for first copy
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                          <button onClick={()=>assignBattlegear(cid,null)} style={{ padding:'3px 8px', borderRadius:4, border:`1px solid ${!battlegear[cid]?C.orange:'#2a1a0a'}`, background:!battlegear[cid]?C.orange+'22':'transparent', color:!battlegear[cid]?C.orange:'#555', fontSize:8, cursor:'pointer' }}>None</button>
                          {myBgCards.filter(({card,count})=>count>0 && (!card.tribe||card.tribe===CARDS[cid]?.tribe||true)).map(({id:bgid,card:bgc})=>(
                            <button key={bgid} onClick={()=>assignBattlegear(cid,bgid)} style={{ padding:'3px 8px', borderRadius:4, border:`1px solid ${battlegear[cid]===bgid?C.orange:'#2a1a2a'}`, background:battlegear[cid]===bgid?C.orange+'22':'transparent', color:battlegear[cid]===bgid?C.orange:'#888', fontSize:8, cursor:'pointer' }}>
                              {bgc.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={()=>removeFromTeam(cid)} style={{ padding:'4px 10px', borderRadius:4, border:`1px solid ${C.red}66`, background:'transparent', color:C.red, fontSize:8.5, cursor:'pointer' }}>Remove from team</button>
                  </div>
                </div>
              )))}
            </div>

            {/* Mugic selection */}
            <div>
              <div style={{ fontSize:9, color:'#c084fc', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>♪ Mugic Spells ({mugicCount}/{MAX_MUGIC})</div>
              {mugicCount === 0 && <div style={{ color:C.muted, fontSize:10, marginBottom:8 }}>No mugic selected. Go to the Mugic tab to add spell cards.</div>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {Object.entries(mugic).filter(([,n])=>n>0).flatMap(([id,n])=>Array(n).fill(id).map((mid,mi)=>(
                  <div key={mid+mi} style={{ position:'relative' }}>
                    <CardDisplay cardId={mid} small />
                    <button onClick={()=>removeMugic(mid)} style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'#f87171', border:'none', color:'#000', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
                  </div>
                )))}
              </div>
            </div>
          </div>
        )}

        {/* Card browser tabs */}
        {tab !== 'team' && (
          <>
            {/* Filters */}
            <div style={{ padding:'8px 16px', borderBottom:'1px solid #12101a', background:'#090810', flexShrink:0 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cards..." style={{ background:'#0d0b14', border:'1px solid #2a2030', borderRadius:6, padding:'5px 10px', color:C.text, fontSize:10, marginBottom:6, width:'100%', boxSizing:'border-box' }} />
              {tab !== 'locations' && (
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:4 }}>
                  <Pill label="All Tribes" active={filterTribe==='all'} onClick={()=>setFilterTribe('all')} />
                  {TRIBES.filter(t=>t!=='all').map(t=><TribePill key={t} t={t}/>)}
                </div>
              )}
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                <Pill label="All Rarities" active={filterRarity==='all'} onClick={()=>setFilterRarity('all')} />
                {RARITIES.filter(r=>r!=='all').map(r=><RarityPill key={r} r={r}/>)}
              </div>
            </div>

            {/* Card grid */}
            <div style={{ flex:1, overflowY:'auto', padding:12 }}>
              {tab === 'creatures' && (
                <>
                  <div style={{ fontSize:8.5, color:C.muted, marginBottom:10 }}>Click a card to add it to your team</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {filtered(byType.creatures).map(({ id, count, card }) => {
                      const inTeam = team[id] || 0;
                      const canAdd = teamSize < MAX_TEAM_SIZE && inTeam < count;
                      return (
                        <div key={id} style={{ position:'relative' }}>
                          <CardDisplay cardId={id} small selected={inTeam>0} onClick={canAdd?()=>addToTeam(id):undefined} />
                          <div style={{ position:'absolute', top:2, left:2, background:'#000c', borderRadius:4, padding:'2px 5px', fontSize:8, color:C.amber }}>×{count}</div>
                          {inTeam > 0 && (
                            <div style={{ position:'absolute', bottom:18, left:0, right:0, display:'flex', justifyContent:'center', gap:4 }}>
                              <button onClick={()=>removeFromTeam(id)} style={{ background:'#f87171', border:'none', borderRadius:4, padding:'2px 6px', fontSize:9, cursor:'pointer', color:'#000' }}>-</button>
                              <span style={{ background:'#000a', borderRadius:4, padding:'2px 6px', fontSize:9, color:C.green }}>In team: {inTeam}</span>
                              {canAdd && <button onClick={()=>addToTeam(id)} style={{ background:C.orange, border:'none', borderRadius:4, padding:'2px 6px', fontSize:9, cursor:'pointer', color:'#000' }}>+</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filtered(byType.creatures).length === 0 && <div style={{ color:C.muted, fontSize:11 }}>No creatures found.</div>}
                  </div>
                </>
              )}

              {tab === 'battlegear' && (
                <>
                  <div style={{ fontSize:8.5, color:C.muted, marginBottom:10 }}>Assign battlegear to your creatures in the Team tab</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {filtered(byType.battlegear).map(({ id, count }) => (
                      <div key={id} style={{ position:'relative' }}>
                        <CardDisplay cardId={id} small />
                        <div style={{ position:'absolute', top:2, left:2, background:'#000c', borderRadius:4, padding:'2px 5px', fontSize:8, color:C.amber }}>×{count}</div>
                      </div>
                    ))}
                    {filtered(byType.battlegear).length === 0 && <div style={{ color:C.muted, fontSize:11 }}>No battlegear found.</div>}
                  </div>
                </>
              )}

              {tab === 'mugic' && (
                <>
                  <div style={{ fontSize:8.5, color:C.muted, marginBottom:10 }}>Click a card to add it to your Mugic spell book ({mugicCount}/{MAX_MUGIC})</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {filtered(byType.mugic).map(({ id, count }) => {
                      const inMugic = mugic[id] || 0;
                      const canAdd = mugicCount < MAX_MUGIC && inMugic < count;
                      return (
                        <div key={id} style={{ position:'relative' }}>
                          <CardDisplay cardId={id} small selected={inMugic>0} onClick={canAdd?()=>addMugic(id):undefined} />
                          <div style={{ position:'absolute', top:2, left:2, background:'#000c', borderRadius:4, padding:'2px 5px', fontSize:8, color:C.amber }}>×{count}</div>
                          {inMugic > 0 && (
                            <div style={{ position:'absolute', bottom:18, left:0, right:0, display:'flex', justifyContent:'center', gap:4 }}>
                              <button onClick={()=>removeMugic(id)} style={{ background:'#f87171', border:'none', borderRadius:4, padding:'2px 6px', fontSize:9, cursor:'pointer', color:'#000' }}>-</button>
                              <span style={{ background:'#000a', borderRadius:4, padding:'2px 6px', fontSize:9, color:'#c084fc' }}>{inMugic} selected</span>
                              {canAdd && <button onClick={()=>addMugic(id)} style={{ background:'#c084fc', border:'none', borderRadius:4, padding:'2px 6px', fontSize:9, cursor:'pointer', color:'#000' }}>+</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filtered(byType.mugic).length === 0 && <div style={{ color:C.muted, fontSize:11 }}>No mugic found.</div>}
                  </div>
                </>
              )}

              {tab === 'locations' && (
                <>
                  <div style={{ fontSize:8.5, color:C.muted, marginBottom:10 }}>Locations are randomly selected each battle</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {filtered(byType.locations).map(({ id, count }) => (
                      <div key={id} style={{ position:'relative' }}>
                        <CardDisplay cardId={id} small />
                        <div style={{ position:'absolute', top:2, left:2, background:'#000c', borderRadius:4, padding:'2px 5px', fontSize:8, color:C.amber }}>×{count}</div>
                      </div>
                    ))}
                    {filtered(byType.locations).length === 0 && <div style={{ color:C.muted, fontSize:11 }}>No locations found.</div>}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
