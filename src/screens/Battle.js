import { CARDS, OPPONENTS, PRIZE_COUNT, MAX_BENCH, WEAKNESS_CHART, WEAKNESS_BONUS } from '../gameData';
import { shuffle, canAffordAttack, buildDeckArray } from '../utils';
import CardDisplay from '../components/CardDisplay';
import { TRIBE } from '../components/CardDisplay';

const C = { bg: '#080808', panel: '#0f0f0f', border: '#1e1a10', orange: '#F26522', amber: '#F5A623', text: '#EDE0CC', muted: '#5A4A36', green: '#4ade80', red: '#f87171' };

// ── Helpers ───────────────────────────────────────────────────────────────
function makeCreature(cardId) {
  return { cardId, currentHp: CARDS[cardId].hp, maxHp: CARDS[cardId].hp, attachedEnergy: [], statusEffects: { burned: false, confused: false, reduceDmg: 0 } };
}
function addLogs(state, logs) {
  return { ...state, log: [...(state.log || []), ...logs].slice(-40) };
}
function drawOneCard(player) {
  let { drawPile, discard, hand } = player;
  drawPile = [...drawPile];
  if (drawPile.length === 0) {
    if (discard.length === 0) return { player, deckEmpty: true };
    drawPile = shuffle([...discard]); discard = [];
  }
  const card = drawPile.shift();
  return { player: { ...player, hand: [...hand, card], drawPile, discard }, deckEmpty: false };
}

// ── KO handlers ───────────────────────────────────────────────────────────
function handleOpponentKO(state, logs) {
  const { player, opponent } = state;
  const opp = OPPONENTS[state.opponentIndex];
  let newPlayer = { ...player };
  let coinsEarned = (state.coinsEarned || 0) + 20;

  if (player.prizes.length > 0) {
    const prizeCard = player.prizes[0];
    newPlayer = { ...player, prizes: player.prizes.slice(1), hand: [...player.hand, prizeCard], prizesTaken: player.prizesTaken + 1 };
    logs.push(`🏆 PRIZE TAKEN! ${CARDS[prizeCard]?.name || '?'} added to your hand. (${newPlayer.prizesTaken}/${opponent.prizesTotal})`);
  }

  if (newPlayer.prizesTaken >= opponent.prizesTotal) {
    logs.push(`🎉 ALL PRIZE CARDS TAKEN! VICTORY!`);
    return addLogs({ ...state, player: newPlayer, opponent: { ...opponent, active: null }, gameOver: true, winner: 'player', coinsEarned: coinsEarned + opp.reward }, logs);
  }
  if (opponent.bench.length === 0) {
    logs.push(`💀 ${opp.name} has no more creatures! YOU WIN!`);
    return addLogs({ ...state, player: newPlayer, opponent: { ...opponent, active: null }, gameOver: true, winner: 'player', coinsEarned: coinsEarned + opp.reward }, logs);
  }

  const nextActive = [...opponent.bench].sort((a, b) => b.currentHp - a.currentHp)[0];
  const newBench = opponent.bench.filter(c => c !== nextActive);
  logs.push(`${opp.name} promotes ${CARDS[nextActive.cardId]?.name}!`);
  return addLogs({ ...state, player: newPlayer, opponent: { ...opponent, active: nextActive, bench: newBench }, coinsEarned }, logs);
}

function handlePlayerKO(state, logs) {
  const { player, opponent } = state;
  const opp = OPPONENTS[state.opponentIndex];
  const newOpponent = { ...opponent, prizesTaken: opponent.prizesTaken + 1 };
  logs.push(`💔 ${CARDS[player.active?.cardId]?.name} is Knocked Out!`);
  logs.push(`${opp.name} takes a Prize! (${newOpponent.prizesTaken}/${newOpponent.prizesTotal})`);

  const newDiscard = [...player.discard, player.active.cardId, ...player.active.attachedEnergy];
  let newPlayer = { ...player, active: null, discard: newDiscard };

  if (newOpponent.prizesTaken >= newOpponent.prizesTotal) {
    logs.push(`😞 ${opp.name} took all Prize cards! You lose...`);
    return addLogs({ ...state, player: newPlayer, opponent: newOpponent, gameOver: true, winner: 'opponent' }, logs);
  }
  if (player.bench.length === 0) {
    logs.push(`😞 No creatures left! You lose...`);
    return addLogs({ ...state, player: newPlayer, opponent: newOpponent, gameOver: true, winner: 'opponent' }, logs);
  }
  return addLogs({ ...state, player: newPlayer, opponent: newOpponent, pendingAction: { type: 'promote', reason: 'ko' } }, logs);
}

// ── AI turn ───────────────────────────────────────────────────────────────
function startPlayerTurn(state) {
  const result = drawOneCard(state.player);
  if (result.deckEmpty) return { ...state, gameOver: true, winner: 'opponent', log: [...(state.log || []), '😞 Deck is empty! You lose!'] };
  let next = { ...state, player: { ...result.player, hasAttachedEnergy: false, hasPlayedSupporter: false, hasAttacked: false }, turn: 'player', turnNumber: (state.turnNumber || 1) + 1 };

  // Burn tick on player's active
  if (next.player.active?.statusEffects?.burned) {
    const logs = [`🔥 ${CARDS[next.player.active.cardId]?.name} takes 10 burn damage!`];
    const newHp = next.player.active.currentHp - 10;
    next.player = { ...next.player, active: { ...next.player.active, currentHp: newHp } };
    if (newHp <= 0) { next.player.active.currentHp = 0; next = handlePlayerKO(next, logs); return next; }
    next = addLogs(next, logs);
  }
  return next;
}

function processAITurn(state) {
  let next = { ...state };
  const logs = [];
  const opp = OPPONENTS[next.opponentIndex];
  if (!next.opponent.active) return addLogs(startPlayerTurn(next), logs);

  // Burn on opponent's active
  if (next.opponent.active.statusEffects?.burned) {
    const burnHp = next.opponent.active.currentHp - 10;
    logs.push(`🔥 ${CARDS[next.opponent.active.cardId]?.name} takes 10 burn damage!`);
    next.opponent = { ...next.opponent, active: { ...next.opponent.active, currentHp: burnHp } };
    if (burnHp <= 0) {
      next.opponent.active.currentHp = 0;
      next = handleOpponentKO(next, logs);
      if (next.gameOver) return addLogs(next, []);
      return addLogs(startPlayerTurn(next), logs);
    }
  }

  // AI attaches 1 energy (matching its creature type)
  const aiCard = CARDS[next.opponent.active.cardId];
  const energyCardId = aiCard.type + '_energy';
  next.opponent = { ...next.opponent, active: { ...next.opponent.active, attachedEnergy: [...next.opponent.active.attachedEnergy, energyCardId] } };

  // Find strongest affordable attack
  const affordable = aiCard.attacks.filter(atk => canAffordAttack(atk.cost, next.opponent.active.attachedEnergy));
  if (affordable.length === 0) {
    logs.push(`⚡ ${opp.name}'s ${aiCard.name} gathers energy...`);
    return addLogs(startPlayerTurn(next), logs);
  }

  const attack = affordable[affordable.length - 1];
  if (!next.player.active) return addLogs(startPlayerTurn(next), logs);

  const playerCreature = CARDS[next.player.active.cardId];
  const reduceDmg = next.player.active.statusEffects?.reduceDmg || 0;
  let dmg = attack.damage;
  if (playerCreature && WEAKNESS_CHART[playerCreature.type] === aiCard.type) { dmg += WEAKNESS_BONUS; logs.push(`⚡ Weakness! +${WEAKNESS_BONUS} damage!`); }
  dmg = Math.max(0, dmg - reduceDmg);
  if (reduceDmg > 0) {
    next.player = { ...next.player, active: { ...next.player.active, statusEffects: { ...next.player.active.statusEffects, reduceDmg: 0 } } };
    logs.push(`🛡️ Shield absorbs ${reduceDmg}!`);
  }
  logs.push(`⚔️ ${opp.name}: ${aiCard.name} uses ${attack.name}! ${dmg} damage!`);

  const newHp = next.player.active.currentHp - dmg;
  next.player = { ...next.player, active: { ...next.player.active, currentHp: newHp } };

  if (attack.effect === 'burn_10') { next.player = { ...next.player, active: { ...next.player.active, statusEffects: { ...next.player.active.statusEffects, burned: true } } }; logs.push(`🔥 ${playerCreature.name} is burned!`); }
  if (attack.effect === 'bench_10') { next.player = { ...next.player, bench: next.player.bench.map(b => ({ ...b, currentHp: Math.max(0, b.currentHp - 10) })) }; logs.push(`💥 Bench takes 10 spread damage!`); }
  if (attack.effect === 'self_20') {
    const selfHp = next.opponent.active.currentHp - 20;
    next.opponent = { ...next.opponent, active: { ...next.opponent.active, currentHp: selfHp } };
    logs.push(`💥 ${aiCard.name} takes 20 recoil!`);
    if (selfHp <= 0) { next.opponent.active.currentHp = 0; next = handleOpponentKO(next, logs); if (next.gameOver) return addLogs(next, []); return addLogs(startPlayerTurn(next), logs); }
  }

  if (newHp <= 0) {
    next.player = { ...next.player, active: { ...next.player.active, currentHp: 0 } };
    next = handlePlayerKO(next, logs);
    if (next.gameOver || next.pendingAction) return addLogs(next, []);
  }
  return addLogs(startPlayerTurn(next), logs);
}

// ── Player actions ─────────────────────────────────────────────────────────
function doAttachEnergy(state, handIndex, target, targetIndex) {
  const { player } = state;
  const cardId = player.hand[handIndex];
  if (!cardId || CARDS[cardId]?.cardType !== 'energy') return state;

  const newHand = [...player.hand]; newHand.splice(handIndex, 1);
  let newActive = player.active; let newBench = [...player.bench];
  const isRainbow = CARDS[cardId].energyType === 'rainbow';

  if (target === 'active' && player.active) {
    newActive = { ...player.active, attachedEnergy: [...player.active.attachedEnergy, cardId] };
    if (isRainbow) newActive = { ...newActive, currentHp: Math.max(0, newActive.currentHp - 10) };
  } else if (target === 'bench' && player.bench[targetIndex]) {
    const b = player.bench[targetIndex];
    newBench[targetIndex] = { ...b, attachedEnergy: [...b.attachedEnergy, cardId] };
    if (isRainbow) newBench[targetIndex] = { ...newBench[targetIndex], currentHp: Math.max(0, newBench[targetIndex].currentHp - 10) };
  } else return state;

  const targetName = target === 'active' ? CARDS[newActive.cardId]?.name : CARDS[newBench[targetIndex]?.cardId]?.name;
  return addLogs({ ...state, player: { ...player, hand: newHand, active: newActive, bench: newBench, hasAttachedEnergy: true }, pendingAction: null }, [`⚡ ${CARDS[cardId]?.name} attached to ${targetName}.`]);
}

function doPlaceBench(state, handIndex) {
  const { player } = state;
  if (player.bench.length >= MAX_BENCH) return state;
  const cardId = player.hand[handIndex];
  if (!cardId || CARDS[cardId]?.cardType !== 'creature') return state;
  const newHand = [...player.hand]; newHand.splice(handIndex, 1);
  return addLogs({ ...state, player: { ...player, hand: newHand, bench: [...player.bench, makeCreature(cardId)] } }, [`📋 ${CARDS[cardId]?.name} placed on Bench.`]);
}

function doPlayTrainer(state, handIndex) {
  const { player } = state;
  const cardId = player.hand[handIndex];
  const card = CARDS[cardId];
  if (!card || card.cardType !== 'trainer') return state;
  if (card.trainerType === 'supporter' && player.hasPlayedSupporter) return addLogs(state, [`⚠️ Already played a Supporter this turn.`]);

  const newHand = [...player.hand]; newHand.splice(handIndex, 1);
  let next = { ...state, player: { ...player, hand: newHand, discard: [...player.discard, cardId], hasPlayedSupporter: card.trainerType === 'supporter' ? true : player.hasPlayedSupporter } };
  const logs = [`🃏 Played ${card.name}.`];

  switch (card.effect) {
    case 'heal_30': {
      if (!next.player.active) break;
      const h = Math.min(next.player.active.maxHp, next.player.active.currentHp + 30);
      next.player = { ...next.player, active: { ...next.player.active, currentHp: h } };
      logs.push(`💚 Healed 30 HP → ${h}/${next.player.active.maxHp}`);
      break;
    }
    case 'heal_60_discard': {
      if (!next.player.active) break;
      const e0 = next.player.active.attachedEnergy[0];
      const h2 = Math.min(next.player.active.maxHp, next.player.active.currentHp + 60);
      next.player = { ...next.player, active: { ...next.player.active, currentHp: h2, attachedEnergy: next.player.active.attachedEnergy.slice(1) }, discard: e0 ? [...next.player.discard, e0] : next.player.discard };
      logs.push(`💚 Healed 60 HP.${e0 ? ' 1 energy discarded.' : ''}`);
      break;
    }
    case 'heal_full_discard_all': {
      if (!next.player.active) break;
      const allE = [...next.player.active.attachedEnergy];
      next.player = { ...next.player, active: { ...next.player.active, currentHp: next.player.active.maxHp, attachedEnergy: [] }, discard: [...next.player.discard, ...allE] };
      logs.push(`💚 Fully healed! ${allE.length} energy discarded.`);
      break;
    }
    case 'switch': {
      if (next.player.bench.length === 0) { logs.push(`⚠️ No Bench creatures to switch with!`); return addLogs({ ...state }, logs); }
      next = { ...next, pendingAction: { type: 'promote', reason: 'switch' } };
      logs.push(`🔄 Choose a Bench creature to switch in.`);
      break;
    }
    case 'retrieve_energy': {
      let disc = [...next.player.discard]; const retrieved = [];
      for (let i = disc.length - 1; i >= 0 && retrieved.length < 2; i--) { if (CARDS[disc[i]]?.cardType === 'energy') { retrieved.push(disc.splice(i, 1)[0]); } }
      next.player = { ...next.player, hand: [...next.player.hand, ...retrieved], discard: disc };
      logs.push(`♻️ Retrieved ${retrieved.length} Energy card(s).`);
      break;
    }
    case 'search_creature': {
      const found = next.player.drawPile.find(id => CARDS[id]?.cardType === 'creature');
      if (!found) { logs.push(`⚠️ No creatures in deck!`); break; }
      next.player = { ...next.player, hand: [...next.player.hand, found], drawPile: shuffle(next.player.drawPile.filter(id => id !== found)) };
      logs.push(`🔍 Found ${CARDS[found]?.name}!`);
      break;
    }
    case 'ultra_ball': {
      let h = [...next.player.hand]; const toDisc = [];
      for (let i = 0; i < h.length && toDisc.length < 2; i++) { if (CARDS[h[i]]?.cardType !== 'creature') toDisc.push(i); }
      for (let i = 0; i < h.length && toDisc.length < 2; i++) { if (!toDisc.includes(i)) toDisc.push(i); }
      const discarded = toDisc.map(i => h[i]);
      h = h.filter((_, i) => !toDisc.includes(i));
      const found2 = next.player.drawPile.find(id => CARDS[id]?.cardType === 'creature');
      if (!found2) { logs.push(`⚠️ No creatures in deck for Ultra Ball!`); break; }
      next.player = { ...next.player, hand: [...h, found2], drawPile: shuffle(next.player.drawPile.filter(id => id !== found2)), discard: [...next.player.discard, ...discarded] };
      logs.push(`🔍 Ultra Ball! Discarded ${discarded.length} cards, found ${CARDS[found2]?.name}!`);
      break;
    }
    case 'draw_7_discard': {
      const old = [...next.player.hand];
      const pool = shuffle([...next.player.drawPile, ...next.player.discard]);
      const drawn = pool.splice(0, 7);
      next.player = { ...next.player, hand: drawn, drawPile: pool, discard: [...old] };
      logs.push(`📚 Discarded hand, drew 7 cards!`);
      break;
    }
    case 'marnie': {
      const pool2 = shuffle([...next.player.hand, ...next.player.drawPile]);
      next.player = { ...next.player, hand: pool2.splice(0, 5), drawPile: pool2 };
      logs.push(`🔀 Marnie! Drew 5 new cards.`);
      break;
    }
    case 'boss': {
      if (next.opponent.bench.length === 0) { logs.push(`⚠️ No Bench creatures to Boss out!`); break; }
      const ri = Math.floor(Math.random() * next.opponent.bench.length);
      const newOppActive = next.opponent.bench[ri];
      const newOppBench = [...next.opponent.bench]; newOppBench.splice(ri, 1, next.opponent.active);
      next.opponent = { ...next.opponent, active: newOppActive, bench: newOppBench };
      logs.push(`👑 Boss's Orders! ${CARDS[newOppActive.cardId]?.name} forced Active!`);
      break;
    }
    default: break;
  }
  return addLogs(next, logs);
}

function doAttack(state, attackIndex) {
  const { player, opponent } = state;
  if (!player.active || !opponent.active) return state;
  if (player.hasAttacked) return addLogs(state, [`⚠️ Already attacked this turn.`]);
  const playerCard = CARDS[player.active.cardId];
  const attack = playerCard.attacks[attackIndex];
  if (!attack) return state;
  if (!canAffordAttack(attack.cost, player.active.attachedEnergy)) return addLogs(state, [`⚠️ Not enough energy for ${attack.name}.`]);

  const logs = []; let next = { ...state, player: { ...player, hasAttacked: true } };

  // Confused check
  if (player.active.statusEffects?.confused) {
    if (Math.random() < 0.5) {
      logs.push(`😵 Confusion! ${playerCard.name} hurts itself for 30!`);
      const selfHp = player.active.currentHp - 30;
      next.player = { ...next.player, active: { ...next.player.active, currentHp: selfHp, statusEffects: { ...next.player.active.statusEffects, confused: false } } };
      if (selfHp <= 0) { next.player.active.currentHp = 0; next = handlePlayerKO(next, logs); }
      return addLogs(next, logs);
    }
    next.player = { ...next.player, active: { ...next.player.active, statusEffects: { ...next.player.active.statusEffects, confused: false } } };
    logs.push(`💪 Snapped out of confusion!`);
  }

  const oppCard = CARDS[opponent.active.cardId];
  const reduceDmg = opponent.active.statusEffects?.reduceDmg || 0;
  let dmg = attack.damage;
  if (oppCard && WEAKNESS_CHART[oppCard.type] === playerCard.type) { dmg += WEAKNESS_BONUS; logs.push(`⚡ Type advantage! +${WEAKNESS_BONUS} damage!`); }
  dmg = Math.max(0, dmg - reduceDmg);
  if (reduceDmg > 0) { next.opponent = { ...next.opponent, active: { ...next.opponent.active, statusEffects: { ...next.opponent.active.statusEffects, reduceDmg: 0 } } }; }

  logs.push(`⚔️ ${playerCard.name} uses ${attack.name}! ${dmg} damage to ${oppCard.name}!`);
  const newOppHp = opponent.active.currentHp - dmg;
  next.opponent = { ...next.opponent, active: { ...next.opponent.active, currentHp: newOppHp } };

  if (attack.effect === 'burn_10') { next.opponent = { ...next.opponent, active: { ...next.opponent.active, statusEffects: { ...next.opponent.active.statusEffects, burned: true } } }; logs.push(`🔥 ${oppCard.name} is burned! (10 dmg/turn)`); }
  if (attack.effect === 'confuse') { next.opponent = { ...next.opponent, active: { ...next.opponent.active, statusEffects: { ...next.opponent.active.statusEffects, confused: true } } }; logs.push(`😵 ${oppCard.name} is confused!`); }
  if (attack.effect === 'reduce_30') { next.player = { ...next.player, active: { ...next.player.active, statusEffects: { ...next.player.active.statusEffects, reduceDmg: 30 } } }; logs.push(`🛡️ ${playerCard.name} braces! -30 on next hit.`); }
  if (attack.effect === 'reduce_20') { next.player = { ...next.player, active: { ...next.player.active, statusEffects: { ...next.player.active.statusEffects, reduceDmg: 20 } } }; logs.push(`🛡️ ${playerCard.name} braces! -20 on next hit.`); }
  if (attack.effect === 'bench_10') { next.opponent = { ...next.opponent, bench: next.opponent.bench.map(b => ({ ...b, currentHp: Math.max(0, b.currentHp - 10) })) }; logs.push(`💥 Spread! Bench takes 10.`); }
  if (attack.effect === 'self_20') {
    const selfHp = next.player.active.currentHp - 20;
    next.player = { ...next.player, active: { ...next.player.active, currentHp: selfHp } };
    logs.push(`💥 ${playerCard.name} takes 20 recoil!`);
    if (selfHp <= 0) { next.player.active.currentHp = 0; next = handlePlayerKO(next, logs); if (next.gameOver || next.pendingAction) return addLogs(next, []); }
  }
  if (attack.effect === 'discard_2_energy') {
    const disc2 = next.player.active.attachedEnergy.slice(0, 2);
    next.player = { ...next.player, active: { ...next.player.active, attachedEnergy: next.player.active.attachedEnergy.slice(2) }, discard: [...next.player.discard, ...disc2] };
    logs.push(`♟️ Discarded 2 energy from ${playerCard.name}.`);
  }

  if (newOppHp <= 0) { next.opponent = { ...next.opponent, active: { ...next.opponent.active, currentHp: 0 } }; next = handleOpponentKO(next, logs); }
  return addLogs(next, logs);
}

function doRetreat(state, benchIndex) {
  const { player } = state;
  if (!player.active || benchIndex < 0 || benchIndex >= player.bench.length) return state;
  const card = CARDS[player.active.cardId];
  const cost = card.retreatCost;
  if (player.active.attachedEnergy.length < cost) return addLogs(state, [`⚠️ Need ${cost} energy to retreat. Only ${player.active.attachedEnergy.length} attached.`]);
  const energyDiscard = player.active.attachedEnergy.slice(0, cost);
  const remainE = player.active.attachedEnergy.slice(cost);
  const oldActive = { ...player.active, attachedEnergy: remainE };
  const newActive = { ...player.bench[benchIndex] };
  const newBench = [...player.bench]; newBench.splice(benchIndex, 1, oldActive);
  return addLogs({ ...state, player: { ...player, active: newActive, bench: newBench, discard: [...player.discard, ...energyDiscard] } }, [`🔄 ${card.name} retreated. ${CARDS[newActive.cardId]?.name} is now Active!`]);
}

function doPromote(state, benchIndex) {
  const { player, pendingAction } = state;
  if (benchIndex < 0 || benchIndex >= player.bench.length) return state;
  const promoted = { ...player.bench[benchIndex] };
  const newBench = player.bench.filter((_, i) => i !== benchIndex);
  const logs = [`▲ ${CARDS[promoted.cardId]?.name} is now Active!`];
  if (pendingAction?.reason === 'switch') {
    const withOld = player.active ? [...newBench, player.active] : newBench;
    return addLogs({ ...state, player: { ...player, active: promoted, bench: withOld }, pendingAction: null }, logs);
  }
  // After KO — start player's turn
  return addLogs(startPlayerTurn({ ...state, player: { ...player, active: promoted, bench: newBench }, pendingAction: null }), logs);
}

// ── Build initial battle state ─────────────────────────────────────────────
export function buildBattleState(deckObj, opponentIndex = 0) {
  const deckArr = buildDeckArray(deckObj);
  function deal() {
    const sh = shuffle([...deckArr]);
    return { prizes: sh.splice(0, PRIZE_COUNT), hand: sh.splice(0, 7), drawPile: sh };
  }
  let { prizes, hand, drawPile } = deal();
  for (let t = 0; t < 5 && !hand.some(id => CARDS[id]?.cardType === 'creature'); t++) {
    ({ prizes, hand, drawPile } = deal());
  }
  const creatures = hand.filter(id => CARDS[id]?.cardType === 'creature');
  const others = hand.filter(id => CARDS[id]?.cardType !== 'creature');
  const activeId = creatures[0];
  const benchIds = creatures.slice(1, 1 + MAX_BENCH);
  const opp = OPPONENTS[opponentIndex];
  return {
    opponentIndex,
    player: { active: activeId ? makeCreature(activeId) : null, bench: benchIds.map(makeCreature), hand: [...others, ...creatures.slice(1 + MAX_BENCH)], drawPile, discard: [], prizes, prizesTaken: 0, hasAttachedEnergy: false, hasPlayedSupporter: false, hasAttacked: false },
    opponent: { active: { ...opp.team[0], statusEffects: { burned: false, confused: false, reduceDmg: 0 } }, bench: opp.team.slice(1).map(t => ({ ...t, statusEffects: { burned: false, confused: false, reduceDmg: 0 } })), prizesTotal: opp.prize, prizesTaken: 0 },
    turn: 'player', turnNumber: 1,
    log: [`⚔️ Battle against ${opp.name}! SCAN AND FIGHT!`],
    gameOver: false, winner: null, coinsEarned: 0, pendingAction: null,
  };
}

// ── UI helpers ─────────────────────────────────────────────────────────────
function HpBar({ current, max, color, h = 8 }) {
  const pct = Math.max(0, current / max);
  const barColor = pct > 0.5 ? color : pct > 0.25 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 3, height: h, overflow: 'hidden', border: `1px solid #2a2a2a` }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.3s', boxShadow: `0 0 4px ${barColor}88` }} />
      </div>
      <span style={{ fontSize: 9, color: C.muted, whiteSpace: 'nowrap' }}>{current}/{max}</span>
    </div>
  );
}

function EnergyDot({ type, size = 9 }) {
  const t = TRIBE[type] || TRIBE.shadow;
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: t.primary, border: '1px solid rgba(255,255,255,0.2)', boxShadow: `0 0 3px ${t.primary}88` }} title={type} />;
}

function StatusBadges({ effects }) {
  if (!effects) return null;
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {effects.burned && <span style={{ fontSize: 8, background: '#7f1d1d', color: '#fca5a5', padding: '1px 4px', borderRadius: 3 }}>🔥BURN</span>}
      {effects.confused && <span style={{ fontSize: 8, background: '#4c1d95', color: '#ddd6fe', padding: '1px 4px', borderRadius: 3 }}>😵CNFSD</span>}
      {effects.reduceDmg > 0 && <span style={{ fontSize: 8, background: '#1e3a5f', color: '#93c5fd', padding: '1px 4px', borderRadius: 3 }}>🛡️-{effects.reduceDmg}</span>}
    </span>
  );
}

function CreaturePanel({ creature, tribe, isPlayer, attacks, onAttack, canAttack, isActive, isPending, onClick }) {
  if (!creature) {
    return (
      <div onClick={isPending ? onClick : undefined} style={{ border: `2px dashed ${isPending ? tribe.primary : '#2a2a2a'}`, borderRadius: 8, padding: '12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 120, cursor: isPending ? 'pointer' : 'default', background: isPending ? tribe.primary + '11' : 'transparent', color: isPending ? tribe.primary : C.muted, fontSize: 11 }}>
        {isPending ? '▲ Promote here' : 'Empty'}
      </div>
    );
  }
  const card = CARDS[creature.cardId];
  const t = TRIBE[card.type] || tribe;
  return (
    <div onClick={onClick} style={{ background: `linear-gradient(135deg, ${t.dark}, #0f0f0f)`, border: `2px solid ${isActive && isPending ? '#fff' : t.primary}`, borderRadius: 8, padding: '8px 10px', minWidth: isActive ? 200 : 120, cursor: onClick ? 'pointer' : 'default', boxShadow: isActive ? `0 0 12px ${t.primary}55` : 'none', transition: 'box-shadow 0.2s' }}>
      {/* Name row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 7, color: t.primary, textTransform: 'uppercase', letterSpacing: 0.8 }}>{t.icon} {t.name}</div>
          <div style={{ fontSize: isActive ? 12 : 10, fontWeight: 'bold', color: C.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{card.name}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 'bold', color: C.amber }}>⚡{creature.currentHp}</div>
      </div>
      <HpBar current={creature.currentHp} max={creature.maxHp} color={t.primary} h={5} />
      {/* Attached energy */}
      <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
        {creature.attachedEnergy.map((e, i) => <EnergyDot key={i} type={CARDS[e]?.energyType || 'rainbow'} />)}
        {creature.attachedEnergy.length === 0 && <span style={{ fontSize: 7, color: '#2a2a2a' }}>no energy</span>}
      </div>
      {/* Status */}
      <div style={{ marginTop: 3 }}><StatusBadges effects={creature.statusEffects} /></div>
      {/* Attacks (player active only) */}
      {isPlayer && isActive && attacks && (
        <div style={{ marginTop: 6, borderTop: `1px solid ${t.primary}33`, paddingTop: 6 }}>
          {card.attacks.map((atk, i) => {
            const affordable = canAffordAttack(atk.cost, creature.attachedEnergy);
            return (
              <button key={i} onClick={e => { e.stopPropagation(); onAttack && onAttack(i); }}
                disabled={!affordable || !canAttack}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: affordable && canAttack ? t.primary + '22' : 'transparent', border: `1px solid ${affordable && canAttack ? t.primary : '#2a2a2a'}`, borderRadius: 5, padding: '4px 6px', marginBottom: 3, cursor: affordable && canAttack ? 'pointer' : 'not-allowed', opacity: affordable && canAttack ? 1 : 0.5 }}>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {atk.cost.map((c2, ci) => <EnergyDot key={ci} type={c2 === 'any' ? 'rainbow' : c2} size={7} />)}
                  <span style={{ fontSize: 9, color: C.text, marginLeft: 3 }}>{atk.name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 'bold', color: affordable && canAttack ? C.amber : C.muted }}>{atk.damage}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Battle Component ──────────────────────────────────────────────────
export default function Battle({ state, onUpdateBattle, onEndBattle }) {
  const { player, opponent, turn, turnNumber, log, gameOver, winner, coinsEarned, pendingAction, opponentIndex } = state;
  const opp = OPPONENTS[opponentIndex] || OPPONENTS[0];
  const oppTribe = TRIBE[CARDS[opponent.active?.cardId]?.type] || TRIBE.chaos;
  const playerTribe = TRIBE[CARDS[player.active?.cardId]?.type] || TRIBE.shadow;

  const canDoActions = turn === 'player' && !gameOver && !pendingAction;
  const canAttack = canDoActions && !player.hasAttacked && !!player.active && !!opponent.active;
  const isSelectingEnergy = pendingAction?.type === 'attachEnergy';
  const isPromoting = pendingAction?.type === 'promote';

  function update(newState) { onUpdateBattle(newState); }

  function handleHandClick(i) {
    if (gameOver) return;
    const cardId = player.hand[i];
    const card = CARDS[cardId];
    if (!card) return;

    if (isSelectingEnergy) {
      // Cancel selection if clicking same card
      if (i === pendingAction.handIndex) { update({ ...state, pendingAction: null }); return; }
    }

    if (!isSelectingEnergy && !isPromoting) {
      if (card.cardType === 'energy' && !player.hasAttachedEnergy) {
        update({ ...state, pendingAction: { type: 'attachEnergy', handIndex: i, cardId } });
        return;
      }
      if (card.cardType === 'trainer') { update(doPlayTrainer(state, i)); return; }
      if (card.cardType === 'creature' && player.bench.length < MAX_BENCH) { update(doPlaceBench(state, i)); return; }
    }
  }

  function handleCreatureClick(target, idx = 0) {
    if (isSelectingEnergy && pendingAction) {
      update(doAttachEnergy(state, pendingAction.handIndex, target, idx));
    } else if (isPromoting) {
      if (target === 'bench') update(doPromote(state, idx));
    }
  }

  function handleAttack(attackIndex) { if (canAttack) update(doAttack(state, attackIndex)); }
  function handleEndTurn() { if (!canDoActions && !canAttack) return; update(processAITurn({ ...state, turn: 'opponent' })); }
  function handleRetreat(benchIndex) { update(doRetreat(state, benchIndex)); }

  const s = {
    root: { display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.text, overflow: 'hidden' },
    section: (tribe) => ({ background: `linear-gradient(180deg, ${tribe.dark} 0%, #0a0a0a 100%)`, borderBottom: `1px solid ${tribe.primary}44`, padding: '10px 14px', flexShrink: 0 }),
    sectionLabel: (color) => ({ fontSize: 8, color, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }),
    divider: { background: `linear-gradient(90deg, transparent, ${C.orange}, transparent)`, height: 2, flexShrink: 0, boxShadow: `0 0 8px ${C.orange}66` },
    handArea: { background: '#0a0800', borderTop: `1px solid ${C.border}`, padding: '8px 12px', flexShrink: 0 },
    handScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
    logArea: { background: '#060600', borderTop: `1px solid ${C.border}`, padding: '6px 12px', minHeight: 60, maxHeight: 90, overflowY: 'auto', flexShrink: 0 },
    logLine: { fontSize: 10, color: C.muted, lineHeight: 1.6 },
    actionBar: { display: 'flex', gap: 8, padding: '8px 12px', background: '#0c0800', borderTop: `2px solid ${C.orange}`, flexShrink: 0 },
    btn: (color, disabled) => ({ background: disabled ? '#1a1a1a' : color + '22', color: disabled ? '#3a3a3a' : color, border: `1px solid ${disabled ? '#2a2a2a' : color}`, borderRadius: 6, padding: '7px 16px', fontSize: 11, fontWeight: 'bold', cursor: disabled ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: 1 }),
    prizeRow: { display: 'flex', gap: 3, alignItems: 'center' },
    prizeDot: (taken, total) => (i) => ({ width: 8, height: 8, borderRadius: '50%', background: i < taken ? C.orange : '#2a2a2a', border: `1px solid ${i < taken ? C.orange : '#3a3a3a'}' ` }),
  };

  if (gameOver) {
    const isWin = winner === 'player';
    return (
      <div style={{ ...s.root, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{isWin ? '🏆' : '💀'}</div>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 6 }}>Battle Over</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: isWin ? C.orange : C.red, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>{isWin ? 'VICTORY' : 'DEFEAT'}</div>
          {isWin && <div style={{ fontSize: 16, color: C.amber, marginBottom: 20 }}>💰 +{coinsEarned} coins earned!</div>}
          <div style={{ height: 2, background: isWin ? C.orange : C.red, boxShadow: `0 0 8px ${isWin ? C.orange : C.red}`, marginBottom: 24 }} />
          <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: 20 }}>
            {log.slice(-8).map((l, i) => <div key={i} style={s.logLine}>{l}</div>)}
          </div>
          <button onClick={() => onEndBattle(isWin, coinsEarned)} style={{ background: isWin ? C.orange : '#3a1a1a', color: isWin ? '#000' : C.red, border: 'none', borderRadius: 8, padding: '12px 40px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 2 }}>
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  if (isPromoting) {
    return (
      <div style={{ ...s.root }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0a0500' }}>
          <div style={{ fontSize: 10, color: C.orange, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
            {pendingAction.reason === 'ko' ? '⚠️ Your creature was knocked out!' : '🔄 Switch — Choose your new Active'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: C.amber, marginBottom: 20, textTransform: 'uppercase' }}>
            {pendingAction.reason === 'ko' ? 'Promote a Bench Creature' : 'Choose Bench Creature to Switch In'}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {player.bench.map((b, i) => (
              <div key={i} onClick={() => handleCreatureClick('bench', i)} style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <CardDisplay cardId={b.cardId} showHpBar currentHp={b.currentHp} maxHp={b.maxHp} attached={b.attachedEnergy} selected />
              </div>
            ))}
          </div>
          {pendingAction.reason === 'switch' && player.active && (
            <div style={{ marginTop: 16, fontSize: 11, color: C.muted }}>Current active ({CARDS[player.active.cardId]?.name}) will go to Bench.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      {/* Opponent section */}
      <div style={s.section(oppTribe)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={s.sectionLabel(oppTribe.primary)}>{oppTribe.icon} {opp.name}</div>
            <div style={{ fontSize: 8, color: C.muted }}>{opp.subtitle}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: C.muted, marginBottom: 3 }}>Prizes taken</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: opponent.prizesTotal }).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < opponent.prizesTaken ? C.orange : '#2a2a2a', border: `1px solid ${i < opponent.prizesTaken ? C.orange : '#333'}` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {opponent.active ? (
            <CreaturePanel creature={opponent.active} tribe={oppTribe} isPlayer={false} isActive />
          ) : (
            <div style={{ color: C.muted, fontSize: 11 }}>No active creature</div>
          )}
          {opponent.bench.map((b, i) => (
            <CreaturePanel key={i} creature={b} tribe={TRIBE[CARDS[b.cardId]?.type] || oppTribe} isPlayer={false} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ ...s.divider, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 0' }}>
        <span style={{ fontSize: 9, color: C.orange, textTransform: 'uppercase', letterSpacing: 2, background: C.bg, padding: '0 10px' }}>
          Turn {turnNumber} — {turn === 'player' ? 'Your Turn' : "Opponent's Turn"}
        </span>
      </div>

      {/* Player section */}
      <div style={{ ...s.section(playerTribe), flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={s.sectionLabel(playerTribe.primary)}>Your Field</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: C.muted, marginBottom: 3 }}>Prizes taken: {player.prizesTaken}/{opponent.prizesTotal}</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: opponent.prizesTotal }).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < player.prizesTaken ? C.green : '#2a2a2a', border: `1px solid ${i < player.prizesTaken ? C.green : '#333'}` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 8 }}>
          {player.active ? (
            <CreaturePanel
              creature={player.active} tribe={playerTribe} isPlayer isActive
              attacks={player.active} canAttack={canAttack}
              onAttack={handleAttack}
              onClick={isSelectingEnergy ? () => handleCreatureClick('active') : undefined}
              isPending={isSelectingEnergy}
            />
          ) : (
            <div style={{ border: `2px dashed ${C.muted}`, borderRadius: 8, padding: 20, fontSize: 11, color: C.muted }}>No Active</div>
          )}
          {player.bench.map((b, i) => (
            <CreaturePanel key={i} creature={b} tribe={TRIBE[CARDS[b.cardId]?.type] || playerTribe} isPlayer
              onClick={isSelectingEnergy ? () => handleCreatureClick('bench', i) : undefined}
              isPending={isSelectingEnergy}
            />
          ))}
          {/* Retreat buttons under bench */}
          {canDoActions && !player.hasAttacked && player.bench.length > 0 && player.active && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'flex-end' }}>
              {player.bench.map((b, i) => {
                const rCost = CARDS[player.active.cardId]?.retreatCost || 0;
                const canRet = player.active.attachedEnergy.length >= rCost;
                return (
                  <button key={i} onClick={() => canRet && handleRetreat(i)} disabled={!canRet}
                    style={s.btn(C.muted, !canRet)}>
                    Retreat → {CARDS[b.cardId]?.name?.slice(0, 8)} (cost:{rCost})
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ fontSize: 9, color: C.muted }}>
          Deck: {player.drawPile.length} · Discard: {player.discard.length} · Prizes left: {player.prizes.length}
          {player.hasAttachedEnergy && ' · ⚡ Energy attached'}{player.hasPlayedSupporter && ' · 🧙 Supporter played'}
        </div>
      </div>

      {/* Action bar */}
      <div style={s.actionBar}>
        <button onClick={handleEndTurn} disabled={!canDoActions && turn !== 'player'} style={s.btn(C.orange, !canDoActions)}>
          {player.hasAttacked ? '▶ End Turn' : '▶ Skip & End Turn'}
        </button>
        {isSelectingEnergy && (
          <div style={{ fontSize: 10, color: C.amber, padding: '7px 10px', border: `1px solid ${C.amber}`, borderRadius: 6 }}>
            ⚡ Click a creature to attach {CARDS[pendingAction.cardId]?.name} — or click card again to cancel
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 9, color: C.muted }}>
          {player.hasAttacked ? '✓ Attacked' : canAttack ? '• Attack available' : ''}
        </div>
      </div>

      {/* Hand */}
      <div style={s.handArea}>
        <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Hand ({player.hand.length} cards)
          {isSelectingEnergy && <span style={{ color: C.amber }}> — Click energy again to cancel, or click a creature above</span>}
        </div>
        <div style={s.handScroll}>
          {player.hand.length === 0 && <span style={{ color: C.muted, fontSize: 11 }}>No cards in hand</span>}
          {player.hand.map((cardId, i) => {
            const card = CARDS[cardId];
            if (!card) return null;
            const isEnergy = card.cardType === 'energy';
            const isThisSelected = isSelectingEnergy && pendingAction?.handIndex === i;
            const canPlay = canDoActions && (
              (isEnergy && !player.hasAttachedEnergy) ||
              (card.cardType === 'trainer') ||
              (card.cardType === 'creature' && player.bench.length < MAX_BENCH)
            );
            return (
              <div key={i} onClick={() => handleHandClick(i)}
                style={{ flexShrink: 0, cursor: canPlay || isThisSelected ? 'pointer' : 'default', transform: isThisSelected ? 'translateY(-8px)' : 'none', transition: 'transform 0.15s' }}>
                <CardDisplay cardId={cardId} compact selected={isThisSelected} disabled={!canPlay && !isThisSelected} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Log */}
      <div style={s.logArea}>
        {log.slice(-6).map((l, i) => <div key={i} style={s.logLine}>▸ {l}</div>)}
      </div>
    </div>
  );
}
