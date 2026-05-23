export const TYPE_COLORS   = { shadow: '#7c3aed', void: '#1d4ed8', chaos: '#dc2626', iron: '#57534e' };
export const TYPE_BG      = { shadow: '#1e0a3c', void: '#0e1a3c', chaos: '#3c0a0a', iron: '#1c1917' };
export const TYPE_NAMES   = { shadow: 'Shadow', void: 'Void', chaos: 'Chaos', iron: 'Iron', rainbow: 'Rainbow' };
export const TYPE_ICONS   = { shadow: '🌑', void: '🌌', chaos: '🔥', iron: '⚙️', rainbow: '🌈' };
export const WEAKNESS_BONUS = 30;

export const RARITY_COLORS = { common: '#94a3b8', uncommon: '#4ade80', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
export const RARITY_STARS  = { common: '★', uncommon: '★★', rare: '★★★', epic: '✦✦✦', legendary: '✦✦✦✦' };

// weakness chart: each type is weak to one type (+30 damage)
export const WEAKNESS_CHART = { shadow: 'chaos', chaos: 'void', void: 'iron', iron: 'shadow' };

export const CARDS = {
  // ── Tier 1 Creatures (common/uncommon) ────────────────────────────────
  shadow_warden: {
    id: 'shadow_warden', cardType: 'creature', name: 'Shadow Warden',
    type: 'shadow', hp: 80, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Shadow Slash', cost: ['shadow'], damage: 30, effect: null, desc: '' },
      { name: 'Night Fall',   cost: ['shadow', 'shadow'], damage: 60, effect: null, desc: '' },
    ],
    weakness: 'chaos', retreatCost: 1,
  },
  night_siren: {
    id: 'night_siren', cardType: 'creature', name: 'Night Siren',
    type: 'shadow', hp: 70, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Eerie Song',  cost: ['any'], damage: 10, effect: 'confuse', desc: 'Confuse the opponent.' },
      { name: 'Siren Wail',  cost: ['shadow', 'any'], damage: 40, effect: null, desc: '' },
    ],
    weakness: 'chaos', retreatCost: 1,
  },
  ashen_knight: {
    id: 'ashen_knight', cardType: 'creature', name: 'Ashen Knight',
    type: 'chaos', hp: 70, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Ember Strike', cost: ['chaos'], damage: 20, effect: 'burn_10', desc: 'Burn for 10 each turn.' },
      { name: 'Ash Charge',   cost: ['chaos', 'any'], damage: 40, effect: null, desc: '' },
    ],
    weakness: 'void', retreatCost: 1,
  },
  chaos_arcanist: {
    id: 'chaos_arcanist', cardType: 'creature', name: 'Chaos Arcanist',
    type: 'chaos', hp: 80, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Arcane Bolt', cost: ['chaos'], damage: 30, effect: null, desc: '' },
      { name: 'Wild Surge',  cost: ['chaos', 'chaos'], damage: 60, effect: null, desc: '' },
    ],
    weakness: 'void', retreatCost: 1,
  },
  void_reaver: {
    id: 'void_reaver', cardType: 'creature', name: 'Void Reaver',
    type: 'void', hp: 80, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Void Touch',       cost: ['void'], damage: 20, effect: null, desc: '' },
      { name: 'Dimensional Tear', cost: ['void', 'void'], damage: 60, effect: null, desc: '' },
    ],
    weakness: 'iron', retreatCost: 2,
  },
  iron_specter: {
    id: 'iron_specter', cardType: 'creature', name: 'Iron Specter',
    type: 'iron', hp: 80, rarity: 'common', tier: 1,
    attacks: [
      { name: 'Metal Claw',     cost: ['iron'], damage: 30, effect: null, desc: '' },
      { name: 'Spectral Drive', cost: ['iron', 'iron'], damage: 60, effect: 'bench_10', desc: 'Also deals 10 to each bench creature.' },
    ],
    weakness: 'shadow', retreatCost: 1,
  },
  // ── Tier 2 Creatures (uncommon/rare) ─────────────────────────────────
  storm_revenant: {
    id: 'storm_revenant', cardType: 'creature', name: 'Storm Revenant',
    type: 'chaos', hp: 90, rarity: 'uncommon', tier: 2,
    attacks: [
      { name: 'Lightning Strike', cost: ['chaos', 'any'], damage: 40, effect: null, desc: '' },
      { name: 'Thunder Crash',    cost: ['chaos', 'chaos', 'any'], damage: 80, effect: 'self_20', desc: 'This creature takes 20 damage.' },
    ],
    weakness: 'void', retreatCost: 2,
  },
  storm_guard: {
    id: 'storm_guard', cardType: 'creature', name: 'Storm Guard',
    type: 'iron', hp: 90, rarity: 'uncommon', tier: 2,
    attacks: [
      { name: 'Guard Smash',  cost: ['iron', 'any'], damage: 40, effect: null, desc: '' },
      { name: 'Storm Shield', cost: ['iron', 'iron'], damage: 50, effect: 'reduce_30', desc: 'Next attack against this creature does 30 less.' },
    ],
    weakness: 'shadow', retreatCost: 2,
  },
  shadow_fiend: {
    id: 'shadow_fiend', cardType: 'creature', name: 'Shadow Fiend',
    type: 'shadow', hp: 100, rarity: 'uncommon', tier: 2,
    attacks: [
      { name: 'Dark Pulse',    cost: ['shadow', 'any'], damage: 40, effect: null, desc: '' },
      { name: 'Soul Shatter',  cost: ['shadow', 'shadow', 'any'], damage: 80, effect: null, desc: '' },
    ],
    weakness: 'chaos', retreatCost: 2,
  },
  void_shade: {
    id: 'void_shade', cardType: 'creature', name: 'Void Shade',
    type: 'void', hp: 70, rarity: 'uncommon', tier: 2,
    attacks: [
      { name: 'Phase Shift', cost: ['void'], damage: 20, effect: 'reduce_20', desc: 'Next attack does 20 less damage.' },
      { name: 'Unmaking',    cost: ['void', 'void', 'any'], damage: 80, effect: null, desc: '' },
    ],
    weakness: 'iron', retreatCost: 1,
  },
  // ── Tier 3 Creatures (rare/epic/legendary) ───────────────────────────
  eclipse_beast: {
    id: 'eclipse_beast', cardType: 'creature', name: 'Eclipse Beast',
    type: 'shadow', hp: 130, rarity: 'rare', tier: 3,
    attacks: [
      { name: 'Crescent Slash', cost: ['shadow', 'shadow'], damage: 60, effect: null, desc: '' },
      { name: 'Total Eclipse',  cost: ['shadow', 'shadow', 'shadow'], damage: 120, effect: null, desc: '' },
    ],
    weakness: 'chaos', retreatCost: 3,
  },
  null_prophet: {
    id: 'null_prophet', cardType: 'creature', name: 'Null Prophet',
    type: 'void', hp: 110, rarity: 'rare', tier: 3,
    attacks: [
      { name: 'Null Ray',  cost: ['void', 'void'], damage: 50, effect: 'bench_10', desc: 'Also 10 to each bench creature.' },
      { name: 'Prophecy',  cost: ['void', 'void', 'void'], damage: 100, effect: null, desc: '' },
    ],
    weakness: 'iron', retreatCost: 2,
  },
  blood_titan: {
    id: 'blood_titan', cardType: 'creature', name: 'Blood Titan',
    type: 'chaos', hp: 140, rarity: 'epic', tier: 3,
    attacks: [
      { name: 'Blood Slam',    cost: ['chaos', 'chaos'], damage: 70, effect: null, desc: '' },
      { name: "Titan's Wrath", cost: ['chaos', 'chaos', 'chaos'], damage: 130, effect: 'discard_2_energy', desc: 'Discard 2 energy from this creature.' },
    ],
    weakness: 'void', retreatCost: 3,
  },
  iron_colossus: {
    id: 'iron_colossus', cardType: 'creature', name: 'Iron Colossus',
    type: 'iron', hp: 160, rarity: 'legendary', tier: 3,
    attacks: [
      { name: 'Reinforced Strike', cost: ['iron', 'iron'], damage: 80, effect: null, desc: '' },
      { name: 'Annihilate',        cost: ['iron', 'iron', 'iron'], damage: 140, effect: 'self_20', desc: 'This creature takes 20 damage.' },
    ],
    weakness: 'shadow', retreatCost: 4,
  },

  // ── Basic Energy ──────────────────────────────────────────────────────
  shadow_energy: { id: 'shadow_energy', cardType: 'energy', name: 'Shadow Energy', energyType: 'shadow', rarity: 'common', tier: 1 },
  void_energy:   { id: 'void_energy',   cardType: 'energy', name: 'Void Energy',   energyType: 'void',   rarity: 'common', tier: 1 },
  chaos_energy:  { id: 'chaos_energy',  cardType: 'energy', name: 'Chaos Energy',  energyType: 'chaos',  rarity: 'common', tier: 1 },
  iron_energy:   { id: 'iron_energy',   cardType: 'energy', name: 'Iron Energy',   energyType: 'iron',   rarity: 'common', tier: 1 },
  rainbow_energy: { id: 'rainbow_energy', cardType: 'energy', name: 'Rainbow Energy', energyType: 'rainbow', rarity: 'rare', tier: 2,
    note: 'Counts as any type. Attached creature takes 10 dmg.' },

  // ── Trainer — Items ──────────────────────────────────────────────────
  potion: {
    id: 'potion', cardType: 'trainer', trainerType: 'item', name: 'Potion',
    effect: 'heal_30', rarity: 'common', tier: 1,
    description: 'Heal 30 HP from your Active creature.',
  },
  super_potion: {
    id: 'super_potion', cardType: 'trainer', trainerType: 'item', name: 'Super Potion',
    effect: 'heal_60_discard', rarity: 'uncommon', tier: 2,
    description: 'Heal 60 HP from your Active. Discard 1 attached energy.',
  },
  switch_card: {
    id: 'switch_card', cardType: 'trainer', trainerType: 'item', name: 'Switch',
    effect: 'switch', rarity: 'common', tier: 1,
    description: 'Swap your Active with a Bench creature for free.',
  },
  energy_retrieval: {
    id: 'energy_retrieval', cardType: 'trainer', trainerType: 'item', name: 'Energy Retrieval',
    effect: 'retrieve_energy', rarity: 'common', tier: 1,
    description: 'Put 2 Energy cards from your discard into your hand.',
  },
  quick_ball: {
    id: 'quick_ball', cardType: 'trainer', trainerType: 'item', name: 'Quick Ball',
    effect: 'search_creature', rarity: 'uncommon', tier: 2,
    description: 'Search your deck for a creature and put it in your hand.',
  },
  ultra_ball: {
    id: 'ultra_ball', cardType: 'trainer', trainerType: 'item', name: 'Ultra Ball',
    effect: 'ultra_ball', rarity: 'rare', tier: 2,
    description: 'Discard 2 cards. Search your deck for any creature.',
  },
  max_potion: {
    id: 'max_potion', cardType: 'trainer', trainerType: 'item', name: 'Max Potion',
    effect: 'heal_full_discard_all', rarity: 'epic', tier: 3,
    description: 'Fully heal your Active. Discard all attached energy.',
  },
  // ── Trainer — Supporters ─────────────────────────────────────────────
  professors_research: {
    id: 'professors_research', cardType: 'trainer', trainerType: 'supporter', name: "Prof. Research",
    effect: 'draw_7_discard', rarity: 'uncommon', tier: 2,
    description: 'Discard your hand, then draw 7 cards.',
  },
  marnie: {
    id: 'marnie', cardType: 'trainer', trainerType: 'supporter', name: 'Marnie',
    effect: 'marnie', rarity: 'rare', tier: 2,
    description: 'Each player shuffles their hand into their deck, then draws 5.',
  },
  bosss_orders: {
    id: 'bosss_orders', cardType: 'trainer', trainerType: 'supporter', name: "Boss's Orders",
    effect: 'boss', rarity: 'epic', tier: 3,
    description: "Switch your opponent's Active with a random Bench creature.",
  },
};

// ── Opponent Teams (wave-based) ─────────────────────────────────────────
export const OPPONENTS = [
  {
    id: 'ignis', wave: 1, name: 'Trainer Ignis', subtitle: 'Chaos Specialist',
    color: '#dc2626', prize: 3, reward: 40,
    team: [
      { cardId: 'ashen_knight',    currentHp: 70,  maxHp: 70,  attachedEnergy: [] },
      { cardId: 'chaos_arcanist',  currentHp: 80,  maxHp: 80,  attachedEnergy: [] },
    ],
  },
  {
    id: 'nyx', wave: 2, name: 'Trainer Nyx', subtitle: 'Shadow Specialist',
    color: '#7c3aed', prize: 3, reward: 60,
    team: [
      { cardId: 'shadow_warden',  currentHp: 80,  maxHp: 80,  attachedEnergy: [] },
      { cardId: 'night_siren',    currentHp: 70,  maxHp: 70,  attachedEnergy: [] },
      { cardId: 'shadow_fiend',   currentHp: 100, maxHp: 100, attachedEnergy: [] },
    ],
  },
  {
    id: 'steelborn', wave: 3, name: 'Trainer Steelborn', subtitle: 'Iron Specialist',
    color: '#57534e', prize: 3, reward: 80,
    team: [
      { cardId: 'iron_specter',  currentHp: 80,  maxHp: 80,  attachedEnergy: [] },
      { cardId: 'storm_guard',   currentHp: 90,  maxHp: 90,  attachedEnergy: [] },
      { cardId: 'iron_colossus', currentHp: 160, maxHp: 160, attachedEnergy: [] },
    ],
  },
  {
    id: 'omen', wave: 4, name: 'Elite Omen', subtitle: 'Void Specialist',
    color: '#1d4ed8', prize: 3, reward: 100,
    team: [
      { cardId: 'void_reaver',  currentHp: 80,  maxHp: 80,  attachedEnergy: [] },
      { cardId: 'void_shade',   currentHp: 70,  maxHp: 70,  attachedEnergy: [] },
      { cardId: 'null_prophet', currentHp: 110, maxHp: 110, attachedEnergy: [] },
    ],
  },
  {
    id: 'eclipse_trainer', wave: 5, name: 'Champion Eclipse', subtitle: 'Mixed Master',
    color: '#f59e0b', prize: 3, reward: 150,
    team: [
      { cardId: 'storm_revenant', currentHp: 90,  maxHp: 90,  attachedEnergy: [] },
      { cardId: 'eclipse_beast',  currentHp: 130, maxHp: 130, attachedEnergy: [] },
      { cardId: 'blood_titan',    currentHp: 140, maxHp: 140, attachedEnergy: [] },
    ],
  },
  {
    id: 'the_null', wave: 6, name: 'The Null', subtitle: 'Final Challenge',
    color: '#c084fc', prize: 4, reward: 250,
    team: [
      { cardId: 'null_prophet',  currentHp: 110, maxHp: 110, attachedEnergy: [] },
      { cardId: 'blood_titan',   currentHp: 140, maxHp: 140, attachedEnergy: [] },
      { cardId: 'iron_colossus', currentHp: 160, maxHp: 160, attachedEnergy: [] },
      { cardId: 'eclipse_beast', currentHp: 130, maxHp: 130, attachedEnergy: [] },
    ],
  },
];

export const PACKS = [
  {
    id: 'starter', name: 'Starter Pack', cost: 30, color: '#22c55e', emoji: '📦',
    description: 'Tier 1 creatures, basic energy & trainer cards.',
    tierFilter: [1],
    rarityWeights: { common: 65, uncommon: 30, rare: 5, epic: 0, legendary: 0 },
  },
  {
    id: 'chaos', name: 'Chaos Pack', cost: 80, color: '#6366f1', emoji: '🌀',
    description: 'Tier 1–2. Uncommon+ cards included.',
    tierFilter: [1, 2],
    rarityWeights: { common: 25, uncommon: 45, rare: 25, epic: 5, legendary: 0 },
  },
  {
    id: 'void', name: 'Void Pack', cost: 200, color: '#a855f7', emoji: '🌌',
    description: 'Tier 2–3. Rare and Epic cards.',
    tierFilter: [2, 3],
    rarityWeights: { common: 0, uncommon: 20, rare: 45, epic: 30, legendary: 5 },
  },
  {
    id: 'eclipse', name: 'Eclipse Pack', cost: 400, color: '#f59e0b', emoji: '🌘',
    description: 'Tier 3 only. Epic & Legendary guaranteed.',
    tierFilter: [3],
    rarityWeights: { common: 0, uncommon: 0, rare: 30, epic: 45, legendary: 25 },
  },
];

export const STARTING_COLLECTION = {
  shadow_warden: 2, chaos_arcanist: 2, void_reaver: 2, iron_specter: 2,
  shadow_energy: 4, chaos_energy: 4, void_energy: 2, iron_energy: 2,
  potion: 2, switch_card: 2, energy_retrieval: 1,
};

export const STARTING_DECK = {
  shadow_warden: 2, chaos_arcanist: 2,
  shadow_energy: 4, chaos_energy: 4,
  potion: 2, switch_card: 2,
};

export const STARTING_COINS = 80;
export const PACK_SIZE = 7;
export const MAX_DECK_SIZE = 25;
export const MIN_DECK_SIZE = 15;
export const MAX_COPIES = 4;
export const MAX_BENCH = 3;
export const PRIZE_COUNT = 3;
