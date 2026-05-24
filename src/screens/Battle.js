import { useState, useEffect, useRef } from 'react';
import { CARDS, TRIBE_DATA, DISCIPLINE_COLOR, DISCIPLINE_ICON, ELEMENT_DATA } from '../gameData';
import { disciplineCheck, calcAttackDamage, makeFighter, applyLocation } from '../utils';
import CardDisplay, { EnergyBar } from '../components/CardDisplay';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171', blue:'#60a5fa', purple:'#c084fc' };

export function buildBattleState(codex, opponentData) {
  const locationId = opponentData.location || 'plen_o_chao';
  const locationCard = CARDS[locationId];

  const playerTeam = Object.entries(codex?.team || {}).flatMap(([id, count]) => {
    const bgId = (codex?.battlegear || {})[id] || null;
    const f = makeFighter(id, bgId);
    if (!f) return [];
    return Array.from({ length: Math.max(1, count) }, () => applyLocation({ ...f }, locationCard));
  }).slice(0, 6);

  if (playerTeam.length === 0) return null;

  const oppTeam = (opponentData.team || []).map(f => applyLocation({
    cardId: f.cardId, battlegearId: f.battlegearId || null,
    currentEnergy: f.currentEnergy, maxEnergy: f.maxEnergy,
    mugicCounters: f.mugicCounters || 0, maxMugicCounters: f.mugicCounters || 0,
    courage: f.courage, power: f.power, wisdom: f.wisdom, speed: f.speed,
    statusEffects: { burned: 0, confused: false, reduceDmg: 0 },
  }, locationCard)).slice(0, 6);

  const playerMugic = Object.entries(codex?.mugic || {}).flatMap(([id, n]) => Array(Math.max(0, n)).fill(id));
  const loc = locationCard;
  const locDesc = loc?.description || '';

  return {
    opponentData,
    locationId,
    player:   { team: playerTeam, activeIdx: 0, mugicHand: playerMugic, mugicDiscard: [], hasAttacked: false, hasCastMugic: false, turnBoosts: {} },
    opponent: { team: oppTeam,    activeIdx: 0, mugicHand: [...(opponentData.mugic || [])], mugicDiscard: [], hasAttacked: false, hasCastMugic: false, turnBoosts: {} },
    turn: 'player', turnNumber: 1, gameOver: false, winner: null, coinsEarned: 0,
    negateNext: false,
    log: [`⚔ BATTLE BEGINS — ${opponentData.name}!`, `📍 ${loc?.name || 'Unknown Location'}${locDesc ? ` — ${locDesc}` : ''}`],
  };
}

function checkLabel(r) {
  if (r.won)  return `✅ WIN (${r.atkBase}+${r.atkRoll}=${r.atkTotal} vs ${r.defBase}+${r.defRoll}=${r.defTotal}, +${Math.floor(r.overflow/5)} dmg)`;
  if (r.tie)  return `🤝 TIE (${r.atkTotal} vs ${r.defTotal}, half dmg)`;
  return `❌ MISS (${r.atkTotal} vs ${r.defTotal}, no dmg)`;
}

function applyAttackEffect(effect, s, targetSide) {
  if (!effect) return s;
  const otherSide = targetSide === 'player' ? 'opponent' : 'player';
  const selfSide  = targetSide;

  const modActive = (side, fn) => {
    const team=[...s[side].team]; const i=s[side].activeIdx;
    team[i]=fn({...team[i]}); return {...s,[side]:{...s[side],team}};
  };
  const modAllAlive = (side, fn) => {
    const team=s[side].team.map((f,i)=>f.currentEnergy>0?fn({...f}):f);
    return {...s,[side]:{...s[side],team}};
  };

  if (effect==='burn_5')       return modActive(targetSide,f=>({...f,statusEffects:{...f.statusEffects,burned:Math.max(f.statusEffects.burned,5)}}));
  if (effect==='burn_10')      return modActive(targetSide,f=>({...f,statusEffects:{...f.statusEffects,burned:Math.max(f.statusEffects.burned,10)}}));
  if (effect==='burn_15')      return modActive(targetSide,f=>({...f,statusEffects:{...f.statusEffects,burned:Math.max(f.statusEffects.burned,15)}}));
  if (effect==='confuse')      return modActive(targetSide,f=>({...f,statusEffects:{...f.statusEffects,confused:true}}));
  if (effect==='heal_10')      return modActive(selfSide,f=>({...f,currentEnergy:Math.min(f.maxEnergy,f.currentEnergy+10)}));
  if (effect==='heal_15')      return modActive(selfSide,f=>({...f,currentEnergy:Math.min(f.maxEnergy,f.currentEnergy+15)}));
  if (effect==='heal_20')      return modActive(selfSide,f=>({...f,currentEnergy:Math.min(f.maxEnergy,f.currentEnergy+20)}));
  if (effect==='reduce_10')    return modActive(selfSide,f=>({...f,statusEffects:{...f.statusEffects,reduceDmg:(f.statusEffects.reduceDmg||0)+10}}));
  if (effect==='reduce_15')    return modActive(selfSide,f=>({...f,statusEffects:{...f.statusEffects,reduceDmg:(f.statusEffects.reduceDmg||0)+15}}));
  if (effect==='self_10') {
    const team=[...s[selfSide].team]; const i=s[selfSide].activeIdx;
    team[i]={...team[i],currentEnergy:Math.max(0,team[i].currentEnergy-10)};
    return {...s,[selfSide]:{...s[selfSide],team}};
  }
  if (effect==='self_20') {
    const team=[...s[selfSide].team]; const i=s[selfSide].activeIdx;
    team[i]={...team[i],currentEnergy:Math.max(0,team[i].currentEnergy-20)};
    return {...s,[selfSide]:{...s[selfSide],team}};
  }
  if (effect && effect.startsWith('bench_')) {
    const dmg=parseInt(effect.split('_')[1])||5;
    const team=s[targetSide].team.map((f,i)=>i===s[targetSide].activeIdx?f:{...f,currentEnergy:Math.max(0,f.currentEnergy-dmg)});
    return {...s,[targetSide]:{...s[targetSide],team}};
  }
  return s;
}

function applyMugicEffect(mugicId, state, casterSide) {
  const mc = CARDS[mugicId]; if (!mc) return { state, msg: 'Unknown mugic!' };
  const effect = mc.effect || '';
  let s = { ...state };
  let msg = '';

  const self = casterSide;
  const opp  = casterSide === 'player' ? 'opponent' : 'player';

  const healActive = (side, amt) => {
    const team=[...s[side].team]; const i=s[side].activeIdx;
    team[i]={...team[i],currentEnergy:Math.min(team[i].maxEnergy,team[i].currentEnergy+amt)};
    s={...s,[side]:{...s[side],team}}; return amt;
  };
  const healAll = (side,amt) => {
    const team=s[side].team.map(f=>f.currentEnergy>0?{...f,currentEnergy:Math.min(f.maxEnergy,f.currentEnergy+amt)}:f);
    s={...s,[side]:{...s[side],team}};
  };

  if      (effect==='heal_20')           { const h=healActive(self,20); msg=`Healed ${h} EP`; }
  else if (effect==='heal_30')           { const h=healActive(self,30); msg=`Healed ${h} EP`; }
  else if (effect==='heal_40')           { const h=healActive(self,40); msg=`Healed ${h} EP`; }
  else if (effect==='heal_50')           { const h=healActive(self,50); msg=`Healed ${h} EP`; }
  else if (effect==='heal_30_all')       { healAll(self,30); msg='Healed all allies 30 EP'; }
  else if (effect==='negate_attack')     { s={...s,negateNext:true}; msg='Next attack negated!'; }
  else if (effect==='confuse_opponent')  {
    const team=[...s[opp].team]; const i=s[opp].activeIdx;
    team[i]={...team[i],statusEffects:{...team[i].statusEffects,confused:true}};
    s={...s,[opp]:{...s[opp],team}}; msg='Opponent confused!';
  }
  else if (effect==='burn_opponent_15')  {
    const team=[...s[opp].team]; const i=s[opp].activeIdx;
    team[i]={...team[i],statusEffects:{...team[i].statusEffects,burned:15}};
    s={...s,[opp]:{...s[opp],team}}; msg='Opponent burned 15/turn!';
  }
  else if (effect==='reduce_dmg_next_30') {
    const team=[...s[self].team]; const i=s[self].activeIdx;
    team[i]={...team[i],statusEffects:{...team[i].statusEffects,reduceDmg:30}};
    s={...s,[self]:{...s[self],team}}; msg='Reduced next attack by 30';
  }
  else if (effect&&effect.startsWith('boost_')) {
    const parts=effect.split('_'); const disc=parts[1]; const amt=parseInt(parts[2])||20;
    const boosts={...(s[self].turnBoosts||{}),[disc]:(s[self].turnBoosts?.[disc]||0)+amt};
    s={...s,[self]:{...s[self],turnBoosts:boosts}}; msg=`+${amt} ${disc} this turn`;
  }
  else msg=effect;

  return { state: s, msg };
}

function processStatusEffects(state) {
  let s={...state}; const newLog=[];
  ['player','opponent'].forEach(side=>{
    const team=[...s[side].team]; const idx=s[side].activeIdx;
    if(!team[idx]) return;
    const f={...team[idx]};
    if(f.statusEffects.burned>0){
      f.currentEnergy=Math.max(0,f.currentEnergy-f.statusEffects.burned);
      newLog.push(`🔥 ${CARDS[f.cardId]?.name} takes ${f.statusEffects.burned} burn damage`);
    }
    team[idx]=f;
    s={...s,[side]:{...s[side],team}};
  });
  return {state:s,newLog};
}

function handleKO(state,side) {
  const other=side==='player'?'opponent':'player';
  const sideData=state[side];
  const team=[...sideData.team];
  const deadIdx=sideData.activeIdx;
  const logs=[`💀 ${CARDS[team[deadIdx]?.cardId]?.name||'?'} is knocked out!`];
  const nextIdx=team.findIndex((f,i)=>i!==deadIdx&&f.currentEnergy>0);
  if(nextIdx===-1){
    const reward=side==='opponent'?(state.opponentData?.reward||50):0;
    logs.push(other==='player'?`🎉 VICTORY! All enemy creatures defeated!`:`💔 DEFEAT! All your creatures were knocked out.`);
    return {...state,[side]:{...sideData,activeIdx:deadIdx},gameOver:true,winner:other,coinsEarned:(state.coinsEarned||0)+reward,log:[...state.log,...logs].slice(-80)};
  }
  logs.push(`➡ ${CARDS[team[nextIdx]?.cardId]?.name||'?'} enters the field!`);
  return {...state,[side]:{...sideData,activeIdx:nextIdx,creaturesKOd:(sideData.creaturesKOd||0)+1},log:[...state.log,...logs].slice(-80)};
}

function computeAIAction(state) {
  const {opponent,player}=state;
  const attacker=opponent.team[opponent.activeIdx];
  const defender=player.team[player.activeIdx];
  if(!attacker||!defender) return null;
  const card=CARDS[attacker.cardId]; if(!card) return null;
  const attacks=card.attacks||[];

  if(!opponent.hasCastMugic&&attacker.currentEnergy<attacker.maxEnergy*0.35){
    const healMugic=opponent.mugicHand.find(id=>{
      const mc=CARDS[id]; if(!mc) return false;
      return (attacker.mugicCounters||0)>=(mc.cost||0)&&(mc.effect?.startsWith('heal'));
    });
    if(healMugic) return {type:'mugic',mugicId:healMugic};
  }

  const defCard=CARDS[defender.cardId];
  let best=null; let bestDmg=-1;
  for(const atk of attacks){
    const boost=(opponent.turnBoosts||{})[atk.disc]||0;
    const aug={...attacker,[atk.disc]:attacker[atk.disc]+boost};
    const check=disciplineCheck(atk,aug,defender);
    const dmg=calcAttackDamage(atk,check,card,defCard);
    if(dmg>bestDmg){bestDmg=dmg;best=atk;}
  }
  return best?{type:'attack',attack:best}:null;
}

export default function Battle({state,onUpdateBattle,onEndBattle}) {
  const [aiThinking,setAiThinking]=useState(false);
  const [swapMode,setSwapMode]=useState(false);
  const [showMugic,setShowMugic]=useState(false);
  const [lastDmg,setLastDmg]=useState(null);
  const logRef=useRef(null);

  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[state?.log]);

  useEffect(()=>{
    if(!state||state.turn!=='opponent'||state.gameOver||aiThinking) return;
    setAiThinking(true);
    const timer=setTimeout(()=>{
      let s={...state};
      const action=computeAIAction(s);

      if(action?.type==='mugic'){
        const mc=CARDS[action.mugicId];
        if(mc&&(s.opponent.team[s.opponent.activeIdx]?.mugicCounters||0)>=(mc.cost||0)){
          const team=[...s.opponent.team]; const idx=s.opponent.activeIdx;
          team[idx]={...team[idx],mugicCounters:team[idx].mugicCounters-(mc.cost||0)};
          const hand=s.opponent.mugicHand.filter((_,i)=>i!==s.opponent.mugicHand.indexOf(action.mugicId));
          const {state:ns,msg}=applyMugicEffect(action.mugicId,{...s,opponent:{...s.opponent,team,mugicHand:hand,hasCastMugic:true}},'opponent');
          s={...ns,log:[...ns.log,`🤖 Opponent casts ♪ ${mc.name}: ${msg}`].slice(-80)};
        }
      }

      const attacker=s.opponent.team[s.opponent.activeIdx];
      const defender=s.player.team[s.player.activeIdx];
      if(attacker&&defender){
        const atk=action?.type==='attack'?action.attack:(CARDS[attacker.cardId]?.attacks||[])[0];
        if(atk){
          const boost=(s.opponent.turnBoosts||{})[atk.disc]||0;
          const aug={...attacker,[atk.disc]:attacker[atk.disc]+boost};
          const check=disciplineCheck(atk,aug,defender);
          const atkCard=CARDS[attacker.cardId];
          const defCard=CARDS[defender.cardId];
          let dmg=calcAttackDamage(atk,check,atkCard,defCard);

          if(s.negateNext){dmg=0;s={...s,negateNext:false};}
          dmg=Math.max(0,dmg-(defender.statusEffects?.reduceDmg||0));

          const bgCard=CARDS[attacker.battlegearId];
          let extraLog=[];
          if(bgCard?.effect==='burn_on_hit'&&dmg>0){s=applyAttackEffect('burn_5',s,'player');extraLog.push('🔥 Burn applied!');}
          if(bgCard?.effect==='confuse_on_hit'&&dmg>0){s=applyAttackEffect('confuse',s,'player');extraLog.push('💫 Confused!');}
          if(bgCard?.effect==='reflect_10'&&dmg>0){
            const ot=[...s.opponent.team];const oi=s.opponent.activeIdx;
            ot[oi]={...ot[oi],currentEnergy:Math.max(0,ot[oi].currentEnergy-10)};
            s={...s,opponent:{...s.opponent,team:ot}};extraLog.push('↩ 10 reflected!');
          }

          const pteam=[...s.player.team]; const pidx=s.player.activeIdx;
          pteam[pidx]={...pteam[pidx],currentEnergy:Math.max(0,pteam[pidx].currentEnergy-dmg),statusEffects:{...pteam[pidx].statusEffects,reduceDmg:0}};
          s={...s,player:{...s.player,team:pteam},opponent:{...s.opponent,hasAttacked:true}};
          s=applyAttackEffect(atk.effect,s,'player');

          const el=atk.element&&atk.element!=='none'?` [${(ELEMENT_DATA[atk.element]?.icon||'')} ${atk.element}]`:'';
          s={...s,log:[...s.log,`🤖 ${atkCard?.name} → ${atk.name}${el} — ${checkLabel(check)} — ${dmg} dmg`,...extraLog].slice(-80)};

          if(pteam[pidx].currentEnergy<=0){
            s=handleKO(s,'player');
            if(s.gameOver){onUpdateBattle(s);setAiThinking(false);if(s.winner==='player')onEndBattle(true,s.coinsEarned);else onEndBattle(false,0);return;}
          }
        }
      }

      const {state:ns2,newLog}=processStatusEffects(s);
      s={...ns2,log:[...ns2.log,...newLog].slice(-80)};

      for(const side of['player','opponent']){
        const f=s[side].team[s[side].activeIdx];
        if(f&&f.currentEnergy<=0&&!s.gameOver){s=handleKO(s,side);if(s.gameOver)break;}
      }

      s={...s,turn:'player',opponent:{...s.opponent,hasAttacked:false,hasCastMugic:false,turnBoosts:{}},turnNumber:s.turnNumber+1};
      onUpdateBattle(s);setAiThinking(false);
    },1400);
    return()=>clearTimeout(timer);
  },[state?.turn,state?.gameOver]);

  if(!state) return <div style={{background:C.bg,minHeight:'100vh',color:C.text,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>Loading battle...</div>;

  const {player,opponent,locationId,turn,gameOver,winner,log,negateNext,opponentData}=state;
  const playerActive=player.team[player.activeIdx];
  const oppActive=opponent.team[opponent.activeIdx];
  const playerCard=CARDS[playerActive?.cardId];
  const oppCard=CARDS[oppActive?.cardId];
  const locationCard=CARDS[locationId];
  const td=TRIBE_DATA[opponentData?.tribe||'overworld'];
  const isPlayerTurn=turn==='player'&&!gameOver&&!aiThinking;

  function doPlayerAttack(atkIdx) {
    if(!isPlayerTurn||player.hasAttacked) return;
    const atk=playerCard?.attacks?.[atkIdx]; if(!atk) return;
    let s={...state};
    const boost=(player.turnBoosts||{})[atk.disc]||0;
    const aug={...playerActive,[atk.disc]:playerActive[atk.disc]+boost};

    const selfHit=playerActive.statusEffects?.confused&&Math.random()<0.45;
    const check=disciplineCheck(atk,aug,selfHit?playerActive:oppActive);
    const defCard=CARDS[(selfHit?playerActive:oppActive).cardId];
    let dmg=calcAttackDamage(atk,check,playerCard,defCard);
    if(s.negateNext){dmg=0;s={...s,negateNext:false};}
    let extraLog=[];
    if(selfHit){extraLog.push('💫 CONFUSED! Hit yourself!');}

    if(!selfHit){
      dmg=Math.max(0,dmg-(oppActive.statusEffects?.reduceDmg||0));
      const bgCard=CARDS[playerActive.battlegearId];
      if(bgCard?.effect==='burn_on_hit'&&dmg>0){s=applyAttackEffect('burn_5',s,'opponent');extraLog.push('🔥 Burn applied!');}
      if(bgCard?.effect==='confuse_on_hit'&&dmg>0){s=applyAttackEffect('confuse',s,'opponent');extraLog.push('💫 Confused!');}
      if(bgCard?.effect==='reflect_10'&&dmg>0){
        const pt=[...s.player.team];const pi=s.player.activeIdx;
        pt[pi]={...pt[pi],currentEnergy:Math.max(0,pt[pi].currentEnergy-10)};
        s={...s,player:{...s.player,team:pt}};extraLog.push('↩ 10 damage reflected!');
      }
      const ot=[...s.opponent.team]; const oi=s.opponent.activeIdx;
      ot[oi]={...ot[oi],currentEnergy:Math.max(0,ot[oi].currentEnergy-dmg),statusEffects:{...ot[oi].statusEffects,reduceDmg:0}};
      s={...s,opponent:{...s.opponent,team:ot}};
      s=applyAttackEffect(atk.effect,s,'opponent');
    } else {
      const pt=[...s.player.team]; const pi=s.player.activeIdx;
      pt[pi]={...pt[pi],currentEnergy:Math.max(0,pt[pi].currentEnergy-dmg)};
      s={...s,player:{...s.player,team:pt}};
    }

    const el=atk.element&&atk.element!=='none'?` [${ELEMENT_DATA[atk.element]?.icon||''} ${atk.element}]`:'';
    const atkLog=selfHit?`😵 ${playerCard?.name} hits itself — ${dmg} dmg`:`⚔ ${playerCard?.name} → ${atk.name}${el} — ${checkLabel(check)} — ${dmg} dmg`;
    s={...s,player:{...s.player,hasAttacked:true},log:[...s.log,atkLog,...extraLog].slice(-80)};
    setLastDmg(dmg);

    const checkKO=(s,side)=>{
      const f=s[side].team[s[side].activeIdx];
      if(f&&f.currentEnergy<=0&&!s.gameOver){
        s=handleKO(s,side);
        if(s.gameOver){onUpdateBattle(s);if(s.winner==='player')onEndBattle(true,s.coinsEarned);else onEndBattle(false,0);return null;}
      }
      return s;
    };
    s=checkKO(s,selfHit?'player':'opponent'); if(s===null) return;
    onUpdateBattle(s);
  }

  function doEndTurn() {
    if(!isPlayerTurn) return;
    const {state:ns,newLog}=processStatusEffects(state);
    let s={...ns,log:[...ns.log,'── End Turn ──',...newLog].slice(-80)};
    for(const side of['player','opponent']){
      const f=s[side].team[s[side].activeIdx];
      if(f&&f.currentEnergy<=0&&!s.gameOver){s=handleKO(s,side);if(s.gameOver)break;}
    }
    if(s.gameOver){onUpdateBattle(s);if(s.winner==='player')onEndBattle(true,s.coinsEarned);else onEndBattle(false,0);return;}
    s={...s,turn:'opponent',player:{...s.player,hasAttacked:false,hasCastMugic:false,turnBoosts:{}}};
    onUpdateBattle(s);setSwapMode(false);setShowMugic(false);
  }

  function doCastMugic(mugicId) {
    if(!isPlayerTurn||player.hasCastMugic) return;
    const mc=CARDS[mugicId]; if(!mc) return;
    const cost=mc.cost||0;
    if((playerActive?.mugicCounters||0)<cost) return;
    const pt=[...player.team]; const pi=player.activeIdx;
    pt[pi]={...pt[pi],mugicCounters:pt[pi].mugicCounters-cost};
    const hand=[...player.mugicHand]; const mi=hand.indexOf(mugicId); if(mi!==-1) hand.splice(mi,1);
    let s={...state,player:{...player,team:pt,mugicHand:hand,hasCastMugic:true}};
    const {state:ns,msg}=applyMugicEffect(mugicId,s,'player');
    ns.log=[...ns.log,`♪ Cast ${mc.name}: ${msg}`].slice(-80);
    onUpdateBattle(ns);setShowMugic(false);
  }

  function doSwap(idx) {
    if(!isPlayerTurn||idx===player.activeIdx||player.team[idx]?.currentEnergy<=0) return;
    const name=CARDS[player.team[idx]?.cardId]?.name||'?';
    onUpdateBattle({...state,player:{...player,activeIdx:idx},log:[...log,`↔ Swapped to ${name}`].slice(-80)});
    setSwapMode(false);
  }

  const alivePlayers=player.team.filter(f=>f.currentEnergy>0).length;
  const aliveOpps=opponent.team.filter(f=>f.currentEnergy>0).length;

  // ── Game over overlay ──────────────────────────────────────────────────────
  if(gameOver) {
    const won=winner==='player';
    return (
      <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center',maxWidth:500,padding:40}}>
          <div style={{fontSize:64,marginBottom:20}}>{won?'🏆':'💀'}</div>
          <div style={{fontSize:32,fontWeight:'bold',color:won?C.green:C.red,textTransform:'uppercase',letterSpacing:4,marginBottom:8}}>{won?'VICTORY':'DEFEAT'}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:24}}>{won?`You defeated ${opponentData?.name}!`:'Your creatures were all knocked out.'}</div>
          {won&&<div style={{fontSize:18,color:C.amber,marginBottom:24}}>💰 +{state.coinsEarned} Chaotic Coins</div>}
          <button onClick={()=>onEndBattle(won,state.coinsEarned)} style={{background:won?C.green:C.red,color:'#000',border:'none',borderRadius:8,padding:'12px 40px',fontSize:14,fontWeight:'bold',cursor:'pointer',textTransform:'uppercase',letterSpacing:2}}>
            {won?'Claim Reward':'Return to Hub'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      {/* Location bar */}
      <div style={{background:`linear-gradient(90deg,#0c0a05,${td?.color||C.orange}33,#0c0a05)`,borderBottom:`2px solid ${td?.color||C.orange}`,padding:'6px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
        <div>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>vs {opponentData?.name} — {opponentData?.subtitle}</div>
          <div style={{fontSize:13,fontWeight:'bold',color:td?.color||C.orange,textTransform:'uppercase',letterSpacing:1}}>📍 {locationCard?.name||'Unknown'} {negateNext&&<span style={{fontSize:9,color:C.blue}}> 🛡 NEXT ATTACK NEGATED</span>}</div>
        </div>
        <div style={{textAlign:'right',fontSize:9,color:C.muted}}>
          <div>Turn {state.turnNumber} · {isPlayerTurn?'YOUR TURN':aiThinking?'OPPONENT THINKING...':'OPPONENT\'S TURN'}</div>
          <div style={{color:C.green}}>You: {alivePlayers} alive</div>
          <div style={{color:td?.color||C.red}}>Enemy: {aliveOpps} alive</div>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left — battlefield */}
        <div style={{width:500,display:'flex',flexDirection:'column',gap:8,padding:10,overflowY:'auto',flexShrink:0}}>
          {/* Opponent active */}
          <div style={{background:C.panel,borderRadius:8,border:`1px solid ${td?.color||C.orange}44`,padding:10}}>
            <div style={{fontSize:8,color:td?.color||C.orange,textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>
              🤖 {opponentData?.name} — Active Creature
            </div>
            <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              {oppActive&&<CardDisplay cardId={oppActive.cardId} fighter={oppActive}/>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:8,color:C.muted,marginBottom:4}}>BENCH ({opponent.team.filter((f,i)=>i!==opponent.activeIdx&&f.currentEnergy>0).length} alive)</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {opponent.team.map((f,i)=>i===opponent.activeIdx?null:(
                    <div key={i} style={{padding:'3px 7px',borderRadius:4,background:f.currentEnergy>0?'#1a0d0d':'#0a0a0a',border:`1px solid ${f.currentEnergy>0?(td?.color||C.red)+'44':'#2a1a1a'}`,fontSize:8,color:f.currentEnergy>0?C.text:'#333'}}>
                      {CARDS[f.cardId]?.name?.split(' ')[0]} {f.currentEnergy>0?`(${f.currentEnergy})`:'KO'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player active */}
          <div style={{background:C.panel,borderRadius:8,border:`1px solid ${C.orange}44`,padding:10}}>
            <div style={{fontSize:8,color:C.orange,textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>
              ⚔ Your Active Creature
            </div>
            <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              {playerActive&&<CardDisplay cardId={playerActive.cardId} fighter={playerActive}/>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:8,color:C.muted,marginBottom:4}}>BENCH ({player.team.filter((f,i)=>i!==player.activeIdx&&f.currentEnergy>0).length} alive)</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {player.team.map((f,i)=>{
                    if(i===player.activeIdx) return null;
                    const alive=f.currentEnergy>0;
                    return (
                      <div key={i} onClick={()=>swapMode&&doSwap(i)} style={{padding:'3px 7px',borderRadius:4,background:alive?'#0d1a0d':'#0a0a0a',border:`1px solid ${alive?C.green+'44':'#1a2a1a'}`,fontSize:8,color:alive?C.text:'#333',cursor:swapMode&&alive?'pointer':'default'}}>
                        {CARDS[f.cardId]?.name?.split(' ')[0]} {alive?`(${f.currentEnergy})`:'KO'}
                        {swapMode&&alive&&<span style={{color:C.green}}> ↔</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{fontSize:8,color:C.muted,marginTop:6}}>
                  Mugic: {player.mugicHand.length} remaining
                </div>
              </div>
            </div>
          </div>

          {/* Player attacks */}
          {isPlayerTurn&&!swapMode&&!showMugic&&(
            <div style={{background:C.panel,borderRadius:8,border:'1px solid #1a1020',padding:10}}>
              <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:8}}>
                {player.hasAttacked?'Attack used — End turn or cast Mugic':'Choose an Attack'}
              </div>
              {!player.hasAttacked&&playerCard?.attacks?.map((atk,i)=>(
                <button key={i} onClick={()=>doPlayerAttack(i)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',background:'#0a0a0a',border:`1px solid ${DISCIPLINE_COLOR[atk.disc]||C.orange}44`,borderRadius:6,padding:'7px 10px',cursor:'pointer',color:C.text,marginBottom:5,gap:8}}>
                  <div style={{textAlign:'left',minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:'bold',color:DISCIPLINE_COLOR[atk.disc]||C.text}}>{atk.name}</div>
                    <div style={{fontSize:8,color:C.muted}}>
                      {DISCIPLINE_ICON[atk.disc]} {atk.disc.toUpperCase()}
                      {atk.element&&atk.element!=='none'&&<span style={{marginLeft:5,color:ELEMENT_DATA[atk.element]?.color}}>{ELEMENT_DATA[atk.element]?.icon} {atk.element}</span>}
                      {atk.desc&&<span style={{marginLeft:5,color:'#f59e0b'}}> · {atk.desc}</span>}
                    </div>
                  </div>
                  <div style={{fontSize:13,fontWeight:'bold',color:C.red,flexShrink:0}}>{atk.damage}</div>
                </button>
              ))}
            </div>
          )}

          {/* Mugic panel */}
          {showMugic&&isPlayerTurn&&(
            <div style={{background:C.panel,borderRadius:8,border:'1px solid #2a0a40',padding:10}}>
              <div style={{fontSize:8,color:C.purple,textTransform:'uppercase',letterSpacing:1.5,marginBottom:8}}>♪ Cast Mugic</div>
              {player.mugicHand.length===0?<div style={{fontSize:9,color:C.muted}}>No Mugic cards remaining</div>:
                player.mugicHand.map((id,i)=>{
                  const mc=CARDS[id]; if(!mc) return null;
                  const canCast=(playerActive?.mugicCounters||0)>=(mc.cost||0)&&!player.hasCastMugic;
                  return (
                    <button key={i} onClick={()=>canCast&&doCastMugic(id)} disabled={!canCast} style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',background:canCast?'#0a0014':'#0a0a0a',border:`1px solid ${canCast?C.purple+'44':'#333'}`,borderRadius:6,padding:'7px 10px',cursor:canCast?'pointer':'not-allowed',color:canCast?C.text:'#555',marginBottom:5,opacity:canCast?1:0.5}}>
                      <div style={{textAlign:'left'}}>
                        <div style={{fontSize:10,fontWeight:'bold',color:canCast?C.purple:'#555'}}>{mc.name}</div>
                        <div style={{fontSize:8,color:C.muted}}>{mc.effectLabel||mc.effect}</div>
                      </div>
                      <div style={{fontSize:9,color:C.purple}}>♪×{mc.cost||0}</div>
                    </button>
                  );
                })
              }
            </div>
          )}

          {/* Action buttons */}
          {isPlayerTurn&&(
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {!swapMode&&!showMugic&&(
                <>
                  <button onClick={()=>setSwapMode(true)} disabled={player.team.filter((f,i)=>i!==player.activeIdx&&f.currentEnergy>0).length===0} style={{flex:1,background:'transparent',border:`1px solid ${C.blue}44`,color:C.blue,borderRadius:6,padding:'7px',fontSize:9,cursor:'pointer',textTransform:'uppercase'}}>↔ Swap</button>
                  <button onClick={()=>setShowMugic(true)} disabled={player.hasCastMugic||player.mugicHand.length===0} style={{flex:1,background:'transparent',border:`1px solid ${C.purple}44`,color:C.purple,borderRadius:6,padding:'7px',fontSize:9,cursor:'pointer',textTransform:'uppercase',opacity:player.hasCastMugic?0.4:1}}>♪ Mugic</button>
                  <button onClick={doEndTurn} style={{flex:1,background:C.orange+'22',border:`1px solid ${C.orange}`,color:C.orange,borderRadius:6,padding:'7px',fontSize:9,cursor:'pointer',fontWeight:'bold',textTransform:'uppercase'}}>End Turn →</button>
                </>
              )}
              {(swapMode||showMugic)&&<button onClick={()=>{setSwapMode(false);setShowMugic(false);}} style={{flex:1,background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'7px',fontSize:9,cursor:'pointer',textTransform:'uppercase'}}>← Cancel</button>}
            </div>
          )}
          {!isPlayerTurn&&!gameOver&&(
            <div style={{textAlign:'center',padding:10,color:C.muted,fontSize:10}}>{aiThinking?'⏳ Opponent is choosing their move...':'Waiting...'}</div>
          )}
        </div>

        {/* Right — battle log */}
        <div style={{flex:1,display:'flex',flexDirection:'column',padding:10,minWidth:0}}>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>⚔ Battle Log</div>
          <div ref={logRef} style={{flex:1,overflowY:'auto',background:C.panel,borderRadius:8,border:'1px solid #1a1020',padding:'10px 12px'}}>
            {log.map((line,i)=>{
              const isImportant=line.startsWith('🎉')||line.startsWith('💔')||line.startsWith('💀')||line.startsWith('🏆');
              const isSeparator=line.startsWith('──');
              const isAtk=line.startsWith('⚔')||line.startsWith('🤖');
              const isMugic=line.startsWith('♪');
              const isStatus=line.startsWith('🔥')||line.startsWith('💫');
              return (
                <div key={i} style={{fontSize:9,lineHeight:1.6,color:isImportant?C.green:isSeparator?C.muted:isAtk?C.amber:isMugic?C.purple:isStatus?'#ef4444':'#aaa',fontWeight:isImportant?'bold':'normal',marginBottom:1,borderTop:isSeparator?'1px solid #1a1020':undefined,paddingTop:isSeparator?4:undefined}}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
