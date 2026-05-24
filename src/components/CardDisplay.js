import { CARDS, TRIBE_DATA, RARITY_DATA, ELEMENT_DATA, DISCIPLINE_COLOR, DISCIPLINE_ICON, SUBTYPE_ICON } from '../gameData';

const ART_GRADIENTS = {
  warrior_blue:'linear-gradient(160deg,#0a1a3a 0%,#1a3a6a 40%,#0f2a50 100%)',
  muge_green:'linear-gradient(160deg,#0a2010 0%,#1a4020 40%,#0a2a10 100%)',
  sage_blue:'linear-gradient(160deg,#05101a 0%,#0a2040 40%,#050a20 100%)',
  scout_blue:'linear-gradient(160deg,#071428 0%,#0e2a4a 40%,#071428 100%)',
  flyer_blue:'linear-gradient(160deg,#060e28 0%,#0c2050 60%,#060e28 100%)',
  guardian_blue:'linear-gradient(160deg,#0a1828 0%,#1e3a5a 40%,#0a1828 100%)',
  champion_blue:'linear-gradient(160deg,#0a1e40 0%,#183670 40%,#0a1e40 100%)',
  rogue_blue:'linear-gradient(160deg,#06100a 0%,#0d2018 40%,#06100a 100%)',
  inventor_blue:'linear-gradient(160deg,#0a1428 0%,#16284a 40%,#0a1428 100%)',
  soldier_blue:'linear-gradient(160deg,#081428 0%,#122a48 40%,#081428 100%)',
  scholar_blue:'linear-gradient(160deg,#081420 0%,#10283a 40%,#081420 100%)',
  scholar_brown:'linear-gradient(160deg,#180c00 0%,#2a1800 40%,#180c00 100%)',
  warlord_red:'linear-gradient(160deg,#2a0400 0%,#4a0800 40%,#2a0400 100%)',
  warrior_red:'linear-gradient(160deg,#1a0200 0%,#340400 40%,#1a0200 100%)',
  giant_red:'linear-gradient(160deg,#200400 0%,#3a0800 40%,#200400 100%)',
  ghost_red:'linear-gradient(160deg,#100008 0%,#200010 40%,#100008 100%)',
  muge_red:'linear-gradient(160deg,#160002 0%,#2a0006 40%,#160002 100%)',
  spy_red:'linear-gradient(160deg,#0a0002 0%,#1a0004 40%,#0a0002 100%)',
  scientist_red:'linear-gradient(160deg,#180204 0%,#2e0608 40%,#180204 100%)',
  tactician_red:'linear-gradient(160deg,#120200 0%,#220400 40%,#120200 100%)',
  undead_red:'linear-gradient(160deg,#0e0006 0%,#1c000e 40%,#0e0006 100%)',
  fighter_red:'linear-gradient(160deg,#150200 0%,#280400 40%,#150200 100%)',
  scout_red:'linear-gradient(160deg,#0e0100 0%,#1c0200 40%,#0e0100 100%)',
  flyer_red:'linear-gradient(160deg,#100200 0%,#200600 40%,#100200 100%)',
  warrior_gold:'linear-gradient(160deg,#1a0e00 0%,#2e1800 40%,#1a0e00 100%)',
  muge_gold:'linear-gradient(160deg,#140a00 0%,#241400 40%,#140a00 100%)',
  general_gold:'linear-gradient(160deg,#1e1000 0%,#341e00 40%,#1e1000 100%)',
  royalty_gold:'linear-gradient(160deg,#201200 0%,#381e00 40%,#201200 100%)',
  beast_gold:'linear-gradient(160deg,#1c1000 0%,#302000 40%,#1c1000 100%)',
  scout_gold:'linear-gradient(160deg,#100a00 0%,#1e1000 40%,#100a00 100%)',
  dancer_gold:'linear-gradient(160deg,#160c00 0%,#281600 40%,#160c00 100%)',
  caster_gold:'linear-gradient(160deg,#120a00 0%,#201200 40%,#120a00 100%)',
  illusionist_gold:'linear-gradient(160deg,#0e0800 0%,#1a1000 40%,#0e0800 100%)',
  chieftain_teal:'linear-gradient(160deg,#001818 0%,#002828 40%,#001818 100%)',
  warlord_teal:'linear-gradient(160deg,#001a1a 0%,#003030 40%,#001a1a 100%)',
  warrior_teal:'linear-gradient(160deg,#001212 0%,#002020 40%,#001212 100%)',
  muge_teal:'linear-gradient(160deg,#000e0e 0%,#001c1c 40%,#000e0e 100%)',
  colossus_teal:'linear-gradient(160deg,#001616 0%,#002424 40%,#001616 100%)',
  raider_teal:'linear-gradient(160deg,#001010 0%,#001e1e 40%,#001010 100%)',
  archer_teal:'linear-gradient(160deg,#000e10 0%,#001a1e 40%,#000e10 100%)',
  shaman_teal:'linear-gradient(160deg,#000c10 0%,#001620 40%,#000c10 100%)',
  brawler_teal:'linear-gradient(160deg,#001010 0%,#001e1e 40%,#001010 100%)',
  queen_brown:'linear-gradient(160deg,#180e04 0%,#281602 40%,#180e04 100%)',
  champion_brown:'linear-gradient(160deg,#160c02 0%,#241402 40%,#160c02 100%)',
  warrior_brown:'linear-gradient(160deg,#100a00 0%,#1c1200 40%,#100a00 100%)',
  muge_brown:'linear-gradient(160deg,#0e0a02 0%,#1a1202 40%,#0e0a02 100%)',
  scout_brown:'linear-gradient(160deg,#0c0800 0%,#180e00 40%,#0c0800 100%)',
  location_neutral:'linear-gradient(160deg,#0a0a0a 0%,#181818 40%,#0a0a0a 100%)',
  location_blue:'linear-gradient(160deg,#061228 0%,#0d2040 40%,#061228 100%)',
  location_red:'linear-gradient(160deg,#1a0200 0%,#300500 40%,#1a0200 100%)',
  location_gold:'linear-gradient(160deg,#1a0e00 0%,#2e1800 40%,#1a0e00 100%)',
  location_teal:'linear-gradient(160deg,#001414 0%,#002828 40%,#001414 100%)',
  location_brown:'linear-gradient(160deg,#0e0800 0%,#1c1200 40%,#0e0800 100%)',
};

function rarityGlow(rarity) {
  const c={common:'#8a9ab0',uncommon:'#4ade80',rare:'#3b82f6',super_rare:'#a855f7',ultra_rare:'#f59e0b'};
  return c[rarity]||'#444';
}
function rarityLabel(rarity) {
  const l={common:'C',uncommon:'U',rare:'R',super_rare:'SR',ultra_rare:'UR'};
  return l[rarity]||rarity;
}

export function EnergyBar({current,max,height=6,showText=true}) {
  const pct=max>0?Math.max(0,Math.min(1,current/max)):0;
  const barColor=pct>0.6?'#4ade80':pct>0.3?'#f59e0b':'#ef4444';
  return (
    <div>
      <div style={{background:'#111',borderRadius:3,height,overflow:'hidden',marginBottom:showText?2:0}}>
        <div style={{width:`${pct*100}%`,height:'100%',background:barColor,transition:'width 0.3s ease',borderRadius:3}}/>
      </div>
      {showText&&<div style={{fontSize:8,color:barColor,fontWeight:'bold'}}>{current}/{max} EP</div>}
    </div>
  );
}

function StatPill({icon,color,value}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:2,background:'#0a0a0a',borderRadius:4,padding:'2px 5px',border:`1px solid ${color}33`}}>
      <span style={{fontSize:8,color}}>{icon}</span>
      <span style={{fontSize:9,color,fontWeight:'bold'}}>{value}</span>
    </div>
  );
}

function ElementBadge({element}) {
  if(!element||element==='none') return null;
  const ed=ELEMENT_DATA[element]; if(!ed) return null;
  return (
    <span style={{fontSize:7,background:ed.bg,color:ed.color,padding:'1px 4px',borderRadius:3,border:`1px solid ${ed.color}66`,marginRight:2}}>
      {ed.icon} {ed.label}
    </span>
  );
}

export default function CardDisplay({cardId,small=false,fighter=null,selected=false,onClick=null,dimmed=false}) {
  const card=CARDS[cardId]; if(!card) return null;
  const td=TRIBE_DATA[card.tribe]||{};
  const rd=RARITY_DATA[card.rarity]||RARITY_DATA.common;
  const glowColor=rarityGlow(card.rarity);
  const artBg=ART_GRADIENTS[card.artPattern]||ART_GRADIENTS.warrior_blue;
  const subtypeIcon=SUBTYPE_ICON[card.subtype]||'⚡';
  const W=small?130:170;
  const artH=small?60:90;
  const isKO=fighter&&fighter.currentEnergy<=0;
  const borderColor=selected?'#fff':isKO?'#333':glowColor;
  const boxShadow=selected?`0 0 0 2px #fff,0 0 20px ${glowColor}66`:isKO?'none':`0 0 8px ${glowColor}22`;

  const cardStyle={
    width:W,background:'#0d0d10',border:`1px solid ${borderColor}`,borderRadius:10,
    overflow:'hidden',cursor:onClick?'pointer':'default',
    opacity:dimmed||isKO?0.45:1,boxShadow,
    transition:'box-shadow 0.2s,border-color 0.2s,opacity 0.3s',
    flexShrink:0,position:'relative',
  };

  const artSection=(
    <div style={{height:artH,background:artBg,position:'relative',overflow:'hidden',borderBottom:`1px solid ${td.color||glowColor}44`}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:td.color||glowColor,opacity:0.8}}/>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontSize:small?28:42,filter:`drop-shadow(0 0 8px ${td.color||'#fff'}88)`,userSelect:'none'}}>{subtypeIcon}</div>
      </div>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at center,${td.color||glowColor}11 0%,transparent 70%)`,pointerEvents:'none'}}/>
      {!small&&card.elements&&(
        <div style={{position:'absolute',bottom:4,left:4,display:'flex',flexWrap:'wrap',gap:2}}>
          {card.elements.filter(e=>e!=='none').map(el=><ElementBadge key={el} element={el}/>)}
        </div>
      )}
      <div style={{position:'absolute',top:6,right:6,background:rd.color+'22',border:`1px solid ${rd.color}`,color:rd.color,fontSize:7,fontWeight:'bold',padding:'1px 4px',borderRadius:3}}>
        {rarityLabel(card.rarity)}
      </div>
      {isKO&&(
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#ef4444',fontWeight:'bold'}}>
          KO
        </div>
      )}
    </div>
  );

  const headerSection=(
    <div style={{padding:small?'4px 6px 2px':'6px 8px 3px',borderBottom:`1px solid ${td.color||'#222'}22`}}>
      <div style={{fontSize:small?9:10,fontWeight:'bold',color:'#eee',textTransform:'uppercase',letterSpacing:0.3,lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        {card.name}
      </div>
      {!small&&(
        <div style={{fontSize:8,color:td.color||'#888',textTransform:'uppercase',letterSpacing:0.5}}>
          {card.tribe?(TRIBE_DATA[card.tribe]?.name||card.tribe):''}{card.subtype?` · ${card.subtype}`:''}
        </div>
      )}
    </div>
  );

  if(card.cardType==='creature') {
    const energySection=fighter?(
      <div style={{padding:'4px 8px 2px'}}>
        <EnergyBar current={fighter.currentEnergy} max={fighter.maxEnergy}/>
        <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:2}}>
          {fighter.statusEffects?.burned>0&&<span style={{fontSize:7,color:'#ef4444'}}>🔥Burn {fighter.statusEffects.burned}</span>}
          {fighter.statusEffects?.confused&&<span style={{fontSize:7,color:'#a855f7'}}>💫Confused</span>}
          {fighter.statusEffects?.reduceDmg>0&&<span style={{fontSize:7,color:'#22d3ee'}}>🛡-{fighter.statusEffects.reduceDmg}</span>}
        </div>
        {(fighter.mugicCounters>0||fighter.maxMugicCounters>0)&&(
          <div style={{fontSize:7,color:'#c084fc',marginTop:1}}>
            {'♪'.repeat(Math.max(0,fighter.mugicCounters))}{'○'.repeat(Math.max(0,(fighter.maxMugicCounters||0)-fighter.mugicCounters))} MC
          </div>
        )}
      </div>
    ):null;

    const statsSection=!small?(
      <div style={{padding:'3px 8px 4px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 4px'}}>
        <StatPill icon={DISCIPLINE_ICON.courage} color={DISCIPLINE_COLOR.courage} value={fighter?.courage??card.courage}/>
        <StatPill icon={DISCIPLINE_ICON.power}   color={DISCIPLINE_COLOR.power}   value={fighter?.power??card.power}/>
        <StatPill icon={DISCIPLINE_ICON.wisdom}  color={DISCIPLINE_COLOR.wisdom}  value={fighter?.wisdom??card.wisdom}/>
        <StatPill icon={DISCIPLINE_ICON.speed}   color={DISCIPLINE_COLOR.speed}   value={fighter?.speed??card.speed}/>
        <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'space-between',marginTop:1}}>
          <span style={{fontSize:8,color:'#4ade80',fontWeight:'bold'}}>⚡ {fighter?.currentEnergy??card.energy} EP</span>
          {(fighter?.mugicCounters??card.mugicCounters)>0&&<span style={{fontSize:8,color:'#c084fc'}}>♪×{fighter?.mugicCounters??card.mugicCounters}</span>}
        </div>
      </div>
    ):(
      <div style={{padding:'3px 6px 4px',display:'flex',gap:4,flexWrap:'wrap'}}>
        <span style={{fontSize:7.5,color:'#4ade80'}}>⚡{fighter?.currentEnergy??card.energy}</span>
        <span style={{fontSize:7.5,color:DISCIPLINE_COLOR.courage}}>⚔{fighter?.courage??card.courage}</span>
        <span style={{fontSize:7.5,color:DISCIPLINE_COLOR.power}}>💪{fighter?.power??card.power}</span>
        <span style={{fontSize:7.5,color:DISCIPLINE_COLOR.speed}}>⚡{fighter?.speed??card.speed}</span>
      </div>
    );

    return <div style={cardStyle} onClick={onClick}>{artSection}{headerSection}{energySection}{statsSection}</div>;
  }

  if(card.cardType==='battlegear') {
    return (
      <div style={cardStyle} onClick={onClick}>
        <div style={{height:artH*0.7,background:'linear-gradient(135deg,#0a0a14 0%,#151520 100%)',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:`1px solid ${glowColor}33`,position:'relative'}}>
          <div style={{fontSize:small?22:32,userSelect:'none'}}>⚙️</div>
          <div style={{position:'absolute',top:4,right:6,background:rd.color+'22',border:`1px solid ${rd.color}`,color:rd.color,fontSize:7,fontWeight:'bold',padding:'1px 4px',borderRadius:3}}>{rarityLabel(card.rarity)}</div>
        </div>
        {headerSection}
        {!small&&(
          <div style={{padding:'3px 8px 6px'}}>
            <div style={{fontSize:7.5,color:'#4a9ab0',marginBottom:3}}>BATTLEGEAR{card.tribe?` · ${(TRIBE_DATA[card.tribe]?.name||card.tribe).toUpperCase()}`:''}</div>
            {Object.entries(card.bonuses||{}).map(([k,v])=>(
              <div key={k} style={{fontSize:8,color:DISCIPLINE_COLOR[k]||'#4ade80',marginBottom:1}}>+{v} {k.charAt(0).toUpperCase()+k.slice(1)}</div>
            ))}
            {card.effectLabel&&<div style={{fontSize:7.5,color:'#f59e0b',marginTop:3,fontStyle:'italic'}}>{card.effectLabel}</div>}
          </div>
        )}
      </div>
    );
  }

  if(card.cardType==='mugic') {
    const tribeColor=card.tribe?(TRIBE_DATA[card.tribe]?.color||'#c084fc'):'#c084fc';
    return (
      <div style={cardStyle} onClick={onClick}>
        <div style={{height:artH*0.7,background:'linear-gradient(135deg,#0a001a 0%,#150028 100%)',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:`1px solid ${tribeColor}44`,position:'relative'}}>
          <div style={{fontSize:small?22:32,filter:`drop-shadow(0 0 8px ${tribeColor}88)`,userSelect:'none'}}>🎵</div>
          <div style={{position:'absolute',top:4,right:6,background:rd.color+'22',border:`1px solid ${rd.color}`,color:rd.color,fontSize:7,fontWeight:'bold',padding:'1px 4px',borderRadius:3}}>{rarityLabel(card.rarity)}</div>
          {card.cost!==undefined&&<div style={{position:'absolute',top:4,left:6,background:'#c084fc22',border:'1px solid #c084fc',color:'#c084fc',fontSize:8,fontWeight:'bold',padding:'1px 5px',borderRadius:3}}>♪×{card.cost}</div>}
        </div>
        {headerSection}
        {!small&&(
          <div style={{padding:'3px 8px 6px'}}>
            <div style={{fontSize:7.5,color:tribeColor,marginBottom:3}}>MUGIC{card.restriction?` · ${(TRIBE_DATA[card.restriction]?.name||card.restriction).toUpperCase()}` : ' · ANY TRIBE'}</div>
            {card.effectLabel&&<div style={{fontSize:8,color:'#c084fc',fontStyle:'italic'}}>{card.effectLabel}</div>}
          </div>
        )}
      </div>
    );
  }

  if(card.cardType==='location') {
    return (
      <div style={cardStyle} onClick={onClick}>
        <div style={{height:artH*0.7,background:ART_GRADIENTS[card.artPattern]||ART_GRADIENTS.location_neutral,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #ffffff22',position:'relative'}}>
          <div style={{fontSize:small?22:32,userSelect:'none'}}>🌍</div>
          <div style={{position:'absolute',top:4,right:6,background:rd.color+'22',border:`1px solid ${rd.color}`,color:rd.color,fontSize:7,fontWeight:'bold',padding:'1px 4px',borderRadius:3}}>{rarityLabel(card.rarity)}</div>
        </div>
        {headerSection}
        {!small&&(
          <div style={{padding:'3px 8px 6px'}}>
            <div style={{fontSize:7.5,color:'#60a5fa',marginBottom:3}}>LOCATION · INIT: {(card.initiative||'speed').toUpperCase()}</div>
            <div style={{fontSize:8,color:'#aaa',lineHeight:1.4}}>{card.description}</div>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function CardPill({cardId,count}) {
  const card=CARDS[cardId]; if(!card) return null;
  const td=TRIBE_DATA[card.tribe]||{};
  const rc=rarityGlow(card.rarity);
  return (
    <div style={{display:'flex',alignItems:'center',gap:5,background:'#0d0d10',border:`1px solid ${rc}44`,borderRadius:6,padding:'3px 8px',fontSize:9,color:'#ccc'}}>
      <span style={{color:td.color||rc}}>{SUBTYPE_ICON[card.subtype]||'⚡'}</span>
      <span style={{fontWeight:'bold',color:'#eee'}}>{card.name}</span>
      {count>1&&<span style={{color:'#888'}}>×{count}</span>}
    </div>
  );
}
