export const RARITY_COLORS = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

export const RARITY_BG = {
  common: '#1e2a3a',
  rare: '#1e2450',
  epic: '#2a1a4a',
  legendary: '#3a2a00',
};

export const RARITY_BORDER = {
  common: '#475569',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

export const TIER_LABELS = { 1: 'Tier I', 2: 'Tier II', 3: 'Tier III' };
export const TIER_COLORS = { 1: '#64748b', 2: '#6366f1', 3: '#f59e0b' };

export const TYPE_ICONS = {
  attack: '⚔️',
  defense: '🛡️',
  burn: '🔥',
  double: '⚡',
  drain: '🩸',
  surge: '🌑',
  stun: '❄️',
  heal: '💚',
  draw: '👁️',
  combo: '🌀',
};

export const CARDS = {
  // ── Tier 1 Commons ───────────────────────────────────────────────────
  crude_slash: {
    id: 'crude_slash', name: 'Crude Slash', tier: 1, rarity: 'common',
    cost: 1, type: 'attack', value: 8,
    description: 'Deal 8 damage.',
  },
  wooden_guard: {
    id: 'wooden_guard', name: 'Wooden Guard', tier: 1, rarity: 'common',
    cost: 1, type: 'defense', value: 5,
    description: 'Gain 5 shield.',
  },
  quick_jab: {
    id: 'quick_jab', name: 'Quick Jab', tier: 1, rarity: 'common',
    cost: 1, type: 'attack', value: 6,
    description: 'Deal 6 damage.',
  },
  spit_venom: {
    id: 'spit_venom', name: 'Spit Venom', tier: 1, rarity: 'common',
    cost: 1, type: 'burn', value: 3, turns: 3,
    description: 'Apply 3 burn × 3 turns.',
  },
  mend: {
    id: 'mend', name: 'Mend', tier: 1, rarity: 'common',
    cost: 1, type: 'heal', value: 8,
    description: 'Heal 8 HP.',
  },
  // ── Tier 1 Rares ─────────────────────────────────────────────────────
  twin_fangs: {
    id: 'twin_fangs', name: 'Twin Fangs', tier: 1, rarity: 'rare',
    cost: 2, type: 'double', value: 7,
    description: 'Strike twice for 7 each.',
  },
  void_pulse: {
    id: 'void_pulse', name: 'Void Pulse', tier: 1, rarity: 'rare',
    cost: 1, type: 'attack', value: 12,
    description: 'Deal 12 damage.',
  },
  stone_skin: {
    id: 'stone_skin', name: 'Stone Skin', tier: 1, rarity: 'rare',
    cost: 2, type: 'defense', value: 14,
    description: 'Gain 14 shield.',
  },
  ember_blast: {
    id: 'ember_blast', name: 'Ember Blast', tier: 1, rarity: 'rare',
    cost: 1, type: 'burn', value: 4, turns: 4,
    description: 'Apply 4 burn × 4 turns.',
  },
  // ── Tier 2 Rares ─────────────────────────────────────────────────────
  chaos_bolt: {
    id: 'chaos_bolt', name: 'Chaos Bolt', tier: 2, rarity: 'rare',
    cost: 2, type: 'attack', value: 20,
    description: 'Deal 20 damage.',
  },
  storm_lance: {
    id: 'storm_lance', name: 'Storm Lance', tier: 2, rarity: 'rare',
    cost: 2, type: 'attack', value: 17,
    description: 'Deal 17 damage.',
  },
  blood_pact: {
    id: 'blood_pact', name: 'Blood Pact', tier: 2, rarity: 'rare',
    cost: 2, type: 'drain', damage: 13, heal: 7,
    description: 'Deal 13 damage, heal 7 HP.',
  },
  shatter_guard: {
    id: 'shatter_guard', name: 'Shatter Guard', tier: 2, rarity: 'rare',
    cost: 2, type: 'defense', value: 18,
    description: 'Gain 18 shield.',
  },
  // ── Tier 2 Epics ─────────────────────────────────────────────────────
  shadow_step: {
    id: 'shadow_step', name: 'Shadow Step', tier: 2, rarity: 'epic',
    cost: 1, type: 'surge', value: 10, energy: 2,
    description: 'Deal 10 damage. Gain 2 energy.',
  },
  inferno_wave: {
    id: 'inferno_wave', name: 'Inferno Wave', tier: 2, rarity: 'epic',
    cost: 2, type: 'burn', value: 7, turns: 4,
    description: 'Apply 7 burn × 4 turns.',
  },
  arcane_barrier: {
    id: 'arcane_barrier', name: 'Arcane Barrier', tier: 2, rarity: 'epic',
    cost: 2, type: 'defense', value: 24,
    description: 'Gain 24 shield.',
  },
  death_knell: {
    id: 'death_knell', name: 'Death Knell', tier: 2, rarity: 'epic',
    cost: 3, type: 'attack', value: 32,
    description: 'Deal 32 damage.',
  },
  // ── Tier 3 Epics ─────────────────────────────────────────────────────
  void_rend: {
    id: 'void_rend', name: 'Void Rend', tier: 3, rarity: 'epic',
    cost: 2, type: 'attack', value: 28,
    description: 'Deal 28 void damage.',
  },
  soul_drain: {
    id: 'soul_drain', name: 'Soul Drain', tier: 3, rarity: 'epic',
    cost: 3, type: 'drain', damage: 22, heal: 16,
    description: 'Deal 22 damage, heal 16 HP.',
  },
  null_stasis: {
    id: 'null_stasis', name: 'Null Stasis', tier: 3, rarity: 'epic',
    cost: 2, type: 'stun', value: 12,
    description: 'Stun enemy 1 turn. Deal 12 damage.',
  },
  // ── Tier 3 Legendaries ───────────────────────────────────────────────
  eclipse_strike: {
    id: 'eclipse_strike', name: 'Eclipse Strike', tier: 3, rarity: 'legendary',
    cost: 3, type: 'attack', value: 45,
    description: 'Deal 45 damage.',
  },
  chaos_incarnate: {
    id: 'chaos_incarnate', name: 'Chaos Incarnate', tier: 3, rarity: 'legendary',
    cost: 3, type: 'combo', value: 10, turns: 3, bonus: 18,
    description: 'Deal 18 damage. Apply 10 burn × 3 turns.',
  },
  divine_barrier: {
    id: 'divine_barrier', name: 'Divine Barrier', tier: 3, rarity: 'legendary',
    cost: 2, type: 'defense', value: 40,
    description: 'Gain 40 shield.',
  },
  blood_titans_wrath: {
    id: 'blood_titans_wrath', name: "Blood Titan's Wrath", tier: 3, rarity: 'legendary',
    cost: 3, type: 'drain', damage: 32, heal: 22,
    description: 'Deal 32 damage, heal 22 HP.',
  },
  null_prophets_vision: {
    id: 'null_prophets_vision', name: "Null Prophet's Vision", tier: 3, rarity: 'legendary',
    cost: 1, type: 'draw', value: 20, draw: 2,
    description: 'Deal 20 damage. Draw 2 more cards.',
  },
};

export const PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    cost: 30,
    color: '#22c55e',
    emoji: '📦',
    description: 'Tier I cards. Mostly Commons and Rares.',
    tierFilter: [1],
    rarityWeights: { common: 65, rare: 35, epic: 0, legendary: 0 },
  },
  {
    id: 'chaos',
    name: 'Chaos Pack',
    cost: 80,
    color: '#6366f1',
    emoji: '🌀',
    description: 'Tier I–II. Rare+ guaranteed.',
    tierFilter: [1, 2],
    rarityWeights: { common: 30, rare: 50, epic: 20, legendary: 0 },
  },
  {
    id: 'void',
    name: 'Void Pack',
    cost: 200,
    color: '#a855f7',
    emoji: '🌌',
    description: 'Tier II–III. Epic+ cards.',
    tierFilter: [2, 3],
    rarityWeights: { common: 0, rare: 30, epic: 50, legendary: 20 },
  },
  {
    id: 'eclipse',
    name: 'Eclipse Pack',
    cost: 400,
    color: '#f59e0b',
    emoji: '🌘',
    description: 'Tier III only. Epic & Legendary.',
    tierFilter: [3],
    rarityWeights: { common: 0, rare: 0, epic: 50, legendary: 50 },
  },
];

export const ENEMIES = [
  {
    id: 'chaos_wraith', name: 'Chaos Wraith', wave: 1,
    hp: 40, maxHp: 40,
    moves: [
      { type: 'attack', value: 10, label: 'Strike', icon: '⚔️' },
      { type: 'attack', value: 10, label: 'Strike', icon: '⚔️' },
      { type: 'heavy',  value: 16, label: 'Heavy Blow', icon: '💥' },
    ],
    reward: 20,
  },
  {
    id: 'bone_golem', name: 'Bone Golem', wave: 2,
    hp: 70, maxHp: 70,
    moves: [
      { type: 'shield', value: 10, label: 'Fortify', icon: '🪨' },
      { type: 'attack', value: 14, label: 'Slam', icon: '⚔️' },
      { type: 'attack', value: 14, label: 'Slam', icon: '⚔️' },
      { type: 'heavy',  value: 20, label: 'Crush', icon: '💥' },
    ],
    reward: 35,
  },
  {
    id: 'void_stalker', name: 'Void Stalker', wave: 3,
    hp: 95, maxHp: 95,
    moves: [
      { type: 'debuff', label: 'Weaken', icon: '😵' },
      { type: 'attack', value: 15, label: 'Claw', icon: '⚔️' },
      { type: 'attack', value: 15, label: 'Claw', icon: '⚔️' },
      { type: 'heavy',  value: 22, label: 'Void Rend', icon: '💥' },
    ],
    reward: 55,
  },
  {
    id: 'storm_titan', name: 'Storm Titan', wave: 4,
    hp: 130, maxHp: 130,
    moves: [
      { type: 'attack', value: 18, label: 'Storm Strike', icon: '⚔️' },
      { type: 'attack', value: 18, label: 'Storm Strike', icon: '⚔️' },
      { type: 'enrage', label: 'Enrage!', icon: '😡' },
      { type: 'heavy',  value: 28, label: 'Thunderclap', icon: '💥' },
    ],
    reward: 80,
  },
  {
    id: 'null_harbinger', name: 'Null Harbinger', wave: 5,
    hp: 160, maxHp: 160,
    moves: [
      { type: 'heal',   value: 25, label: 'Absorb', icon: '💚' },
      { type: 'attack', value: 20, label: 'Null Strike', icon: '⚔️' },
      { type: 'debuff', label: 'Weaken', icon: '😵' },
      { type: 'attack', value: 20, label: 'Null Strike', icon: '⚔️' },
      { type: 'heavy',  value: 30, label: 'Obliterate', icon: '💥' },
    ],
    reward: 110,
  },
  {
    id: 'eclipse_devourer', name: 'Eclipse Devourer', wave: 6,
    hp: 220, maxHp: 220,
    moves: [
      { type: 'attack', value: 22, label: 'Consume', icon: '⚔️' },
      { type: 'shield', value: 20, label: 'Dark Shell', icon: '🪨' },
      { type: 'heavy',  value: 38, label: 'Eclipse Burst', icon: '💥' },
      { type: 'enrage', label: 'Ascend', icon: '😡' },
      { type: 'heal',   value: 30, label: 'Absorb', icon: '💚' },
      { type: 'attack', value: 22, label: 'Consume', icon: '⚔️' },
    ],
    reward: 200,
  },
];

export const STARTING_COLLECTION = {
  crude_slash: 3,
  wooden_guard: 3,
  quick_jab: 2,
  void_pulse: 1,
  twin_fangs: 1,
};

export const STARTING_DECK = {
  crude_slash: 2,
  wooden_guard: 2,
  quick_jab: 2,
};

export const STARTING_COINS = 50;
export const PACK_SIZE = 7;
export const MAX_DECK_SIZE = 10;
export const MIN_DECK_SIZE = 4;
export const MAX_COPIES_PER_CARD = 2;
