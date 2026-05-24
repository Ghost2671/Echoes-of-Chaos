import { useState, useEffect, useRef } from 'react';
import { CARDS, TRIBE_DATA, DISCIPLINE_COLOR, DISCIPLINE_ICON } from '../gameData';
import { disciplineCheck, calcAttackDamage, makeFighter, applyLocation } from '../utils';
import CardDisplay, { EnergyBar } from '../components/CardDisplay';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171' };

// ── Build initial battle state ────────────────────────────────────────────────
export function buildBattleState(codex, opponentData) {
  const locationId = opponentData.location || 'plen_o_chao';
  const locationCard = CARDS[locationId];

  // Build player team
  const playerTeam = Object.entries(codex?.team || {}).flatMap(([id, count]) => {
    const bgId = (codex?.battlegear || {})[id] || null;
    const f = makeFighter(id, bgId);
    if (!f) return [];
    return Array.from({ length: Math.max(1, count) }, () => applyLocation({ ...f }, locationCard));
  });

  if (playerTeam.length === 0) return null;

  // Build opponent team (already fighter objects)
  const oppTeam = (opponentData.team || []).map(f => applyLocation({
    cardId: f.cardId, battlegearId: f.battlegearId || null,
    currentEnergy: f.currentEnergy, maxEnergy: f.maxEnergy,
    mugicCounters: f.mugicCounters || 0,
    maxMugicCounters: f.mugicCounters || 0,
    courage: f.courage, power: f.power, wisdom: f.wisdom, speed: f.speed,
    statusEffects: { burned: 0, confused: false, reduceDmg: 0 },
  }, locationCard));

  const playerMugic = Object.entries(codex?.mugic || {}).flatMap(([id, n]) => Array(Math.max(0, n)).fill(id));

  return {
    opponentData,
    locationId,
    player: { team: playerTeam, activeIdx: 0, mugicHand: playerMugic, mugicDiscard: [], hasAttacked: false, hasCastMugic: false, creaturesKOd: 0, turnBoosts: {} },
    opponent: { team: oppTeam, activeIdx: 0, mugicHand: [...(opponentData.mugic || [])], mugicDiscard: [], hasAttacked: false, hasCastMugic: false, creaturesKOd: 0, turnBoosts: {} },
    turn: 'player', turnNumber: 1, gameOver: false, winner: null, coinsEarned: 0,
    log: [`⚔ BATTLE BEGINS!`, `📍 Location: ${locationCard?.name || 'Unknown'}`, locationCard?.description ? `   ${locationCard.description}` : ''].filter(Boolean),
    negateNext: false,
  };
}

// ── Discipline check string ───────────────────────────────────────────────────
function checkLabel(result) {
  if (result.won) return `✅ WON (${result.atkTotal} vs ${result.defTotal})`;
  if (result.tie) return `🤝 TIE (${result.atkTotal})`;
  return `❌ LOST (${result.atkTotal} vs ${result.defTotal})`;
}

// ── Apply mugic effect ────────────────────────────────────────────────────────
function applyMugicEffect(mugicId, state, casterSide) {
  const mugicCard = CARDS[mugicId];
  if (!mugicCard) return { state, msg: 'Unknown mugic!' };
  const effect = mugicCard.effect || '';
  let s = { ...state };
  let msg = `♪ ${mugicCard.name}: `;

  const selfSide = casterSide === 'player' ? 'player' : 'opponent';
  const oppSide = casterSide === 'player' ? 'opponent' : 'player';

  function healActive(side, amount) {
    const team = [...s[side].team];
    const idx = s[side].activeIdx;
    const f = { ...team[idx], currentEnergy: Math.min(team[idx].maxEnergy, team[idx].currentEnergy + amount) };
    team[idx] = f;
    s = { ...s, [side]: { ...s[side], team } };
    return amount;
  }
  function healAll(side, amount) {
    const team = s[side].team.map(f => ({ ...f, currentEnergy: Math.min(f.maxEnergy, f.currentEnergy + amount) }));
    s = { ...s, [side]: { ...s[side], team } };
  }
  function confuseActive(side) {
    const team = [...s[side].team];
    const idx = s[side].activeIdx;
    team[idx] = { ...team[idx], statusEffects: { ...team[idx].statusEffects, confused: true } };
    s = { ...s, [side]: { ...s[side], team } };
  }
  function burnActive(side, amt) {
    const team = [...s[side].team];
    const idx = s[side].activeIdx;
    team[idx] = { ...team[idx], statusEffects: { ...team[idx].statusEffects, burned: amt } };
    s = { ...s, [side]: { ...s[side], team } };
  }

  if (effect === 'heal_20') { const h=healActive(selfSide,20); msg += `Healed ${h} Energy`; }
  else if (effect === 'heal_30') { const h=healActive(selfSide,30); msg += `Healed ${h} Energy`; }
  else if (effect === 'heal_40') { const h=healActive(selfSide,40); msg += `Healed ${h} Energy`; }
  else if (effect === 'heal_50') { const h=healActive(selfSide,50); msg += `Healed ${h} Energy`; }
  else if (effect === 'heal_30_all') { healAll(selfSide,30); msg += 'Healed all allies 30 Energy'; }
  else if (effect === 'negate_attack') { s = { ...s, negateNext: true }; msg += 'Next attack negated!'; }
  else if (effect === 'confuse_opponent') { confuseActive(oppSide); msg += 'Opponent confused!'; }
  else if (effect === 'burn_opponent_15') { burnActive(oppSide,15); msg += 'Burned opponent for 15/turn!'; }
  else if (effect === 'swap_active') {
    const team = [...s[selfSide].team];
    const avail = team.map((f,i)=>i).filter(i=>i!==s[selfSide].activeIdx && f.currentEnergy>0);
    if (avail.length > 0) { const ni = avail[Math.floor(Math.random()*avail.length)]; s = {...s, [selfSide]:{...s[selfSide],activeIdx:ni}}; msg += `Swapped to ${CARDS[team[ni].cardId]?.name}`; }
    else msg += 'No creature to swap to';
  }
  else if (effect.startsWith('boost_')) {
    const parts = effect.split('_');
    const disc = parts[1]; const amt = parseInt(parts[2])||20;
    const boosts = { ...(s[selfSide].turnBoosts||{}), [disc]:(s[selfSide].turnBoosts?.[disc]||0)+amt };
    s = { ...s, [selfSide]: { ...s[selfSide], turnBoosts: boosts } };
    msg += `+${amt} ${disc} this turn`;
  }
  else if (effect === 'reduce_dmg_next_30') {
    const team = [...s[selfSide].team]; const idx = s[selfSide].activeIdx;
    team[idx] = { ...team[idx], statusEffects: { ...team[idx].statusEffects, reduceDmg: 30 } };
    s = { ...s, [selfSide]: { ...s[selfSide], team } };
    msg += 'Reduced next incoming attack by 30';
  }
  else msg += effect;

  return { state: s, msg };
}

// ── Process end-of-turn status effects ────────────────────────────────────────
function processStatusEffects(state) {
  let s = { ...state };
  const newLog = [];
  ['player','opponent'].forEach(side => {
    const team = [...s[side].team];
    const idx = s[side].activeIdx;
    if (!team[idx]) return;
    const f = { ...team[idx] };
    if (f.statusEffects.burned > 0) {
      f.currentEnergy = Math.max(0, f.currentEnergy - f.statusEffects.burned);
      newLog.push(`🔥 ${CARDS[f.cardId]?.name} burns for ${f.statusEffects.burned} damage`);
    }
    team[idx] = f;
    s = { ...s, [side]: { ...s[side], team } };
  });
  return { state: s, newLog };
}

// ── Handle KO ─────────────────────────────────────────────────────────────────
function handleKO(state, side) {
  const otherSide = side === 'player' ? 'opponent' : 'player';
  const sideData = state[side];
  const team = [...sideData.team];
  const deadIdx = sideData.activeIdx;
  const logs = [];

  // KO the dead creature
  const koCrd = CARDS[team[deadIdx]?.cardId];
  logs.push(`💀 ${koCrd?.name || '?'} is knocked out!`);

  // Find next alive
  const nextIdx = team.findIndex((f, i) => i !== deadIdx && f.currentEnergy > 0);
  if (nextIdx === -1) {
    // All creatures KO'd — this side loses
    const oppData = state.opponentData;
    const reward = side === 'opponent' ? (oppData?.reward || 50) : 0;
    const winner = otherSide;
    logs.push(winner === 'player' ? `🎉 VICTORY! All opponent creatures defeated!` : `💔 DEFEAT! All your creatures were knocked out.`);
    return {
      ...state, [side]: { ...sideData, activeIdx: deadIdx },
      gameOver: true, winner,
      coinsEarned: (state.coinsEarned || 0) + reward,
      log: [...state.log, ...logs].slice(-60),
    };
  }

  logs.push(`➡ ${CARDS[team[nextIdx]?.cardId]?.name || '?'} enters the battle!`);
  return {
    ...state,
    [side]: { ...sideData, activeIdx: nextIdx, creaturesKOd: sideData.creaturesKOd + 1 },
    log: [...state.log, ...logs].slice(-60),
  };
}

// ── AI turn logic ─────────────────────────────────────────────────────────────
function computeAIAction(state) {
  const { opponent, player, negateNext } = state;
  const defender = player.team[player.activeIdx];
  const attacker = opponent.team[opponent.activeIdx];
  if (!attacker || !defender) return null;
  const card = CARDS[attacker.cardId];
  if (!card) return null;
  const attacks = card.attacks || [];

  // Try to cast healing mugic if low health
  if (!opponent.hasCastMugic && attacker.currentEnergy < attacker.maxEnergy * 0.35) {
    const healMugic = opponent.mugicHand.find(id => {
      const mc = CARDS[id]; if (!mc) return false;
      const enough = (attacker.mugicCounters || 0) >= (mc.cost || 0);
      return enough && (mc.effect?.startsWith('heal'));
    });
    if (healMugic) return { type: 'mugic', mugicId: healMugic };
  }

  // Choose best attack
  let best = null; let bestDmg = -1;
  for (const atk of attacks) {
    const atkBoost = (opponent.turnBoosts || {})[atk.disc] || 0;
    const augAttacker = { ...attacker, [atk.disc]: attacker[atk.disc] + atkBoost };
    const expectedDmg = atk.damage + Math.max(0, (augAttacker[atk.disc] - defender[atk.disc]) / 5);
    if (expectedDmg > bestDmg) { bestDmg = expectedDmg; best = atk; }
  }
  return best ? { type: 'attack', attack: best } : null;
}

// ── Battle component ──────────────────────────────────────────────────────────
export default function Battle({ state, onUpdateBattle, onEndBattle }) {
  const [aiThinking, setAiThinking] = useState(false);
  const [swapMode, setSwapMode] = useState(false);
  const [showMugic, setShowMugic] = useState(false);
  const logRef = useRef(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [state?.log]);

  // AI turn trigger
  useEffect(() => {
    if (!state || state.turn !== 'opponent' || state.gameOver || aiThinking) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      let s = { ...state };
      const action = computeAIAction(s);

      if (action?.type === 'mugic') {
        const mc = CARDS[action.mugicId];
        if (mc && (s.opponent.team[s.opponent.activeIdx]?.mugicCounters || 0) >= (mc.cost || 0)) {
          const team = [...s.opponent.team]; const idx = s.opponent.activeIdx;
          team[idx] = { ...team[idx], mugicCounters: team[idx].mugicCounters - (mc.cost || 0) };
          const mugicHand = s.opponent.mugicHand.filter((id, i) => i !== s.opponent.mugicHand.indexOf(action.mugicId));
          const { state: ns, msg } = applyMugicEffect(action.mugicId, { ...s, opponent: { ...s.opponent, team, mugicHand, hasCastMugic: true } }, 'opponent');
          s = { ...ns, log: [...ns.log, `🤖 Opponent: ${msg}`].slice(-60) };
        }
      }

      // Attack
      const attacker = s.opponent.team[s.opponent.activeIdx];
      const defender = s.player.team[s.player.activeIdx];
      if (attacker && defender && action) {
        const atk = action.type === 'attack' ? action.attack : (CARDS[attacker.cardId]?.attacks || [])[0];
        if (atk) {
          const atkBoost = (s.opponent.turnBoosts || {})[atk.disc] || 0;
          const augAttacker = { ...attacker, [atk.disc]: attacker[atk.disc] + atkBoost };
          const check = disciplineCheck(atk, augAttacker, defender);
          let dmg = calcAttackDamage(atk, check);

          if (s.negateNext) { dmg = 0; s = { ...s, negateNext: false }; }
          dmg = Math.max(0, dmg - (defender.statusEffects?.reduceDmg || 0));

          // Apply battlegear effects
          const bgCard = CARDS[attacker.battlegearId];
          let extraLog = [];
          if (bgCard?.effect === 'burn_on_hit' && dmg > 0) {
            const pt = [...s.player.team]; const pi = s.player.activeIdx;
            pt[pi] = { ...pt[pi], statusEffects: { ...pt[pi].statusEffects, burned: 5 } };
            s = { ...s, player: { ...s.player, team: pt } };
            extraLog.push('🔥 Applied Burn 5!');
          }
          if (bgCard?.effect === 'confuse_on_hit' && dmg > 0) {
            const pt = [...s.player.team]; const pi = s.player.activeIdx;
            pt[pi] = { ...pt[pi], statusEffects: { ...pt[pi].statusEffects, confused: true } };
            s = { ...s, player: { ...s.player, team: pt } };
            extraLog.push('💫 Confused your creature!');
          }
          if (bgCard?.effect === 'reflect_5' && dmg > 0) {
            const ot = [...s.opponent.team]; const oi = s.opponent.activeIdx;
            ot[oi] = { ...ot[oi], currentEnergy: Math.max(0, ot[oi].currentEnergy - 5) };
            s = { ...s, opponent: { ...s.opponent, team: ot } };
            extraLog.push('↩ Reflected 5 damage!');
          }

          // Reset defender reduceDmg
          const pteam = [...s.player.team]; const pidx = s.player.activeIdx;
          pteam[pidx] = { ...pteam[pidx], currentEnergy: Math.max(0, pteam[pidx].currentEnergy - dmg), statusEffects: { ...pteam[pidx].statusEffects, reduceDmg: 0 } };
          s = { ...s, player: { ...s.player, team: pteam }, opponent: { ...s.opponent, hasAttacked: true } };
          const atkLog = `🤖 ${CARDS[attacker.cardId]?.name} → ${atk.name} ${checkLabel(check)} → ${dmg} dmg`;
          s = { ...s, log: [...s.log, atkLog, ...extraLog].slice(-60) };

          if (pteam[pidx].currentEnergy <= 0) {
            s = handleKO(s, 'player');
            if (s.gameOver) { onUpdateBattle(s); setAiThinking(false); if (s.winner==='player') onEndBattle(true,s.coinsEarned); else onEndBattle(false,0); return; }
          }
        }
      }

      // Process end of turn status effects
      const { state: ns2, newLog } = processStatusEffects(s);
      s = { ...ns2, log: [...ns2.log, ...newLog].slice(-60) };

      // Check for KO from burn
      for (const side of ['player','opponent']) {
        const f = s[side].team[s[side].activeIdx];
        if (f && f.currentEnergy <= 0 && !s.gameOver) { s = handleKO(s, side); if (s.gameOver) break; }
      }

      s = { ...s, turn: 'player', opponent: { ...s.opponent, hasAttacked: false, hasCastMugic: false, turnBoosts: {} }, turnNumber: s.turnNumber + 1 };
      onUpdateBattle(s); setAiThinking(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [state?.turn, state?.gameOver]);

  if (!state) return <div style={{ background:C.bg, minHeight:'100vh', color:C.text, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>Loading battle...</div>;

  const { player, opponent, locationId, turn, gameOver, winner, log, negateNext, opponentData } = state;
  const playerActive = player.team[player.activeIdx];
  const oppActive = opponent.team[opponent.activeIdx];
  const playerCard = CARDS[playerActive?.cardId];
  const oppCard = CARDS[oppActive?.cardId];
  const locationCard = CARDS[locationId];
  const td = TRIBE_DATA[opponentData?.tribe || 'overworld'];
  const isPlayerTurn = turn === 'player' && !gameOver && !aiThinking;

  function doPlayerAttack(atkIdx) {
    if (!isPlayerTurn || player.hasAttacked) return;
    const atk = playerCard?.attacks?.[atkIdx];
    if (!atk) return;

    let s = { ...state };
    const atkBoost = (player.turnBoosts || {})[atk.disc] || 0;
    const augAttacker = { ...playerActive, [atk.disc]: playerActive[atk.disc] + atkBoost };

    // Confused check
    let selfHit = false;
    if (playerActive.statusEffects?.confused && Math.random() < 0.5) { selfHit = true; }

    const check = disciplineCheck(atk, augAttacker, selfHit ? playerActive : oppActive);
    let dmg = calcAttackDamage(atk, check);
    if (s.negateNext) { dmg = 0; s = { ...s, negateNext: false }; }

    let extraLog = [];
    if (selfHit) { extraLog.push('💫 CONFUSED! Attacked yourself!'); }

    if (!selfHit) {
      dmg = Math.max(0, dmg - (oppActive.statusEffects?.reduceDmg || 0));
      // Battlegear effects
      const bgCard = CARDS[playerActive.battlegearId];
      if (bgCard?.effect === 'burn_on_hit' && dmg > 0) {
        const ot = [...s.opponent.team]; const oi = s.opponent.activeIdx;
        ot[oi] = { ...ot[oi], statusEffects: { ...ot[oi].statusEffects, burned: 5 } };
        s = { ...s, opponent: { ...s.opponent, team: ot } };
        extraLog.push('🔥 Applied Burn 5!');
      }
      if (bgCard?.effect === 'confuse_on_hit' && dmg > 0) {
        const ot = [...s.opponent.team]; const oi = s.opponent.activeIdx;
        ot[oi] = { ...ot[oi], statusEffects: { ...ot[oi].statusEffects, confused: true } };
        s = { ...s, opponent: { ...s.opponent, team: ot } };
        extraLog.push('💫 Confused opponent!');
      }
      if (bgCard?.effect === 'reflect_5' && dmg > 0) {
        const pt = [...s.player.team]; const pi = s.player.activeIdx;
        pt[pi] = { ...pt[pi], currentEnergy: Math.max(0, pt[pi].currentEnergy - 5) };
        s = { ...s, player: { ...s.player, team: pt } };
        extraLog.push('↩ Opponent reflects 5!');
      }

      const ot = [...s.opponent.team]; const oi = s.opponent.activeIdx;
      ot[oi] = { ...ot[oi], currentEnergy: Math.max(0, ot[oi].currentEnergy - dmg), statusEffects: { ...ot[oi].statusEffects, reduceDmg: 0 } };
      s = { ...s, opponent: { ...s.opponent, team: ot } };
    } else {
      const pt = [...s.player.team]; const pi = s.player.activeIdx;
      pt[pi] = { ...pt[pi], currentEnergy: Math.max(0, pt[pi].currentEnergy - dmg) };
      s = { ...s, player: { ...s.player, team: pt } };
    }

    const atkLog = selfHit ? `😵 Self-hit: ${atk.name} → ${dmg} dmg to yourself` : `⚔ ${playerCard?.name} → ${atk.name} ${checkLabel(check)} → ${dmg} dmg`;
    s = { ...s, player: { ...s.player, hasAttacked: true }, log: [...s.log, atkLog, ...extraLog].slice(-60) };

    if (!selfHit && s.opponent.team[s.opponent.activeIdx].currentEnergy <= 0) {
      s = handleKO(s, 'opponent');
      if (s.gameOver) { onUpdateBattle(s); if (s.winner==='player') onEndBattle(true,s.coinsEarned); else onEndBattle(false,0); return; }
    }
    if (selfHit && s.player.team[s.player.activeIdx].currentEnergy <= 0) {
      s = handleKO(s, 'player');
      if (s.gameOver) { onUpdateBattle(s); if (s.winner==='player') onEndBattle(true,s.coinsEarned); else onEndBattle(false,0); return; }
    }
    onUpdateBattle(s);
  }

  function doEndTurn() {
    if (!isPlayerTurn) return;
    const { state: ns, newLog } = processStatusEffects(state);
    let s = { ...ns, log: [...ns.log, '── End of turn ──', ...newLog].slice(-60) };
    for (const side of ['player','opponent']) {
      const f = s[side].team[s[side].activeIdx];
      if (f && f.currentEnergy <= 0 && !s.gameOver) { s = handleKO(s, side); if (s.gameOver) break; }
    }
    if (s.gameOver) { onUpdateBattle(s); if (s.winner==='player') onEndBattle(true,s.coinsEarned); else onEndBattle(false,0); return; }
    s = { ...s, turn: 'opponent', player: { ...s.player, hasAttacked: false, hasCastMugic: false, turnBoosts: {} } };
    onUpdateBattle(s);
    setSwapMode(false); setShowMugic(false);
  }

  function doCastMugic(mugicId) {
    if (!isPlayerTurn || player.hasCastMugic) return;
    const mc = CARDS[mugicId]; if (!mc) return;
    const cost = mc.cost || 0;
    if ((playerActive?.mugicCounters || 0) < cost) return;

    const pt = [...player.team]; const pi = player.activeIdx;
    pt[pi] = { ...pt[pi], mugicCounters: pt[pi].mugicCounters - cost };
    const newMugicHand = [...player.mugicHand]; const mi = newMugicHand.indexOf(mugicId); if (mi !== -1) newMugicHand.splice(mi, 1);
    let s = { ...state, player: { ...player, team: pt, mugicHand: newMugicHand, hasCastMugic: true } };
    const { state: ns, msg } = applyMugicEffect(mugicId, s, 'player');
    ns.log = [...ns.log, `♪ You cast ${mc.name}: ${msg.replace(`♪ ${mc.name}: `, '')}`].slice(-60);
    onUpdateBattle(ns); setShowMugic(false);
  }

  function doSwapActive(idx) {
    if (!isPlayerTurn || idx === player.activeIdx || player.team[idx]?.currentEnergy <= 0) return;
    onUpdateBattle({ ...state, player: { ...player, activeIdx: idx }, log: [...log, `↔ Swapped to ${CARDS[player.team[idx]?.cardId]?.name}`].slice(-60) });
    setSwapMode(false);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text, display:'flex', flexDirection:'column' }}>
      {/* Location bar */}
      <div style={{ background:`linear-gradient(90deg, #0c0a05, ${TRIBE_DATA[opponentData?.tribe||'overworld']?.color}33, #0c0a05)`, borderBottom:`2px solid ${td?.color||C.orange}`, padding:'8px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <div>
          <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>vs {opponentData?.name}</div>
          <div style={{ fontSize:13, fontWeight:'bold', color:td?.color||C.orange, textTransform:'uppercase', letterSpacing:1 }}>📍 {locationCard?.name || 'Unknown Location'}</div>
          {locationCard?.description && <div style={{ fontSize:8.5, color:C.muted, marginTop:1 }}>{locationCard.description}</div>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:9, color:C.muted }}>Turn {state.turnNumber}</div>
          {negateNext && <div style={{ fontSize:9, color:'#60a5fa' }}>🛡 Next attack negated</div>}
          {aiThinking && <div style={{ fontSize:9, color:C.amber }}>⏳ Opponent thinking...</div>}
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden', gap:0 }}>
        {/* Left panel: Cards */}
        <div style={{ width:460, display:'flex', flexDirection:'column', padding:'10px', gap:8, flexShrink:0, overflowY:'auto' }}>
          {/* Opponent active */}
          <div style={{ background:C.panel, borderRadius:8, border:`1px solid ${td?.color||C.orange}44`, padding:10 }}>
            <div style={{ fontSize:8.5, color:td?.color||C.orange, textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>🤖 {opponentData?.name} — Active</div>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              {oppActive && <CardDisplay cardId={oppActive.cardId} small fighter={oppActive} />}
              <div style={{ flex:1, minWidth:0 }}>
                {/* Bench */}
                <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>BENCH ({opponent.team.filter((f,i)=>i!==opponent.activeIdx&&f.currentEnergy>0).length} alive)</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {opponent.team.map((f,i) => i===opponent.activeIdx ? null : (
                    <div key={i} style={{ padding:'3px 7px', borderRadius:4, background:f.currentEnergy>0?'#1a0d0d':'#0a0a0a', border:`1px solid ${f.currentEnergy>0?td?.color+'44':'#2a1a1a'}`, fontSize:8, color:f.currentEnergy>0?C.text:'#333' }}>
                      {CARDS[f.cardId]?.name?.split(' ')[0]} {f.currentEnergy>0?`(${f.currentEnergy})`:' KO'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player active */}
          <div style={{ background:C.panel, borderRadius:8, border:`1px solid ${C.orange}44`, padding:10 }}>
            <div style={{ fontSize:8.5, color:C.orange, textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>⚔ Your Active Creature</div>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              {playerActive && <CardDisplay cardId={playerActive.cardId} small fighter={playerActive} />}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>Mugic Counters: <span style={{ color:td?.color||C.orange }}>{Array.from({length:playerActive?.mugicCounters||0}).map((_,i)=><span key={i}>♩</span>)}</span>{!playerActive?.mugicCounters ? '(none)' : ''}</div>
                {playerActive?.battlegearId && <div style={{ fontSize:8, color:'#60a5fa', marginBottom:4 }}>⚙ {CARDS[playerActive.battlegearId]?.name}</div>}
                <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>BENCH</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {player.team.map((f,i) => i===player.activeIdx ? null : (
                    <div key={i} onClick={()=>swapMode&&doSwapActive(i)} style={{ padding:'3px 7px', borderRadius:4, background:f.currentEnergy>0?'#0d1a0d':'#0a0a0a', border:`1px solid ${f.currentEnergy>0?C.orange+'44':'#1a2a1a'}`, fontSize:8, color:f.currentEnergy>0?C.text:'#333', cursor:swapMode&&f.currentEnergy>0?'pointer':'default' }}>
                      {CARDS[f.cardId]?.name?.split(' ')[0]} {f.currentEnergy>0?`(${f.currentEnergy})`:' KO'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Log + Actions */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'10px 10px 10px 0', gap:8, minWidth:0 }}>
          {/* Battle log */}
          <div ref={logRef} style={{ flex:1, background:C.panel, border:`1px solid #1a1020`, borderRadius:8, padding:'8px 10px', overflowY:'auto', fontSize:9.5, lineHeight:1.7, color:C.muted, fontFamily:'monospace' }}>
            {log.map((l,i) => <div key={i} style={{ color: l.includes('VICTORY')?'#4ade80':l.includes('DEFEAT')?'#f87171':l.includes('⚔')?'#fbbf24':l.includes('♪')||l.includes('♩')?'#c084fc':l.includes('🤖')?'#60a5fa':C.muted }}>{l}</div>)}
          </div>

          {/* Action panel */}
          <div style={{ background:C.panel, border:`1px solid ${C.orange}33`, borderRadius:8, padding:10 }}>
            {gameOver ? (
              <div style={{ textAlign:'center', padding:10 }}>
                <div style={{ fontSize:16, fontWeight:'bold', color:winner==='player'?C.green:C.red, marginBottom:8 }}>
                  {winner==='player'?'🏆 VICTORY!':'💔 DEFEAT'}
                </div>
                {winner==='player'&&<div style={{ fontSize:11, color:C.amber, marginBottom:12 }}>+{state.coinsEarned} 💰 coins earned!</div>}
                <button onClick={()=>onEndBattle(winner==='player',state.coinsEarned)} style={{ background:winner==='player'?C.orange:'#444', color:'#000', border:'none', borderRadius:6, padding:'10px 28px', fontSize:12, fontWeight:'bold', cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                  {winner==='player'?'Claim Victory':'Return to Hub'}
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>
                  {turn==='player'?(player.hasAttacked?'End your turn when ready':'Choose an attack'):aiThinking?'Opponent is thinking...':'Waiting for opponent...'}
                </div>

                {/* Attack buttons */}
                {!player.hasAttacked && turn==='player' && (
                  <div style={{ marginBottom:8 }}>
                    <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>ATTACKS:</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {(playerCard?.attacks||[]).map((atk,i) => (
                        <button key={i} onClick={()=>doPlayerAttack(i)} disabled={!isPlayerTurn||player.hasAttacked} style={{ background:'#0a0d15', border:`1px solid ${DISCIPLINE_COLOR[atk.disc]}`, borderRadius:6, padding:'6px 12px', cursor:'pointer', color:'#ddd', fontSize:9.5, display:'flex', flexDirection:'column', gap:2 }}>
                          <span style={{ color:DISCIPLINE_COLOR[atk.disc] }}>{DISCIPLINE_ICON[atk.disc]} {atk.name}</span>
                          <span style={{ fontSize:8.5, color:'#ff7070', fontWeight:'bold' }}>{atk.damage} dmg</span>
                          <span style={{ fontSize:7, color:'#555' }}>{atk.disc} check (build {atk.build})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mugic, Swap, End Turn buttons */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {player.mugicHand.length > 0 && turn==='player' && !player.hasCastMugic && (
                    <button onClick={()=>setShowMugic(p=>!p)} style={{ background:showMugic?'#1a0d2a':'transparent', border:`1px solid #c084fc`, borderRadius:6, padding:'5px 12px', cursor:'pointer', color:'#c084fc', fontSize:9.5 }}>♪ Mugic ({player.mugicHand.length})</button>
                  )}
                  {player.team.filter((f,i)=>i!==player.activeIdx&&f.currentEnergy>0).length>0 && turn==='player' && (
                    <button onClick={()=>setSwapMode(p=>!p)} style={{ background:swapMode?'#0d1a2a':'transparent', border:`1px solid #60a5fa`, borderRadius:6, padding:'5px 12px', cursor:'pointer', color:'#60a5fa', fontSize:9.5 }}>↔ Swap</button>
                  )}
                  {turn==='player' && (
                    <button onClick={doEndTurn} disabled={!isPlayerTurn} style={{ background:player.hasAttacked?C.orange:'transparent', color:player.hasAttacked?'#000':C.muted, border:`1px solid ${player.hasAttacked?C.orange:C.muted}`, borderRadius:6, padding:'5px 14px', cursor:isPlayerTurn?'pointer':'not-allowed', fontSize:9.5, fontWeight:player.hasAttacked?'bold':'normal', textTransform:'uppercase', letterSpacing:1 }}>
                      {player.hasAttacked?'End Turn ▶':'Skip Attack'}
                    </button>
                  )}
                </div>

                {/* Mugic picker */}
                {showMugic && (
                  <div style={{ marginTop:8, padding:8, background:'#0a0510', borderRadius:6, border:'1px solid #c084fc33' }}>
                    <div style={{ fontSize:8, color:'#c084fc', marginBottom:6 }}>Cast Mugic (active creature needs enough counters):</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {[...new Set(player.mugicHand)].map(mid => {
                        const mc = CARDS[mid]; if (!mc) return null;
                        const canAfford = (playerActive?.mugicCounters||0) >= (mc.cost||0);
                        return <button key={mid} onClick={()=>canAfford&&doCastMugic(mid)} style={{ background:'#12062a', border:`1px solid ${canAfford?'#c084fc':'#3a2a5a'}`, borderRadius:5, padding:'5px 10px', cursor:canAfford?'pointer':'not-allowed', color:canAfford?'#ddd':'#555', fontSize:8.5, opacity:canAfford?1:0.5 }}>
                          <div style={{ color:'#c084fc' }}>{mc.name}</div>
                          <div style={{ fontSize:7.5 }}>Cost: {mc.cost||0} ♩ · {mc.description?.split('.')[0]}</div>
                        </button>;
                      })}
                    </div>
                  </div>
                )}

                {/* Swap picker */}
                {swapMode && (
                  <div style={{ marginTop:8, padding:8, background:'#030d1a', borderRadius:6, border:'1px solid #60a5fa33' }}>
                    <div style={{ fontSize:8, color:'#60a5fa', marginBottom:6 }}>Choose a creature to swap in:</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {player.team.map((f,i) => {
                        if (i===player.activeIdx||f.currentEnergy<=0) return null;
                        const fc = CARDS[f.cardId];
                        return <button key={i} onClick={()=>doSwapActive(i)} style={{ background:'#060e1a', border:'1px solid #60a5fa', borderRadius:5, padding:'5px 12px', cursor:'pointer', color:'#ddd', fontSize:8.5 }}>
                          <div style={{ color:'#60a5fa' }}>{fc?.name}</div>
                          <div style={{ fontSize:7.5 }}>E: {f.currentEnergy}/{f.maxEnergy}</div>
                        </button>;
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
