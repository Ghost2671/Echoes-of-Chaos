import { useState, useMemo } from 'react';
import { CARDS, TRIBE_DATA, RARITY_DATA, MAX_TEAM_SIZE, MAX_MUGIC } from '../gameData';
import CardDisplay from '../components/CardDisplay';

const C={bg:'#07070a',panel:'#0d0d12',orange:'#F26522',amber:'#F5A623',text:'#EDE0CC',muted:'#4a3f5a',green:'#4ade80',red:'#f87171',blue:'#60a5fa',purple:'#c084fc',border:'#1a1625'};

const FILTER_TRIBES=['all','overworld','underworld','mipedian','marrillian','danian'];
const FILTER_TYPES=['all','creature','battlegear','mugic','location'];
const FILTER_RARITIES=['all','common','uncommon','rare','super_rare','ultra_rare'];
const SORT_OPTIONS=['name','rarity','tribe','energy','courage','speed'];

export default function Collection({collection,codex,onUpdateCodex,onClose}) {
  const [tribe,setTribe]=useState('all');
  const [type,setType]=useState('all');
  const [rarity,setRarity]=useState('all');
  const [sort,setSort]=useState('rarity');
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState(null);
  const [tab,setTab]=useState('collection'); // 'collection' | 'codex'

  const ownedIds=useMemo(()=>Object.keys(collection||{}).filter(id=>collection[id]>0),[collection]);

  const filtered=useMemo(()=>{
    return ownedIds
      .map(id=>CARDS[id]).filter(Boolean)
      .filter(c=>{
        if(tribe!=='all'&&c.tribe!==tribe) return false;
        if(type!=='all'&&c.cardType!==type) return false;
        if(rarity!=='all'&&c.rarity!==rarity) return false;
        if(search&&!c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a,b)=>{
        const rarityOrder={common:0,uncommon:1,rare:2,super_rare:3,ultra_rare:4};
        if(sort==='rarity') return rarityOrder[b.rarity]-rarityOrder[a.rarity];
        if(sort==='energy') return (b.energy||0)-(a.energy||0);
        if(sort==='courage') return (b.courage||0)-(a.courage||0);
        if(sort==='speed') return (b.speed||0)-(a.speed||0);
        if(sort==='tribe') return (a.tribe||'z').localeCompare(b.tribe||'z');
        return a.name.localeCompare(b.name);
      });
  },[ownedIds,tribe,type,rarity,search,sort]);

  const teamIds=Object.keys(codex?.team||{});
  const teamCount=teamIds.reduce((s,id)=>s+(codex.team[id]||0),0);
  const mugicIds=Object.keys(codex?.mugic||{});
  const mugicCount=mugicIds.reduce((s,id)=>s+(codex.mugic[id]||0),0);
  const battlegearsInTeam=Object.keys(codex?.battlegear||{});
  const locationId=codex?.location||null;

  function addToTeam(cardId) {
    const card=CARDS[cardId]; if(!card) return;
    if(card.cardType==='creature') {
      if(teamCount>=MAX_TEAM_SIZE) return;
      const cur=codex?.team?.[cardId]||0;
      if(cur>=(collection[cardId]||0)) return;
      onUpdateCodex({...codex,team:{...codex.team,[cardId]:(cur+1)}});
    } else if(card.cardType==='battlegear') {
      const teamCreatures=Object.keys(codex?.team||{}).filter(id=>codex.team[id]>0);
      if(teamCreatures.length===0) return;
      // If this gear is already equipped to a creature, unequip it first
      const newBg={...codex?.battlegear||{}};
      Object.keys(newBg).forEach(k=>{ if(newBg[k]===cardId) delete newBg[k]; });
      // Equip to first creature without gear
      const target=teamCreatures.find(id=>!newBg[id]);
      if(!target) return;
      newBg[target]=cardId;
      onUpdateCodex({...codex,battlegear:newBg});
    } else if(card.cardType==='mugic') {
      if(mugicCount>=MAX_MUGIC) return;
      const cur=codex?.mugic?.[cardId]||0;
      if(cur>=(collection[cardId]||0)) return;
      onUpdateCodex({...codex,mugic:{...codex.mugic,[cardId]:(cur+1)}});
    } else if(card.cardType==='location') {
      onUpdateCodex({...codex,location:cardId});
    }
    setSelected(cardId);
  }

  function removeFromTeam(cardId) {
    const card=CARDS[cardId]; if(!card) return;
    if(card.cardType==='creature') {
      const cur=(codex?.team||{})[cardId]||0;
      const next=Math.max(0,cur-1);
      const newTeam={...codex?.team,[cardId]:next};
      if(next===0) delete newTeam[cardId];
      const newBattlegear={...codex?.battlegear};
      if(next===0) delete newBattlegear[cardId];
      onUpdateCodex({...codex,team:newTeam,battlegear:newBattlegear});
    } else if(card.cardType==='mugic') {
      const cur=(codex?.mugic||{})[cardId]||0;
      const next=Math.max(0,cur-1);
      const newMugic={...codex?.mugic,[cardId]:next};
      if(next===0) delete newMugic[cardId];
      onUpdateCodex({...codex,mugic:newMugic});
    } else if(card.cardType==='battlegear') {
      const newBg={...codex?.battlegear};
      Object.keys(newBg).forEach(k=>{if(newBg[k]===cardId)delete newBg[k];});
      onUpdateCodex({...codex,battlegear:newBg});
    } else if(card.cardType==='location') {
      onUpdateCodex({...codex,location:null});
    }
  }

  function removeBattlegear(creatureId) {
    const newBg={...codex?.battlegear};
    delete newBg[creatureId];
    onUpdateCodex({...codex,battlegear:newBg});
  }

  const sel=selected?CARDS[selected]:null;

  const FilterBtn=({value,current,set,color,label})=>(
    <button onClick={()=>set(value)} style={{padding:'3px 10px',borderRadius:20,border:`1px solid ${current===value?(color||C.orange):'#333'}`,background:current===value?(color||C.orange)+'22':'transparent',color:current===value?(color||C.orange):C.muted,fontSize:8,cursor:'pointer',textTransform:'uppercase',letterSpacing:0.5,transition:'all 0.15s'}}>
      {label||value}
    </button>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      {/* Header */}
      <div style={{borderBottom:`2px solid ${C.orange}`,padding:'10px 18px',background:'#0a0806',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Chaotic Scanner</div>
            <div style={{fontSize:18,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>Card Codex</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div style={{fontSize:9,color:C.muted}}>📦 {ownedIds.length} unique · 🃏 {Object.values(collection||{}).reduce((s,n)=>s+n,0)} total</div>
            <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase',letterSpacing:1}}>← Hub</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:0,marginTop:10}}>
          {['collection','codex'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 20px',borderRadius:'6px 6px 0 0',background:tab===t?C.panel:'transparent',border:`1px solid ${tab===t?C.orange+'55':'transparent'}`,borderBottom:tab===t?'none':'1px solid transparent',color:tab===t?C.orange:C.muted,fontSize:10,cursor:'pointer',fontWeight:tab===t?'bold':'normal',textTransform:'uppercase',letterSpacing:1.5}}>
              {t==='collection'?`📦 Collection (${ownedIds.length})`:`⚔ Codex (${teamCount}/${MAX_TEAM_SIZE})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {tab==='collection'&&(
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Filters */}
            <div style={{padding:'8px 18px',borderBottom:'1px solid #1a1020',background:C.bg,flexShrink:0}}>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:6}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cards…" style={{background:'#111',border:'1px solid #333',borderRadius:6,padding:'5px 10px',color:C.text,fontSize:10,width:160,outline:'none'}}/>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',alignItems:'center'}}>
                  <span style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1}}>Sort:</span>
                  {SORT_OPTIONS.map(s=><FilterBtn key={s} value={s} current={sort} set={setSort} label={s}/>)}
                </div>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                  <FilterBtn value="all" current={tribe} set={setTribe} label="All Tribes"/>
                  {['overworld','underworld','mipedian','marrillian','danian'].map(tr=>(
                    <FilterBtn key={tr} value={tr} current={tribe} set={setTribe} color={TRIBE_DATA[tr]?.color} label={TRIBE_DATA[tr]?.name||tr}/>
                  ))}
                </div>
                <div style={{width:1,height:16,background:'#333'}}/>
                <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                  {FILTER_TYPES.map(t=><FilterBtn key={t} value={t} current={type} set={setType} label={t==='all'?'All Types':t}/>)}
                </div>
                <div style={{width:1,height:16,background:'#333'}}/>
                <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                  <FilterBtn value="all" current={rarity} set={setRarity} label="All Rarity"/>
                  {['common','uncommon','rare','super_rare','ultra_rare'].map(r=>(
                    <FilterBtn key={r} value={r} current={rarity} set={setRarity} color={RARITY_DATA[r]?.color} label={RARITY_DATA[r]?.label||r}/>
                  ))}
                </div>
              </div>
              <div style={{marginTop:4,fontSize:8,color:C.muted}}>Showing {filtered.length} cards</div>
            </div>

            {/* Card grid */}
            <div style={{flex:1,overflowY:'auto',padding:'14px 18px'}}>
              {filtered.length===0?(
                <div style={{textAlign:'center',padding:60,color:C.muted}}>
                  <div style={{fontSize:32,marginBottom:10}}>📦</div>
                  <div style={{fontSize:12}}>No cards match your filters</div>
                </div>
              ):(
                <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
                  {filtered.map(card=>{
                    const count=collection[card.id]||0;
                    const isSel=selected===card.id;
                    const inTeam=card.cardType==='creature'?((codex?.team||{})[card.id]||0):
                      card.cardType==='mugic'?((codex?.mugic||{})[card.id]||0):
                      card.cardType==='location'&&codex?.location===card.id?1:
                      card.cardType==='battlegear'&&Object.values(codex?.battlegear||{}).includes(card.id)?1:0;
                    return (
                      <div key={card.id} style={{position:'relative'}}>
                        <CardDisplay cardId={card.id} selected={isSel} onClick={()=>setSelected(isSel?null:card.id)}/>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:4,gap:4}}>
                          <span style={{fontSize:8,color:C.muted}}>×{count} owned</span>
                          {inTeam>0&&<span style={{fontSize:8,color:C.green,background:'#0a1a0a',border:'1px solid #1a3a1a',borderRadius:3,padding:'0 4px'}}>✓ In Codex {inTeam>1?`×${inTeam}`:''}</span>}
                        </div>
                        {isSel&&(
                          <div style={{display:'flex',gap:4,marginTop:4}}>
                            <button onClick={()=>addToTeam(card.id)} style={{flex:1,background:C.orange,color:'#000',border:'none',borderRadius:5,padding:'5px 0',fontSize:8,cursor:'pointer',fontWeight:'bold',textTransform:'uppercase'}}>
                              {card.cardType==='creature'?`Add (${teamCount}/${MAX_TEAM_SIZE})`:card.cardType==='mugic'?`Add (${mugicCount}/${MAX_MUGIC})`:card.cardType==='battlegear'?'Equip':card.cardType==='location'?'Set Location':'Add'}
                            </button>
                            {inTeam>0&&<button onClick={()=>removeFromTeam(card.id)} style={{flex:1,background:'#1a0a0a',border:'1px solid #f87171',color:C.red,borderRadius:5,padding:'5px 0',fontSize:8,cursor:'pointer',textTransform:'uppercase'}}>Remove</button>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='codex'&&(
          <div style={{flex:1,overflowY:'auto',padding:'16px 18px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {/* Team */}
              <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1625',padding:14,gridColumn:'1/-1'}}>
                <div style={{fontSize:8,color:C.orange,textTransform:'uppercase',letterSpacing:2,marginBottom:12}}>⚔ Battle Team ({teamCount}/{MAX_TEAM_SIZE} Creatures)</div>
                {teamCount===0?(
                  <div style={{color:C.muted,fontSize:10,padding:'20px 0',textAlign:'center'}}>No creatures in codex. Go to Collection and add some!</div>
                ):(
                  <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                    {Object.entries(codex?.team||{}).filter(([,n])=>n>0).flatMap(([id,n])=>Array.from({length:n},(_,i)=>{
                      const bgId=(codex?.battlegear||{})[id];
                      return (
                        <div key={`${id}-${i}`} style={{position:'relative'}}>
                          <CardDisplay cardId={id}/>
                          <div style={{marginTop:4}}>
                            {bgId?(
                              <div style={{display:'flex',gap:3,alignItems:'center',background:'#0a0a0a',borderRadius:4,padding:'2px 6px',border:'1px solid #333'}}>
                                <span style={{fontSize:8,color:C.amber}}>⚙ {CARDS[bgId]?.name}</span>
                                <button onClick={()=>removeBattlegear(id)} style={{background:'none',border:'none',color:C.red,cursor:'pointer',fontSize:9,padding:0}}>×</button>
                              </div>
                            ):(
                              <div style={{fontSize:7.5,color:C.muted,textAlign:'center',padding:'2px 0'}}>No battlegear</div>
                            )}
                            <button onClick={()=>removeFromTeam(id)} style={{width:'100%',background:'#1a0a0a',border:'1px solid #f87171',color:C.red,borderRadius:4,padding:'3px 0',fontSize:8,cursor:'pointer',marginTop:3}}>Remove</button>
                          </div>
                        </div>
                      );
                    }))}
                    {Array.from({length:MAX_TEAM_SIZE-teamCount},(_,i)=>(
                      <div key={`empty-${i}`} style={{width:170,minHeight:220,border:'1px dashed #1a1625',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:C.muted,fontSize:9}}>Empty Slot</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mugic */}
              <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1625',padding:14}}>
                <div style={{fontSize:8,color:C.purple,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>♪ Mugic ({mugicCount}/{MAX_MUGIC})</div>
                {mugicCount===0?(
                  <div style={{color:C.muted,fontSize:9,padding:'10px 0'}}>No mugic cards. Add from Collection.</div>
                ):(
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {Object.entries(codex?.mugic||{}).filter(([,n])=>n>0).flatMap(([id,n])=>Array.from({length:n},(_,i)=>(
                      <div key={`${id}-${i}`}>
                        <CardDisplay cardId={id} small/>
                        <button onClick={()=>removeFromTeam(id)} style={{width:'100%',background:'#1a0a0a',border:'1px solid #f87171',color:C.red,borderRadius:4,padding:'2px 0',fontSize:8,cursor:'pointer',marginTop:3}}>×</button>
                      </div>
                    )))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1625',padding:14}}>
                <div style={{fontSize:8,color:C.blue,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>📍 Location</div>
                {locationId?(
                  <div>
                    <CardDisplay cardId={locationId}/>
                    <button onClick={()=>removeFromTeam(locationId)} style={{width:170,background:'#1a0a0a',border:'1px solid #f87171',color:C.red,borderRadius:4,padding:'3px 0',fontSize:8,cursor:'pointer',marginTop:5}}>Remove</button>
                  </div>
                ):(
                  <div style={{color:C.muted,fontSize:9,padding:'10px 0'}}>No location set. Add from Collection.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
