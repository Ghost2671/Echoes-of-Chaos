import { CARDS, TRIBE_DATA } from './gameData';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function deckCardCount(obj) {
  return Object.values(obj || {}).reduce((s, n) => s + (typeof n === 'number' ? n : 0), 0);
}

export function buildDeckArray(deckObj) {
  const arr = [];
  for (const [id, count] of Object.entries(deckObj || {})) {
    for (let i = 0; i < count; i++) arr.push(id);
  }
  return arr;
}

// Roll a single d10 (1-10)
function d10() { return Math.floor(Math.random() * 10) + 1; }

// Roll 2d10 (2-20)
export function roll2d10() { return d10() + d10(); }

// Chaotic TCG discipline check
// Returns: { atkTotal, defTotal, overflow, won, lost, tie, atkRoll, defRoll }
export function disciplineCheck(attack, attacker, defender, locationBonus = {}) {
  const disc = attack.disc;
  const atkBase = (attacker[disc] || 0) + (locationBonus[disc] || 0);
  const defBase = (defender[disc] || 0) + (locationBonus[disc] || 0);
  const atkRoll = roll2d10();
  const defRoll = roll2d10();
  const atkTotal = atkBase + atkRoll;
  const defTotal = defBase + defRoll;
  const diff = atkTotal - defTotal;
  return {
    atkTotal, defTotal, atkRoll, defRoll,
    overflow: Math.max(0, diff),
    won: diff > 0,
    lost: diff < 0,
    tie: diff === 0,
  };
}

// Calculate damage from discipline check
export function calcAttackDamage(attack, checkResult) {
  if (checkResult.lost) return 0;
  if (checkResult.tie) return Math.max(0, Math.floor(attack.damage * 0.5));
  const overflow = Math.floor(checkResult.overflow / 5);
  return attack.damage + overflow;
}

// Build a creature fighter object from cardId + optional battlegear bonus
export function makeFighter(cardId, battlegearId = null) {
  const c = CARDS[cardId];
  if (!c) return null;
  const bg = battlegearId ? CARDS[battlegearId] : null;
  const bonuses = bg?.bonuses || {};
  return {
    cardId,
    battlegearId: battlegearId || null,
    currentEnergy: c.energy + (bonuses.energy || 0),
    maxEnergy: c.energy + (bonuses.energy || 0),
    mugicCounters: c.mugicCounters + (bonuses.mugicCounters || 0),
    maxMugicCounters: c.mugicCounters + (bonuses.mugicCounters || 0),
    courage: c.courage + (bonuses.courage || 0),
    power: c.power + (bonuses.power || 0),
    wisdom: c.wisdom + (bonuses.wisdom || 0),
    speed: c.speed + (bonuses.speed || 0),
    statusEffects: { burned: 0, confused: false, reduceDmg: 0 },
  };
}

// Apply location bonuses to a fighter (returns new fighter)
export function applyLocation(fighter, locationCard) {
  if (!locationCard) return fighter;
  const card = CARDS[fighter.cardId];
  const tribe = card?.tribe;
  const all = locationCard.allBonuses || {};
  const tribal = (locationCard.tribeBonuses || {})[tribe] || {};
  return {
    ...fighter,
    courage: fighter.courage + (all.courage || 0) + (tribal.courage || 0),
    power: fighter.power + (all.power || 0) + (tribal.power || 0),
    wisdom: fighter.wisdom + (all.wisdom || 0) + (tribal.wisdom || 0),
    speed: fighter.speed + (all.speed || 0) + (tribal.speed || 0),
    mugicCounters: fighter.mugicCounters + (all.mugicCounters || 0) + (tribal.mugicCounters || 0),
    maxMugicCounters: fighter.mugicCounters + (all.mugicCounters || 0) + (tribal.mugicCounters || 0),
    maxEnergy: fighter.maxEnergy + (all.energy || 0) + (tribal.energy || 0),
    currentEnergy: fighter.currentEnergy + (all.energy || 0) + (tribal.energy || 0),
  };
}

// Generate a random AI opponent for infinite battle mode
export function generateOpponent(wave) {
  const allCreatures = Object.values(CARDS).filter(c => c.cardType === 'creature');
  const scale = 1 + (wave - 1) * 0.1;
  const teamSize = Math.min(6, 2 + Math.floor(wave / 2));
  const selected = shuffle(allCreatures).slice(0, teamSize);
  const team = selected.map(card => {
    const f = makeFighter(card.id);
    return {
      ...f,
      currentEnergy: Math.round(f.currentEnergy * scale),
      maxEnergy: Math.round(f.maxEnergy * scale),
      courage: Math.round(f.courage * scale),
      power: Math.round(f.power * scale),
      wisdom: Math.round(f.wisdom * scale),
      speed: Math.round(f.speed * scale),
    };
  });
  const tribes = [...new Set(team.map(t => CARDS[t.cardId]?.tribe || 'overworld'))];
  const dominant = tribes[0];
  const td = TRIBE_DATA[dominant] || TRIBE_DATA.overworld;
  const namePool = ['Perim Wanderer','Void Champion','Shadow Seeker','Storm Caller','Iron Warlord','Bone Crusher','Mind Bender','Wave Rider','Stone Wall','Flame Keeper','Wind Dancer','Hive Mind'];
  return {
    id: `gen_${wave}`, wave, generated: true,
    name: namePool[wave % namePool.length],
    subtitle: `${td.name} Battler`,
    tribe: dominant, color: td.color,
    team, mugic: [],
    location: shuffle(Object.values(CARDS).filter(c => c.cardType === 'location'))[0]?.id || 'plen_o_chao',
    prize: Math.min(7, 3 + Math.floor(wave / 3)),
    reward: 40 + wave * 25,
  };
}

// Card pool sampler for pack opening
export function sampleCards(tierFilter, rarityWeights, count) {
  const pool = Object.values(CARDS).filter(c => {
    if (c.cardType === 'location') return false;
    if (!tierFilter) return true;
    return tierFilter.includes(c.tier || 1);
  });

  function weightedRarity() {
    let r = Math.random() * 100; let cum = 0;
    for (const [k, w] of Object.entries(rarityWeights)) {
      cum += w; if (r < cum) return k;
    }
    return 'common';
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const rarity = weightedRarity();
    const sub = pool.filter(c => c.rarity === rarity);
    const fallback = pool;
    const from = sub.length > 0 ? sub : fallback;
    results.push(from[Math.floor(Math.random() * from.length)]?.id || 'attacat');
  }
  return results;
}

// Legacy compat
export function canAffordAttack() { return true; }
export function cardEffectivePower(card) { return (card?.energy || 50); }
