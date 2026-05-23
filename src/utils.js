import { CARDS, WEAKNESS_CHART, WEAKNESS_BONUS } from './gameData';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function weightedRandom(weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [k, w] of entries) { r -= w; if (r <= 0) return k; }
  return entries[entries.length - 1][0];
}

export function sampleCards(tierFilter, rarityWeights, count) {
  const pool = Object.values(CARDS).filter(c => tierFilter.includes(c.tier));
  const byRarity = {};
  for (const c of pool) {
    if (!byRarity[c.rarity]) byRarity[c.rarity] = [];
    byRarity[c.rarity].push(c.id);
  }
  const activeWeights = {};
  for (const [r, w] of Object.entries(rarityWeights)) {
    if (w > 0 && byRarity[r]?.length) activeWeights[r] = w;
  }
  const result = [];
  for (let i = 0; i < count; i++) {
    const rarity = weightedRandom(activeWeights);
    const pool2 = byRarity[rarity];
    result.push(pool2[Math.floor(Math.random() * pool2.length)]);
  }
  return result;
}

export function deckCardCount(deck) {
  return Object.values(deck).reduce((a, b) => a + b, 0);
}

// energy: array of cardIds attached to a creature
// cost: array of strings like ['shadow', 'any', 'any']
export function canAffordAttack(cost, attachedEnergy) {
  const counts = {};
  let rainbowPool = 0;
  for (const e of attachedEnergy) {
    const card = CARDS[e];
    if (!card) continue;
    const t = card.energyType;
    if (t === 'rainbow') { rainbowPool++; }
    else { counts[t] = (counts[t] || 0) + 1; }
  }

  const avail = { ...counts };
  let wild = rainbowPool;
  let anyNeeded = 0;

  for (const req of cost) {
    if (req === 'any') { anyNeeded++; continue; }
    if ((avail[req] || 0) > 0) { avail[req]--; }
    else if (wild > 0) { wild--; }
    else { return false; }
  }

  // satisfy 'any' from remaining
  const remaining = Object.values(avail).reduce((s, v) => s + v, 0) + wild;
  return remaining >= anyNeeded;
}

export function calcDamage(attack, attackerType, defenderCardId, reduceDmg = 0) {
  let dmg = attack.damage;
  const defCard = CARDS[defenderCardId];
  if (defCard && WEAKNESS_CHART[defCard.type] === attackerType) dmg += WEAKNESS_BONUS;
  if (defCard?.type === defCard?.type) {} // placeholder
  dmg = Math.max(0, dmg - reduceDmg);
  return dmg;
}

export function buildDeckArray(deckObj) {
  const arr = [];
  for (const [id, count] of Object.entries(deckObj)) {
    for (let i = 0; i < count; i++) arr.push(id);
  }
  return arr;
}

export function getEnergyType(cardId) {
  return CARDS[cardId]?.energyType || null;
}

export function energyCostLabel(cost) {
  const counts = {};
  for (const c of cost) counts[c] = (counts[c] || 0) + 1;
  return Object.entries(counts).map(([t, n]) => `${n}×${t}`).join(' + ');
}
