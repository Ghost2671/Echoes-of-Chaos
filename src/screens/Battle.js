import { useState } from 'react';
import { CARDS, ENEMIES } from '../gameData';
import { cardEffectivePower, clamp } from '../utils';
import CardDisplay from '../components/CardDisplay';

const PLAYER_MAX_HP = 80;
const MAX_ENERGY = 3;
const HAND_SIZE = 3;
const LEVEL_UP_USES = 5;

export function buildBattleState(deck) {
  const drawPile = [];
  for (const [cardId, count] of Object.entries(deck)) {
    for (let i = 0; i < count; i++) drawPile.push(cardId);
  }
  const shuffled = [...drawPile].sort(() => Math.random() - 0.5);
  const hand = shuffled.splice(0, HAND_SIZE);

  const enemy = { ...ENEMIES[0] };
  return {
    wave: 1,
    playerHp: PLAYER_MAX_HP,
    playerMaxHp: PLAYER_MAX_HP,
    playerShield: 0,
    playerWeakened: 0,
    energy: MAX_ENERGY,
    enemy: { ...enemy, shield: 0, burn: 0, burnTurns: 0, stunTurns: 0, enraged: false, moveIndex: 0 },
    drawPile: shuffled,
    hand,
    discardPile: [],
    log: ['⚔️ Battle begins! Wave 1 — Chaos Wraith emerges.'],
    gameOver: false,
    victory: false,
    coinsEarned: 0,
    turnNumber: 1,
  };
}

function getIntent(enemy) {
  const moves = ENEMIES.find(e => e.id === enemy.id)?.moves || [];
  return moves[enemy.moveIndex % moves.length];
}

function drawCards(state, count) {
  let { drawPile, discardPile, hand } = state;
  drawPile = [...drawPile];
  discardPile = [...discardPile];
  hand = [...hand];

  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = [...discardPile].sort(() => Math.random() - 0.5);
      discardPile = [];
    }
    hand.push(drawPile.shift());
  }
  return { drawPile, discardPile, hand };
}

export default function Battle({ state, onUpdateBattle, onEndBattle, cardProgress, onCardUsed }) {
  const [animCard, setAnimCard] = useState(null);

  const { wave, playerHp, playerMaxHp, playerShield, playerWeakened, energy, enemy, hand, drawPile, discardPile, log, gameOver, victory, coinsEarned, turnNumber } = state;
  const intent = getIntent(enemy);

  function addLog(msgs, base) {
    return { ...base, log: [...(base.log || log), ...msgs].slice(-40) };
  }

  function playCard(handIndex) {
    const cardId = hand[handIndex];
    const card = CARDS[cardId];
    if (!card || card.cost > energy) return;

    setAnimCard(handIndex);
    setTimeout(() => setAnimCard(null), 300);

    const eff = cardEffectivePower(card, cardProgress);
    const weakMult = playerWeakened > 0 ? 0.75 : 1;
    const logs = [];
    let next = { ...state };

    const newHand = hand.filter((_, i) => i !== handIndex);
    const newDiscard = [...discardPile, cardId];
    next = { ...next, hand: newHand, discardPile: newDiscard, energy: energy - card.cost };

    onCardUsed(cardId);

    const prog = cardProgress[cardId] || { level: 1, uses: 0 };
    const newUses = prog.uses + 1;
    if (newUses % LEVEL_UP_USES === 0) {
      logs.push(`✨ ${card.name} reached Level ${prog.level + 1}!`);
    }

    switch (card.type) {
      case 'attack': {
        const dmg = Math.floor(eff.value * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        const net = dmg - absorbed;
        next.enemy = { ...next.enemy, hp: next.enemy.hp - net, shield: next.enemy.shield - absorbed };
        logs.push(`⚔️ ${card.name}: ${dmg} damage${absorbed > 0 ? ` (${absorbed} blocked by shield)` : ''}.`);
        break;
      }
      case 'defense': {
        next.playerShield = next.playerShield + eff.value;
        logs.push(`🛡️ ${card.name}: +${eff.value} shield (total ${next.playerShield}).`);
        break;
      }
      case 'burn': {
        next.enemy = { ...next.enemy, burn: next.enemy.burn + eff.value, burnTurns: Math.max(next.enemy.burnTurns, card.turns) };
        logs.push(`🔥 ${card.name}: ${eff.value} burn × ${card.turns} turns applied.`);
        break;
      }
      case 'double': {
        const hit = Math.floor(eff.value * weakMult);
        const ab1 = Math.min(next.enemy.shield, hit);
        const n1 = hit - ab1;
        next.enemy = { ...next.enemy, hp: next.enemy.hp - n1, shield: next.enemy.shield - ab1 };
        const ab2 = Math.min(next.enemy.shield, hit);
        const n2 = hit - ab2;
        next.enemy = { ...next.enemy, hp: next.enemy.hp - n2, shield: next.enemy.shield - ab2 };
        logs.push(`⚡ ${card.name}: ${hit}+${hit} double strike.`);
        break;
      }
      case 'drain': {
        const dmg = Math.floor(eff.damage * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        const net = dmg - absorbed;
        next.enemy = { ...next.enemy, hp: next.enemy.hp - net, shield: next.enemy.shield - absorbed };
        next.playerHp = clamp(next.playerHp + eff.heal, 0, playerMaxHp);
        logs.push(`🩸 ${card.name}: ${dmg} damage, healed ${eff.heal} HP.`);
        break;
      }
      case 'surge': {
        const dmg = Math.floor(eff.value * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        next.enemy = { ...next.enemy, hp: next.enemy.hp - (dmg - absorbed), shield: next.enemy.shield - absorbed };
        next.energy = next.energy + card.energy;
        logs.push(`🌑 ${card.name}: ${dmg} damage, +${card.energy} energy.`);
        break;
      }
      case 'stun': {
        const dmg = Math.floor(eff.value * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        next.enemy = { ...next.enemy, hp: next.enemy.hp - (dmg - absorbed), shield: next.enemy.shield - absorbed, stunTurns: next.enemy.stunTurns + 1 };
        logs.push(`❄️ ${card.name}: Stunned! ${dmg} damage.`);
        break;
      }
      case 'heal': {
        next.playerHp = clamp(next.playerHp + eff.value, 0, playerMaxHp);
        logs.push(`💚 ${card.name}: Healed ${eff.value} HP.`);
        break;
      }
      case 'draw': {
        const dmg = Math.floor(eff.value * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        next.enemy = { ...next.enemy, hp: next.enemy.hp - (dmg - absorbed), shield: next.enemy.shield - absorbed };
        const drawn = drawCards({ drawPile: next.drawPile, discardPile: next.discardPile, hand: next.hand }, card.draw);
        next = { ...next, ...drawn };
        logs.push(`👁️ ${card.name}: ${dmg} damage, drew ${card.draw} cards.`);
        break;
      }
      case 'combo': {
        const dmg = Math.floor(eff.bonus * weakMult);
        const absorbed = Math.min(next.enemy.shield, dmg);
        next.enemy = { ...next.enemy, hp: next.enemy.hp - (dmg - absorbed), shield: next.enemy.shield - absorbed, burn: next.enemy.burn + eff.value, burnTurns: Math.max(next.enemy.burnTurns, card.turns) };
        logs.push(`🌀 ${card.name}: ${dmg} damage + ${eff.value} burn × ${card.turns}t.`);
        break;
      }
      default: break;
    }

    // Check enemy death
    if (next.enemy.hp <= 0) {
      next.enemy = { ...next.enemy, hp: 0 };
      const enemyDef = ENEMIES.find(e => e.id === next.enemy.id);
      const coinsGained = enemyDef?.reward || 20;
      next.coinsEarned = (next.coinsEarned || 0) + coinsGained;

      if (next.wave >= 6) {
        logs.push(`💀 ${next.enemy.name} destroyed! +${coinsGained} coins.`);
        logs.push(`🏆 All waves cleared! Victory!`);
        next = addLog(logs, { ...next, victory: true });
      } else {
        const nextWave = next.wave + 1;
        const nextEnemyDef = ENEMIES[nextWave - 1];
        const nextEnemy = { ...nextEnemyDef, shield: 0, burn: 0, burnTurns: 0, stunTurns: 0, enraged: false, moveIndex: 0 };
        logs.push(`💀 ${next.enemy.name} destroyed! +${coinsGained} coins.`);
        logs.push(`🌊 Wave ${nextWave}: ${nextEnemy.name} appears!`);
        const newDraw = drawCards({ drawPile: next.drawPile, discardPile: next.discardPile, hand: next.hand }, HAND_SIZE - next.hand.length);
        next = addLog(logs, { ...next, ...newDraw, enemy: nextEnemy, wave: nextWave, playerShield: 0, energy: MAX_ENERGY });
      }
    } else {
      next = addLog(logs, next);
    }

    onUpdateBattle(next);
  }

  function endTurn() {
    const logs = [];
    let next = { ...state };

    // Enemy burn damage
    if (next.enemy.burn > 0 && next.enemy.burnTurns > 0) {
      const burnDmg = next.enemy.burn;
      next.enemy = {
        ...next.enemy,
        hp: next.enemy.hp - burnDmg,
        burnTurns: next.enemy.burnTurns - 1,
        burn: next.enemy.burnTurns - 1 <= 0 ? 0 : next.enemy.burn,
      };
      logs.push(`🔥 ${next.enemy.name} takes ${burnDmg} burn damage.`);
    }

    // Check enemy death from burn
    if (next.enemy.hp <= 0) {
      next.enemy = { ...next.enemy, hp: 0 };
      const enemyDef = ENEMIES.find(e => e.id === next.enemy.id);
      const coinsGained = enemyDef?.reward || 20;
      next.coinsEarned = (next.coinsEarned || 0) + coinsGained;

      if (next.wave >= 6) {
        logs.push(`💀 ${next.enemy.name} burns to ash! +${coinsGained} coins.`);
        logs.push(`🏆 All waves cleared! Victory!`);
        onUpdateBattle(addLog(logs, { ...next, victory: true }));
        return;
      } else {
        const nextWave = next.wave + 1;
        const nextEnemyDef = ENEMIES[nextWave - 1];
        const nextEnemy = { ...nextEnemyDef, shield: 0, burn: 0, burnTurns: 0, stunTurns: 0, enraged: false, moveIndex: 0 };
        logs.push(`💀 ${next.enemy.name} burns to ash! +${coinsGained} coins.`);
        logs.push(`🌊 Wave ${nextWave}: ${nextEnemy.name} appears!`);
        const newDraw = drawCards({ drawPile: next.drawPile, discardPile: next.discardPile, hand: [] }, HAND_SIZE);
        onUpdateBattle(addLog(logs, { ...next, ...newDraw, enemy: nextEnemy, wave: nextWave, playerShield: 0, energy: MAX_ENERGY, playerWeakened: Math.max(0, next.playerWeakened - 1), turnNumber: next.turnNumber + 1 }));
        return;
      }
    }

    // Enemy action
    if (next.enemy.stunTurns > 0) {
      logs.push(`❄️ ${next.enemy.name} is stunned and skips their turn!`);
      next.enemy = { ...next.enemy, stunTurns: next.enemy.stunTurns - 1 };
    } else {
      const move = intent;
      const atkMult = next.enemy.enraged ? 1.5 : 1;

      switch (move.type) {
        case 'attack':
        case 'heavy': {
          let rawDmg = Math.floor((move.value || 10) * atkMult);
          const shieldAbsorb = Math.min(next.playerShield, rawDmg);
          const netDmg = rawDmg - shieldAbsorb;
          next.playerHp = clamp(next.playerHp - netDmg, 0, playerMaxHp);
          logs.push(`${move.icon} ${next.enemy.name} uses ${move.label}: ${rawDmg} damage${shieldAbsorb > 0 ? ` (${shieldAbsorb} blocked)` : ''}.`);
          break;
        }
        case 'shield': {
          next.enemy = { ...next.enemy, shield: next.enemy.shield + (move.value || 10) };
          logs.push(`${move.icon} ${next.enemy.name} ${move.label}: +${move.value} shield.`);
          break;
        }
        case 'heal': {
          const newHp = clamp(next.enemy.hp + (move.value || 20), 0, next.enemy.maxHp);
          next.enemy = { ...next.enemy, hp: newHp };
          logs.push(`${move.icon} ${next.enemy.name} ${move.label}: healed ${move.value} HP.`);
          break;
        }
        case 'debuff': {
          next.playerWeakened = 2;
          logs.push(`${move.icon} ${next.enemy.name} Weakens you! Your damage is reduced for 2 turns.`);
          break;
        }
        case 'enrage': {
          next.enemy = { ...next.enemy, enraged: true };
          logs.push(`${move.icon} ${next.enemy.name} ENRAGES! Attack power +50%.`);
          break;
        }
        default: break;
      }

      next.enemy = { ...next.enemy, moveIndex: next.enemy.moveIndex + 1 };
    }

    // Check player death
    if (next.playerHp <= 0) {
      logs.push(`💔 You have been defeated...`);
      onUpdateBattle(addLog(logs, { ...next, gameOver: true }));
      return;
    }

    // New turn: draw cards, restore energy, reset shield, tick weakened
    const drawn = drawCards({ drawPile: next.drawPile, discardPile: next.discardPile, hand: [] }, HAND_SIZE);
    next = {
      ...next,
      ...drawn,
      energy: MAX_ENERGY,
      playerShield: 0,
      playerWeakened: Math.max(0, next.playerWeakened - 1),
      turnNumber: next.turnNumber + 1,
    };
    logs.push(`🔋 New turn ${next.turnNumber}. Drew ${HAND_SIZE} cards.`);

    onUpdateBattle(addLog(logs, next));
  }

  const logRef = (el) => { if (el) el.scrollTop = el.scrollHeight; };

  const s = {
    root: { fontFamily: "'Segoe UI', sans-serif", background: '#0d0d1a', color: '#e0e0f0', minHeight: '100vh', padding: 16 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    waveTag: { background: '#1a1a2e', border: '1px solid #2d2d4d', borderRadius: 6, padding: '4px 12px', fontSize: 13, color: '#c084fc' },
    panels: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 },
    panel: { background: '#1a1a2e', border: '1px solid #2d2d4d', borderRadius: 10, padding: '12px 16px' },
    panelTitle: { fontSize: 10, textTransform: 'uppercase', color: '#6366f1', letterSpacing: 1, marginBottom: 8 },
    bar: { height: 8, borderRadius: 4, background: '#2d2d4d', overflow: 'hidden', marginBottom: 4 },
    fill: (pct, color) => ({ height: '100%', width: `${clamp(pct * 100, 0, 100)}%`, background: color, borderRadius: 4, transition: 'width 0.3s' }),
    energyDot: (on) => ({ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: on ? '#6366f1' : '#2d2d4d', margin: '0 2px' }),
    enemyName: { fontWeight: 'bold', fontSize: 15, color: '#f87171', marginBottom: 4 },
    intentBox: { background: '#0f0f24', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#94a3b8', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 },
    statusBadge: (color) => ({ background: color + '22', border: `1px solid ${color}`, borderRadius: 4, padding: '1px 6px', fontSize: 10, color }),
    handLabel: { fontSize: 10, textTransform: 'uppercase', color: '#6366f1', letterSpacing: 1, marginBottom: 8 },
    handGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 14 },
    endBtn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', marginRight: 10 },
    fleeBtn: { background: 'transparent', color: '#64748b', border: '1px solid #2d2d4d', borderRadius: 8, padding: '10px 14px', fontSize: 12, cursor: 'pointer' },
    log: { background: '#080814', border: '1px solid #1e1e3a', borderRadius: 8, padding: 10, height: 120, overflowY: 'auto', fontSize: 11, lineHeight: 1.8, color: '#64748b' },
    overlay: (win) => ({ background: 'rgba(0,0,0,0.9)', border: `2px solid ${win ? '#a78bfa' : '#ef4444'}`, borderRadius: 12, padding: '24px 32px', textAlign: 'center', marginBottom: 16 }),
    pileInfo: { fontSize: 10, color: '#475569', marginTop: 4 },
  };

  const nextIntent = getIntent({ ...enemy, moveIndex: (enemy.moveIndex + 1) % (ENEMIES.find(e => e.id === enemy.id)?.moves.length || 1) });

  return (
    <div style={s.root}>
      <div style={s.header}>
        <span style={s.waveTag}>Wave {wave} / 6</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Turn {turnNumber}</span>
      </div>

      {(gameOver || victory) && (
        <div style={s.overlay(victory)}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{victory ? '🏆' : '💀'}</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: victory ? '#c084fc' : '#f87171', marginBottom: 6 }}>
            {victory ? 'Victory!' : 'Defeated'}
          </div>
          {coinsEarned > 0 && <div style={{ color: '#f59e0b', marginBottom: 12 }}>+{coinsEarned} coins earned</div>}
          <button style={s.endBtn} onClick={() => onEndBattle(victory, coinsEarned)}>
            {victory ? 'Collect Rewards' : 'Return to Hub'}
          </button>
        </div>
      )}

      <div style={s.panels}>
        {/* Player panel */}
        <div style={s.panel}>
          <div style={s.panelTitle}>You</div>
          <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{playerHp} / {playerMaxHp} HP</span>
            {playerShield > 0 && <span style={s.statusBadge('#6366f1')}>🛡️ {playerShield}</span>}
          </div>
          <div style={s.bar}><div style={s.fill(playerHp / playerMaxHp, playerHp / playerMaxHp > 0.5 ? '#22c55e' : playerHp / playerMaxHp > 0.25 ? '#f59e0b' : '#ef4444')} /></div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>Energy</div>
          <div style={{ marginTop: 4 }}>
            {Array.from({ length: MAX_ENERGY }, (_, i) => <span key={i} style={s.energyDot(i < energy)} />)}
            <span style={{ fontSize: 10, color: '#475569', marginLeft: 6 }}>{energy}/{MAX_ENERGY}</span>
          </div>
          {playerWeakened > 0 && <div style={{ marginTop: 6 }}><span style={s.statusBadge('#f87171')}>😵 Weakened {playerWeakened}t</span></div>}
          <div style={s.pileInfo}>Draw: {drawPile.length} · Discard: {discardPile.length}</div>
        </div>

        {/* Enemy panel */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Enemy · Wave {wave}</div>
          <div style={s.enemyName}>{enemy.name}</div>
          <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{Math.max(0, enemy.hp)} / {enemy.maxHp} HP</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {enemy.shield > 0 && <span style={s.statusBadge('#6366f1')}>🛡️ {enemy.shield}</span>}
              {enemy.enraged && <span style={s.statusBadge('#ef4444')}>😡 Enraged</span>}
              {enemy.stunTurns > 0 && <span style={s.statusBadge('#818cf8')}>❄️ Stunned</span>}
              {enemy.burn > 0 && <span style={s.statusBadge('#f97316')}>🔥 {enemy.burn}×{enemy.burnTurns}t</span>}
            </div>
          </div>
          <div style={s.bar}><div style={s.fill(Math.max(0, enemy.hp) / enemy.maxHp, '#ef4444')} /></div>
          <div style={s.intentBox}>
            <span>Next move:</span>
            <strong style={{ color: '#e2e8f0' }}>
              {intent?.icon} {intent?.label}
              {(intent?.type === 'attack' || intent?.type === 'heavy') && ` (${Math.floor((intent.value || 0) * (enemy.enraged ? 1.5 : 1))} dmg)`}
            </strong>
          </div>
        </div>
      </div>

      {/* Hand */}
      {!gameOver && !victory && (
        <>
          <div style={s.handLabel}>Your Hand ({hand.length} cards)</div>
          <div style={s.handGrid}>
            {hand.map((cardId, i) => {
              const card = CARDS[cardId];
              const canAfford = card && card.cost <= energy;
              return (
                <div key={i} style={{ transform: animCard === i ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.15s' }}>
                  <CardDisplay
                    cardId={cardId}
                    cardProgress={cardProgress}
                    onClick={() => playCard(i)}
                    disabled={!canAfford || gameOver || victory}
                    compact={false}
                  />
                </div>
              );
            })}
            {hand.length === 0 && (
              <div style={{ color: '#475569', fontSize: 13, padding: 16 }}>No cards in hand. End turn to draw.</div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <button style={s.endBtn} onClick={endTurn} disabled={gameOver || victory}>
              End Turn → Enemy acts
            </button>
            <button style={s.fleeBtn} onClick={() => onEndBattle(false, 0)}>Flee</button>
          </div>
        </>
      )}

      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#6366f1', letterSpacing: 1, marginBottom: 6 }}>Battle Log</div>
      <div style={s.log} ref={logRef}>
        {log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>
    </div>
  );
}
