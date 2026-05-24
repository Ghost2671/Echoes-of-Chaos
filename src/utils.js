import { CARDS, TRIBE_DATA, ELEMENT_DATA } from './gameData';

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

// Roll a single d10 (1-10)
function d10() { return Math.floor(Math.random() * 10) + 1; }

// Roll 2d10 (2-20) — authentic Chaotic TCG dice
export function roll2d10() { return d10() + d10(); }

// ── Discipline Check ──────────────────────────────────────────────────────────
// Authentic Chaotic TCG: Each player rolls 2d10 and adds to their discipline stat.
// Higher total wins. Winner's overflow / 5 added to base attack damage.
export function disciplineCheck(attack, attacker, defender) {
  const disc = attack.disc;
  const atkBase = (attacker[disc] || 0);
  const defBase = (defender[disc] || 0);
  const atkRoll = roll2d10();
  const defRoll = roll2d10();
  const atkTotal = atkBase + atkRoll;
  const defTotal = defBase + defRoll;
  const diff = atkTotal - defTotal;
  return {
    atkBase, defBase, atkRoll, defRoll,
    atkTotal, defTotal,
    overflow: Math.max(0, diff),
    won:  diff > 0,
    lost: diff < 0,
    tie:  diff === 0,
  };
}

// ── Elemental damage modifier ─────────────────────────────────────────────────
// Creatures with matching element resist; opposing element is weak
const ELEMENT_ADVANTAGE = {
  fire: 'air',    // fire beats air
  water: 'fire',  // water beats fire
  earth: 'water', // earth beats water
  air: 'earth',   // air beats earth
};

export function elementalModifier(attackElement, defenderElements) {
  if (!attackElement || attackElement === 'none') return 0;
  if (!defenderElements || defenderElements.length === 0) return 0;
  let mod = 0;
  for (const el of defenderElements) {
    if (ELEMENT_ADVANTAGE[attackElement] === el) mod += 10; // super effective
    if (ELEMENT_ADVANTAGE[el] === attackElement) mod -= 5;  // resisted
  }
  return mod;
}

// ── Calculate attack damage ───────────────────────────────────────────────────
export function calcAttackDamage(attack, checkResult, attackerCard, defenderCard) {
  let base = attack.damage;
  if (checkResult.lost) return 0;
  if (checkResult.tie) base = Math.max(0, Math.floor(base * 0.5));
  if (checkResult.won) base += Math.floor(checkResult.overflow / 5);

  // Elemental modifier
  const atkEl = attack.element || 'none';
  const defEls = defenderCard?.elements || [];
  base += elementalModifier(atkEl, defEls);

  return Math.max(0, base);
}

// ── Build a fighter object from a cardId + optional battlegear ────────────────
export function makeFighter(cardId, battlegearId = null) {
  const c = CARDS[cardId];
  if (!c || c.cardType !== 'creature') return null;
  const bg = battlegearId ? CARDS[battlegearId] : null;
  const bonuses = bg?.bonuses || {};
  return {
    cardId,
    battlegearId: battlegearId || null,
    currentEnergy: c.energy + (bonuses.energy || 0),
    maxEnergy:     c.energy + (bonuses.energy || 0),
    mugicCounters:    c.mugicCounters + (bonuses.mugicCounters || 0),
    maxMugicCounters: c.mugicCounters + (bonuses.mugicCounters || 0),
    courage: c.courage + (bonuses.courage || 0),
    power:   c.power   + (bonuses.power   || 0),
    wisdom:  c.wisdom  + (bonuses.wisdom  || 0),
    speed:   c.speed   + (bonuses.speed   || 0),
    statusEffects: { burned: 0, confused: false, reduceDmg: 0, invisible: false },
    usedAbility: false,
  };
}

// ── Apply location bonuses ────────────────────────────────────────────────────
export function applyLocation(fighter, locationCard) {
  if (!locationCard) return fighter;
  const card  = CARDS[fighter.cardId];
  const tribe = card?.tribe;
  const all    = locationCard.allBonuses   || {};
  const tribal = (locationCard.tribeBonuses || {})[tribe] || {};

  return {
    ...fighter,
    courage: fighter.courage + (all.courage || 0) + (tribal.courage || 0),
    power:   fighter.power   + (all.power   || 0) + (tribal.power   || 0),
    wisdom:  fighter.wisdom  + (all.wisdom  || 0) + (tribal.wisdom  || 0),
    speed:   fighter.speed   + (all.speed   || 0) + (tribal.speed   || 0),
    mugicCounters:    fighter.mugicCounters    + (all.mugicCounters    || 0) + (tribal.mugicCounters    || 0),
    maxMugicCounters: fighter.maxMugicCounters + (all.mugicCounters    || 0) + (tribal.mugicCounters    || 0),
    maxEnergy:     fighter.maxEnergy     + (all.energy || 0) + (tribal.energy || 0),
    currentEnergy: fighter.currentEnergy + (all.energy || 0) + (tribal.energy || 0),
  };
}

// ── Generate AI opponent for endless mode ─────────────────────────────────────
export function generateOpponent(wave) {
  const allCreatures = Object.values(CARDS).filter(c => c.cardType === 'creature');
  const scale   = 1 + (wave - 1) * 0.08;
  const teamSize = Math.min(6, 2 + Math.floor(wave / 3));

  // Prefer higher rarity cards at higher waves
  const rarityPool = wave <= 5
    ? allCreatures.filter(c => ['common','uncommon'].includes(c.rarity))
    : wave <= 10
    ? allCreatures.filter(c => ['uncommon','rare','super_rare'].includes(c.rarity))
    : allCreatures.filter(c => ['rare','super_rare','ultra_rare'].includes(c.rarity));

  const pool = rarityPool.length >= teamSize ? rarityPool : allCreatures;
  const selected = shuffle(pool).slice(0, teamSize);

  const allMugic   = Object.values(CARDS).filter(c => c.cardType === 'mugic');
  const allLocations = Object.values(CARDS).filter(c => c.cardType === 'location');

  const team = selected.map(card => {
    const f = makeFighter(card.id);
    return {
      ...f,
      currentEnergy: Math.round(f.currentEnergy * scale),
      maxEnergy:     Math.round(f.maxEnergy     * scale),
      courage: Math.round(f.courage * scale),
      power:   Math.round(f.power   * scale),
      wisdom:  Math.round(f.wisdom  * scale),
      speed:   Math.round(f.speed   * scale),
    };
  });

  const tribes   = [...new Set(team.map(t => CARDS[t.cardId]?.tribe || 'overworld'))];
  const dominant = tribes[0];
  const td       = TRIBE_DATA[dominant] || TRIBE_DATA.overworld;

  const mugicCards = shuffle(allMugic.filter(m => !m.restriction || m.restriction === dominant)).slice(0, Math.min(3, wave));

  const namePool = [
    'Perim Wanderer','Void Champion','Shadow Seeker','Storm Caller','Iron Warlord',
    'Bone Crusher','Mind Bender','Wave Rider','Stone Wall','Flame Keeper',
    'Wind Dancer','Hive Mind','Sand Stalker','Tide Breaker','Rock Sovereign',
    'Ember Sage','Dark Scout','Ancient Guardian','Prime Hunter','Rift Strider',
  ];

  const locationId = shuffle(allLocations)[0]?.id || 'plen_o_chao';

  return {
    id: `gen_${wave}`, wave, generated: true,
    name: namePool[wave % namePool.length],
    subtitle: `${td.name} Challenger`,
    tribe: dominant, color: td.color,
    team,
    mugic: mugicCards.map(m => m.id),
    location: locationId,
    reward: 50 + wave * 30,
  };
}

// ── Card pool sampler for pack opening ───────────────────────────────────────
export function sampleCards(tribeFilter, rarityWeights, count) {
  let pool = Object.values(CARDS).filter(c => {
    if (c.cardType === 'location') return count > 10; // locations only in bigger packs
    return true;
  });

  if (tribeFilter) {
    const tribedCards = pool.filter(c => c.tribe === tribeFilter || !c.tribe);
    if (tribedCards.length >= count) pool = tribedCards;
  }

  function weightedRarity() {
    let r = Math.random() * 100; let cum = 0;
    for (const [k, w] of Object.entries(rarityWeights)) {
      cum += w;
      if (r < cum) return k;
    }
    return 'common';
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const rarity = weightedRarity();
    const sub    = pool.filter(c => c.rarity === rarity);
    const from   = sub.length > 0 ? sub : pool;
    const picked = from[Math.floor(Math.random() * from.length)];
    if (picked) results.push(picked.id);
  }
  return results;
}

// ── Tribe color helper ────────────────────────────────────────────────────────
export function tribeColor(tribe) {
  return TRIBE_DATA[tribe]?.color || '#888';
}

export function rarityColor(rarity) {
  const map = {
    common:'#8a9ab0', uncommon:'#4ade80', rare:'#3b82f6',
    super_rare:'#a855f7', ultra_rare:'#f59e0b',
  };
  return map[rarity] || '#888';
}
