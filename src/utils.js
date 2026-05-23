export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [key, w] of Object.entries(weights)) {
    r -= w;
    if (r <= 0) return key;
  }
  return Object.keys(weights)[Object.keys(weights).length - 1];
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function deckCardCount(deck) {
  return Object.values(deck).reduce((a, b) => a + b, 0);
}

export function buildDrawPile(deck) {
  const pile = [];
  for (const [cardId, count] of Object.entries(deck)) {
    for (let i = 0; i < count; i++) pile.push(cardId);
  }
  return shuffle(pile);
}

export function cardEffectivePower(card, cardProgress) {
  const prog = cardProgress[card.id];
  const level = prog ? prog.level : 1;
  const multiplier = 1 + (level - 1) * 0.25;
  return {
    value: card.value != null ? Math.floor(card.value * multiplier) : undefined,
    damage: card.damage != null ? Math.floor(card.damage * multiplier) : undefined,
    heal: card.heal != null ? Math.floor(card.heal * multiplier) : undefined,
    bonus: card.bonus != null ? Math.floor(card.bonus * multiplier) : undefined,
  };
}

export function sampleCards(CARDS, tierFilter, rarityWeights, count) {
  const pool = Object.values(CARDS).filter(c => tierFilter.includes(c.tier));
  const byRarity = {};
  for (const c of pool) {
    if (!byRarity[c.rarity]) byRarity[c.rarity] = [];
    byRarity[c.rarity].push(c.id);
  }

  const activeWeights = {};
  for (const [r, w] of Object.entries(rarityWeights)) {
    if (w > 0 && byRarity[r] && byRarity[r].length > 0) activeWeights[r] = w;
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const rarity = weightedRandom(activeWeights);
    const candidates = byRarity[rarity];
    result.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return result;
}
