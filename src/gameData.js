// ══════════════════════════════════════════════════════════════════════════
//  CHAOTIC TCG — Complete Authentic Card Database
//  Based on the 2007-2010 TV Series & Card Game
//  Tribes: Overworld · Underworld · Mipedian · M'arrillian · Danian
//  Sets: Dawn of Perim · Zenith of the Hive · Silent Sands ·
//        Secrets of the Lost City · M'arrillian Invasion · Forged Unity
// ══════════════════════════════════════════════════════════════════════════

export const TRIBE_DATA = {
  overworld:  { name: 'Overworld',   color: '#1a6ab8', dark: '#061228', glow: 'rgba(26,106,184,0.4)',   icon: '⚔️',  border: '#3A80C9', badge: '#4a90d9',  element: 'air',   bg: 'linear-gradient(135deg, #061228 0%, #0d2040 50%, #061228 100%)' },
  underworld: { name: 'Underworld',  color: '#CC2200', dark: '#12010a', glow: 'rgba(204,34,0,0.4)',     icon: '🔥',  border: '#CC2200', badge: '#dd3311',  element: 'fire',  bg: 'linear-gradient(135deg, #12010a 0%, #2a0500 50%, #12010a 100%)' },
  mipedian:   { name: 'Mipedian',    color: '#C8960C', dark: '#130d00', glow: 'rgba(200,150,12,0.4)',   icon: '🌪️',  border: '#C8960C', badge: '#d9a71d',  element: 'air',   bg: 'linear-gradient(135deg, #130d00 0%, #2a1a00 50%, #130d00 100%)' },
  marrillian: { name: "M'arrillian", color: '#009999', dark: '#001414', glow: 'rgba(0,153,153,0.4)',    icon: '🌊',  border: '#009999', badge: '#00aaaa',  element: 'water', bg: 'linear-gradient(135deg, #001414 0%, #002828 50%, #001414 100%)' },
  danian:     { name: 'Danian',      color: '#8B5A2B', dark: '#0d0800', glow: 'rgba(139,90,43,0.4)',    icon: '🐜',  border: '#8B5A2B', badge: '#9c6b3c',  element: 'earth', bg: 'linear-gradient(135deg, #0d0800 0%, #1a1000 50%, #0d0800 100%)' },
};

export const ELEMENT_DATA = {
  fire:  { color: '#ff4400', icon: '🔥', label: 'Fire',  bg: '#3a0a00' },
  air:   { color: '#88ccff', icon: '💨', label: 'Air',   bg: '#00102a' },
  earth: { color: '#886622', icon: '🌿', label: 'Earth', bg: '#1a1000' },
  water: { color: '#0099cc', icon: '💧', label: 'Water', bg: '#001a2a' },
  none:  { color: '#888888', icon: '✦',  label: 'None',  bg: '#111111' },
};

export const RARITY_DATA = {
  common:     { color: '#8a9ab0', label: 'Common',     stars: '◆',         weight: 1 },
  uncommon:   { color: '#4ade80', label: 'Uncommon',   stars: '◆◆',       weight: 2 },
  rare:       { color: '#3b82f6', label: 'Rare',       stars: '◆◆◆',     weight: 3 },
  super_rare: { color: '#a855f7', label: 'Super Rare', stars: '◆◆◆◆',   weight: 4 },
  ultra_rare: { color: '#f59e0b', label: 'Ultra Rare', stars: '◆◆◆◆◆', weight: 5 },
};

export const RARITY_STARS = Object.fromEntries(Object.entries(RARITY_DATA).map(([k,v]) => [k, v.stars]));

export const DISCIPLINE_ICON  = { courage: '⚔', power: '💪', wisdom: '✨', speed: '⚡' };
export const DISCIPLINE_COLOR = { courage: '#ef4444', power: '#f97316', wisdom: '#8b5cf6', speed: '#22d3ee' };
export const DISCIPLINE_LABEL = { courage: 'Courage', power: 'Power', wisdom: 'Wisdom', speed: 'Speed' };

export const MAX_TEAM_SIZE = 6;
export const MAX_MUGIC     = 10;
export const PACK_SIZE     = 8;

// ═══════════════════════════════════════════════════════════════════════════
// CREATURE ARCHETYPE ART PATTERNS (CSS backgrounds for card art)
// ═══════════════════════════════════════════════════════════════════════════
export const SUBTYPE_ICON = {
  Warrior:    '⚔️', Muge: '🎵', Warlord: '👑', Scout: '👁️', Giant: '🗿',
  Flyer: '🦅', Spy: '🕵️', Ghost: '👻', Scientist: '⚗️', Archivist: '📚',
  Inventor: '⚙️', Sage: '🔮', Guardian: '🛡️', Champion: '🏆', Royalty: '👑',
  Beast: '🐉', Dancer: '💃', Illusionist: '🌀', Caster: '✨', Archer: '🏹',
  Shaman: '🌿', Colossus: '🗿', Chieftain: '🦀', Brawler: '💥', Raider: '⚡',
  Tactician: '📋', Undead: '💀', Fighter: '🥊', Footsoldier: '🪖', Queen: '👸',
  Scholar: '📖', General: '🎖️',
};

// ═══════════════════════════════════════════════════════════════════════════
//  CARDS DATABASE
// ═══════════════════════════════════════════════════════════════════════════
export const CARDS = {

  // ═══════════════════════════════════════════════════════════════════════
  //  OVERWORLD CREATURES
  // ═══════════════════════════════════════════════════════════════════════

  maxxor: {
    id:'maxxor', cardType:'creature', name:'Maxxor', tribe:'overworld', subtype:'Warrior',
    courage:95, power:65, wisdom:45, speed:55, energy:80, mugicCounters:0,
    elements:['air'], rarity:'ultra_rare', set:'dawn_of_perim',
    ability: 'Recklessness: If Maxxor deals damage, deal 5 additional damage.',
    abilityType: 'passive',
    attacks:[
      { name:'Reckless Charge',    disc:'courage', build:0,  damage:20, element:'air',   effect:null,       desc:'' },
      { name:'Overworld Order',    disc:'power',   build:10, damage:30, element:'air',   effect:'heal_15',  desc:'Heal 15 Energy.' },
      { name:'Primal Smash',       disc:'power',   build:20, damage:45, element:'earth', effect:null,       desc:'' },
      { name:'Thundering Assault', disc:'courage', build:25, damage:55, element:'air',   effect:'burn_10',  desc:'Burn 10 per turn.' },
    ],
    flavorText:"Maxxor's courage is the shield of the Overworld.",
    artPattern: 'warrior_blue',
  },

  intress: {
    id:'intress', cardType:'creature', name:'Intress Natureforce', tribe:'overworld', subtype:'Muge',
    courage:50, power:45, wisdom:70, speed:55, energy:70, mugicCounters:3,
    elements:['earth'], rarity:'super_rare', set:'dawn_of_perim',
    ability: 'Healing Surge: When Intress casts Mugic, heal 10 Energy.',
    abilityType: 'passive',
    attacks:[
      { name:'Vine Whip',        disc:'courage', build:0,  damage:15, element:'earth', effect:null,      desc:'' },
      { name:'Nature Surge',     disc:'wisdom',  build:10, damage:25, element:'earth', effect:'heal_20', desc:'Heal 20 Energy.' },
      { name:'Forest Wrath',     disc:'wisdom',  build:20, damage:35, element:'earth', effect:null,      desc:'' },
    ],
    flavorText:"Nature itself bends to Intress's will.",
    artPattern: 'muge_green',
  },

  najarin: {
    id:'najarin', cardType:'creature', name:'Najarin', tribe:'overworld', subtype:'Muge',
    courage:30, power:30, wisdom:100, speed:85, energy:55, mugicCounters:4,
    elements:['air','water'], rarity:'ultra_rare', set:'dawn_of_perim',
    ability: 'Arcane Mastery: Najarin can cast Mugic of any tribe.',
    abilityType: 'passive',
    attacks:[
      { name:'Wisdom Scepter',       disc:'wisdom', build:0,  damage:20, element:'air',   effect:null,        desc:'' },
      { name:'Arcane Torrent',       disc:'wisdom', build:10, damage:35, element:'water', effect:'confuse',   desc:'Confuse opponent.' },
      { name:'Elemental Quotient',   disc:'wisdom', build:25, damage:50, element:'air',   effect:null,        desc:'' },
    ],
    flavorText:"Najarin's wisdom spans millennia of Perim's history.",
    artPattern: 'sage_blue',
  },

  tartarek: {
    id:'tartarek', cardType:'creature', name:'Tartarek', tribe:'overworld', subtype:'Warrior',
    courage:75, power:80, wisdom:35, speed:50, energy:75, mugicCounters:0,
    elements:['earth'], rarity:'rare', set:'zenith_of_hive',
    ability: 'Shockwave: Bench attacks deal 5 extra damage.',
    abilityType: 'passive',
    attacks:[
      { name:'Ground Pound',   disc:'power',   build:0,  damage:25, element:'earth', effect:null,        desc:'' },
      { name:'Battle Howl',    disc:'courage', build:10, damage:30, element:'air',   effect:null,        desc:'' },
      { name:'Stone Rampage',  disc:'power',   build:20, damage:40, element:'earth', effect:'bench_15',  desc:'15 damage to all bench creatures.' },
    ],
    flavorText:"Nothing stands in Tartarek's path for long.",
    artPattern: 'warrior_blue',
  },

  bodal: {
    id:'bodal', cardType:'creature', name:'Bodal', tribe:'overworld', subtype:'Archivist',
    courage:35, power:25, wisdom:75, speed:50, energy:50, mugicCounters:2,
    elements:['none'], rarity:'uncommon', set:'dawn_of_perim',
    ability: "Archive: When Bodal defeats a creature, add that creature's attack to your hand.",
    abilityType: 'on_ko',
    attacks:[
      { name:'Research Blast',  disc:'wisdom', build:0,  damage:15, element:'air',  effect:null, desc:'' },
      { name:'Archive Storm',   disc:'wisdom', build:10, damage:25, element:'air',  effect:null, desc:'' },
    ],
    flavorText:"Bodal has catalogued every creature in Perim's history.",
    artPattern: 'scholar_blue',
  },

  iparu: {
    id:'iparu', cardType:'creature', name:'Iparu', tribe:'overworld', subtype:'Flyer',
    courage:45, power:40, wisdom:60, speed:95, energy:45, mugicCounters:2,
    elements:['air'], rarity:'uncommon', set:'dawn_of_perim',
    ability: 'Swift: Iparu moves before other creatures during initiative.',
    abilityType: 'passive',
    attacks:[
      { name:'Fleet Foot',     disc:'speed',   build:0,  damage:15, element:'air', effect:null, desc:'' },
      { name:'Aerial Strike',  disc:'courage', build:10, damage:20, element:'air', effect:null, desc:'' },
      { name:'Wind Gust',      disc:'speed',   build:15, damage:30, element:'air', effect:'confuse', desc:'Confuse opponent.' },
    ],
    flavorText:'Iparu moves so fast even arrows miss.',
    artPattern: 'flyer_blue',
  },

  attacat: {
    id:'attacat', cardType:'creature', name:'Attacat', tribe:'overworld', subtype:'Scout',
    courage:65, power:60, wisdom:50, speed:85, energy:50, mugicCounters:0,
    elements:['air'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Cat Swipe',    disc:'speed',   build:0,  damage:10, element:'air',   effect:null, desc:'' },
      { name:'Claw Barrage', disc:'courage', build:10, damage:20, element:'none',  effect:null, desc:'' },
    ],
    flavorText:'Fast, fierce, and fearless.',
    artPattern: 'scout_blue',
  },

  hoton: {
    id:'hoton', cardType:'creature', name:'Hoton', tribe:'overworld', subtype:'Warrior',
    courage:80, power:85, wisdom:30, speed:30, energy:90, mugicCounters:0,
    elements:['earth'], rarity:'rare', set:'silent_sands',
    ability: 'Immovable: Hoton cannot be confused or frightened.',
    abilityType: 'passive',
    attacks:[
      { name:'Headlong Rush',  disc:'courage', build:0,  damage:25, element:'earth', effect:null,        desc:'' },
      { name:'Pile Driver',    disc:'power',   build:15, damage:40, element:'earth', effect:null,        desc:'' },
      { name:'Unstoppable',    disc:'power',   build:25, damage:55, element:'earth', effect:'self_10',   desc:'Lose 10 Energy.' },
    ],
    flavorText:'Hoton charges without hesitation.',
    artPattern: 'warrior_blue',
  },

  vidav: {
    id:'vidav', cardType:'creature', name:'Vidav', tribe:'overworld', subtype:'Sage',
    courage:40, power:35, wisdom:90, speed:55, energy:55, mugicCounters:3,
    elements:['air'], rarity:'uncommon', set:'dawn_of_perim',
    attacks:[
      { name:'Mind Bolt',    disc:'wisdom', build:0,  damage:20, element:'air',  effect:null,       desc:'' },
      { name:'Psionic Wave', disc:'wisdom', build:15, damage:30, element:'air',  effect:'confuse',  desc:'Confuse the opponent.' },
    ],
    flavorText:'Vidav sees the battle before it begins.',
    artPattern: 'sage_blue',
  },

  milla_iin: {
    id:'milla_iin', cardType:'creature', name:"Milla'iin", tribe:'overworld', subtype:'Guardian',
    courage:70, power:60, wisdom:65, speed:65, energy:75, mugicCounters:1,
    elements:['earth'], rarity:'rare', set:'dawn_of_perim',
    ability: 'Guardian: Reduce all damage taken by bench creatures by 5.',
    abilityType: 'passive',
    attacks:[
      { name:'Guardian Slash', disc:'courage', build:0,  damage:20, element:'air',   effect:null,        desc:'' },
      { name:'Defense Wave',   disc:'power',   build:15, damage:30, element:'earth', effect:'reduce_15', desc:'Reduce next attack by 15.' },
    ],
    flavorText:"Milla'iin guards all who cannot guard themselves.",
    artPattern: 'guardian_blue',
  },

  owis: {
    id:'owis', cardType:'creature', name:'Owis', tribe:'overworld', subtype:'Footsoldier',
    courage:55, power:45, wisdom:50, speed:70, energy:55, mugicCounters:0,
    elements:['none'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Standard Slash', disc:'courage', build:0,  damage:15, element:'none', effect:null, desc:'' },
      { name:'Rally!',         disc:'courage', build:10, damage:20, element:'air',  effect:null, desc:'' },
    ],
    flavorText:'Every army needs soldiers like Owis.',
    artPattern: 'soldier_blue',
  },

  velreth: {
    id:'velreth', cardType:'creature', name:'Velreth', tribe:'overworld', subtype:'Champion',
    courage:75, power:70, wisdom:45, speed:55, energy:85, mugicCounters:1,
    elements:['air'], rarity:'rare', set:'zenith_of_hive',
    attacks:[
      { name:'Champion Blow',   disc:'power',   build:0,  damage:30, element:'earth', effect:null, desc:'' },
      { name:'Overworld Might', disc:'courage', build:15, damage:35, element:'air',   effect:null, desc:'' },
      { name:'Victorious Roar', disc:'courage', build:25, damage:45, element:'air',   effect:'heal_10', desc:'Heal 10 Energy.' },
    ],
    flavorText:"Velreth has earned the Overworld's highest honor.",
    artPattern: 'champion_blue',
  },

  olkiex: {
    id:'olkiex', cardType:'creature', name:'Olkiex', tribe:'overworld', subtype:'Inventor',
    courage:50, power:65, wisdom:70, speed:45, energy:65, mugicCounters:1,
    elements:['earth'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Gadget Barrage',   disc:'power',  build:0,  damage:20, element:'earth', effect:null, desc:'' },
      { name:'Inventive Strike', disc:'wisdom', build:10, damage:25, element:'none',  effect:null, desc:'' },
    ],
    flavorText:"Every one of Olkiex's inventions is a weapon.",
    artPattern: 'inventor_blue',
  },

  zhade: {
    id:'zhade', cardType:'creature', name:'Zhade', tribe:'overworld', subtype:'Rogue',
    courage:60, power:50, wisdom:45, speed:80, energy:60, mugicCounters:1,
    elements:['air'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Sneak Strike', disc:'speed',   build:0,  damage:15, element:'air',  effect:null,        desc:'' },
      { name:'Backstab',     disc:'courage', build:10, damage:25, element:'none', effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:'Zhade strikes from the shadows.',
    artPattern: 'rogue_blue',
  },

  lomma: {
    id:'lomma', cardType:'creature', name:'Lomma', tribe:'overworld', subtype:'Warrior',
    courage:65, power:60, wisdom:55, speed:60, energy:75, mugicCounters:1,
    elements:['air'], rarity:'rare', set:'dawn_of_perim',
    attacks:[
      { name:'Fearless Strike', disc:'courage', build:0,  damage:20, element:'air',  effect:null,      desc:'' },
      { name:'Rally Cry',       disc:'courage', build:10, damage:25, element:'air',  effect:'heal_10', desc:'Heal 10 Energy.' },
      { name:'Heroic Charge',   disc:'power',   build:20, damage:40, element:'none', effect:null,      desc:'' },
    ],
    flavorText:'Lomma never retreats from battle.',
    artPattern: 'warrior_blue',
  },

  kaarmand: {
    id:'kaarmand', cardType:'creature', name:'Kaarmand', tribe:'overworld', subtype:'Warrior',
    courage:70, power:75, wisdom:40, speed:45, energy:80, mugicCounters:0,
    elements:['earth'], rarity:'common', set:'forged_unity',
    attacks:[
      { name:'Power Strike',  disc:'power',   build:0,  damage:20, element:'earth', effect:null, desc:'' },
      { name:'Iron Fist',     disc:'power',   build:15, damage:30, element:'none',  effect:null, desc:'' },
    ],
    flavorText:'Kaarmand forged his strength in the mountains of Perim.',
    artPattern: 'warrior_blue',
  },

  wrenelda: {
    id:'wrenelda', cardType:'creature', name:'Wrenelda', tribe:'overworld', subtype:'Muge',
    courage:40, power:35, wisdom:80, speed:60, energy:50, mugicCounters:3,
    elements:['earth'], rarity:'uncommon', set:'secrets_lost_city',
    attacks:[
      { name:'Harmony Bolt',  disc:'wisdom', build:0,  damage:15, element:'earth', effect:null,      desc:'' },
      { name:'Ancient Chant', disc:'wisdom', build:10, damage:25, element:'earth', effect:'heal_20', desc:'Heal 20 Energy.' },
    ],
    flavorText:"Wrenelda's songs reach the roots of Perim itself.",
    artPattern: 'muge_green',
  },

  targubaj: {
    id:'targubaj', cardType:'creature', name:'Targubaj', tribe:'overworld', subtype:'Champion',
    courage:80, power:70, wisdom:50, speed:60, energy:70, mugicCounters:1,
    elements:['air','earth'], rarity:'super_rare', set:'forged_unity',
    ability: 'Overworld Pride: +10 to all discipline checks when fighting Underworld.',
    abilityType: 'conditional',
    attacks:[
      { name:'Blazing Glory',   disc:'courage', build:0,  damage:25, element:'air',   effect:null,       desc:'' },
      { name:'Earth Shatter',   disc:'power',   build:15, damage:35, element:'earth', effect:'bench_10', desc:'10 to all bench enemies.' },
      { name:'Chosen Judgment', disc:'wisdom',  build:25, damage:45, element:'air',   effect:null,       desc:'' },
    ],
    flavorText:'Targubaj fights for the honor of every Overworldian.',
    artPattern: 'champion_blue',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  UNDERWORLD CREATURES
  // ═══════════════════════════════════════════════════════════════════════

  chaor: {
    id:'chaor', cardType:'creature', name:'Chaor', tribe:'underworld', subtype:'Warlord',
    courage:80, power:75, wisdom:40, speed:40, energy:65, mugicCounters:2,
    elements:['fire'], rarity:'ultra_rare', set:'dawn_of_perim',
    ability: "Chaor's Fury: When a creature is KO'd by Chaor, all enemies take 10 damage.",
    abilityType: 'on_ko',
    attacks:[
      { name:'Inferno',        disc:'power',   build:0,  damage:30, element:'fire',  effect:'burn_10',   desc:'Burn 10 per turn.' },
      { name:'Firestorm',      disc:'power',   build:15, damage:45, element:'fire',  effect:'bench_15',  desc:'15 to all enemies.' },
      { name:"Chaor's Wrath",  disc:'courage', build:25, damage:55, element:'fire',  effect:null,        desc:'' },
      { name:'Volcanic Blast', disc:'power',   build:30, damage:65, element:'fire',  effect:'burn_15',   desc:'Burn 15 per turn.' },
    ],
    flavorText:"Chaor's wrath has leveled entire Overworld cities.",
    artPattern: 'warlord_red',
  },

  kiru: {
    id:'kiru', cardType:'creature', name:'Kiru', tribe:'underworld', subtype:'Warrior',
    courage:70, power:65, wisdom:45, speed:85, energy:55, mugicCounters:1,
    elements:['fire','air'], rarity:'super_rare', set:'dawn_of_perim',
    ability: 'Blazing Speed: When Kiru attacks first in a turn, add 10 to damage.',
    abilityType: 'passive',
    attacks:[
      { name:'Blazing Strike', disc:'speed',   build:0,  damage:25, element:'fire', effect:null,       desc:'' },
      { name:'Fire Dash',      disc:'speed',   build:10, damage:30, element:'fire', effect:'burn_10',  desc:'Burn 10 per turn.' },
      { name:'Searing Blow',   disc:'power',   build:20, damage:40, element:'fire', effect:null,       desc:'' },
    ],
    flavorText:'Kiru strikes before his foes can react.',
    artPattern: 'warrior_red',
  },

  skartalas: {
    id:'skartalas', cardType:'creature', name:'Skartalas', tribe:'underworld', subtype:'Giant',
    courage:85, power:90, wisdom:30, speed:35, energy:70, mugicCounters:0,
    elements:['fire','earth'], rarity:'super_rare', set:'dawn_of_perim',
    ability: 'Colossus: Skartalas ignores the first 10 damage each attack.',
    abilityType: 'passive',
    attacks:[
      { name:'Lava Smash',    disc:'power',   build:0,  damage:35, element:'earth', effect:null,        desc:'' },
      { name:'Magma Burst',   disc:'power',   build:15, damage:50, element:'fire',  effect:'burn_10',   desc:'Burn 10 per turn.' },
      { name:'Volcanic Rage', disc:'power',   build:25, damage:65, element:'fire',  effect:'self_20',   desc:'Lose 20 Energy.' },
    ],
    flavorText:'Skartalas was born from the volcano itself.',
    artPattern: 'giant_red',
  },

  rothar: {
    id:'rothar', cardType:'creature', name:'Rothar', tribe:'underworld', subtype:'Warrior',
    courage:60, power:80, wisdom:35, speed:55, energy:80, mugicCounters:0,
    elements:['earth'], rarity:'rare', set:'dawn_of_perim',
    attacks:[
      { name:'Earth Pulse',   disc:'power',   build:0,  damage:25, element:'earth', effect:null,        desc:'' },
      { name:'Tremor Strike', disc:'power',   build:15, damage:35, element:'earth', effect:'bench_10',  desc:'10 to all enemies.' },
    ],
    flavorText:'The ground shakes wherever Rothar walks.',
    artPattern: 'warrior_red',
  },

  ulmar: {
    id:'ulmar', cardType:'creature', name:'Ulmar', tribe:'underworld', subtype:'Scientist',
    courage:30, power:40, wisdom:80, speed:55, energy:50, mugicCounters:2,
    elements:['fire'], rarity:'rare', set:'dawn_of_perim',
    ability: 'Mad Science: Ulmar\'s attacks have 50% chance to inflict an additional random status.',
    abilityType: 'passive',
    attacks:[
      { name:"Ulmar's Ray",    disc:'wisdom', build:0,  damage:20, element:'fire', effect:null,       desc:'' },
      { name:'Disintegration', disc:'wisdom', build:15, damage:35, element:'fire', effect:'burn_10',  desc:'Burn 10 per turn.' },
    ],
    flavorText:'Science and cruelty combined into one being.',
    artPattern: 'scientist_red',
  },

  gothos: {
    id:'gothos', cardType:'creature', name:'Gothos', tribe:'underworld', subtype:'Ghost',
    courage:65, power:55, wisdom:50, speed:60, energy:60, mugicCounters:1,
    elements:['none'], rarity:'uncommon', set:'dawn_of_perim',
    ability: 'Incorporeal: 25% chance to completely avoid an attack.',
    abilityType: 'passive',
    attacks:[
      { name:'Haunting Strike', disc:'courage', build:0,  damage:15, element:'none', effect:'confuse',  desc:'Confuse opponent.' },
      { name:'Terror Wave',     disc:'wisdom',  build:10, damage:25, element:'none', effect:null,       desc:'' },
      { name:'Soul Drain',      disc:'wisdom',  build:20, damage:30, element:'none', effect:'burn_5',   desc:'Burn 5 per turn.' },
    ],
    flavorText:'Gothos haunts the ruins of ancient battles.',
    artPattern: 'ghost_red',
  },

  enre_hep: {
    id:'enre_hep', cardType:'creature', name:'Enre-Hep', tribe:'underworld', subtype:'Muge',
    courage:45, power:35, wisdom:70, speed:65, energy:55, mugicCounters:3,
    elements:['fire'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Dark Pulse',  disc:'wisdom', build:0,  damage:15, element:'fire', effect:null,      desc:'' },
      { name:'Shadow Mend', disc:'wisdom', build:10, damage:10, element:'none', effect:'heal_20', desc:'Heal 20 Energy.' },
    ],
    flavorText:'Even in darkness, healing can be found.',
    artPattern: 'muge_red',
  },

  siril_ean: {
    id:'siril_ean', cardType:'creature', name:"Siril'ean", tribe:'underworld', subtype:'Spy',
    courage:55, power:50, wisdom:45, speed:90, energy:50, mugicCounters:1,
    elements:['air'], rarity:'uncommon', set:'dawn_of_perim',
    ability: 'Information Broker: See the opponent\'s attack before the discipline check.',
    abilityType: 'passive',
    attacks:[
      { name:'Shadow Dash',    disc:'speed',   build:0,  damage:15, element:'air',  effect:null, desc:'' },
      { name:'Stealth Strike', disc:'speed',   build:10, damage:20, element:'none', effect:null, desc:'' },
    ],
    flavorText:"Siril'ean knows every secret in Perim.",
    artPattern: 'spy_red',
  },

  brathe: {
    id:'brathe', cardType:'creature', name:'Brathe', tribe:'underworld', subtype:'Warrior',
    courage:90, power:95, wisdom:20, speed:25, energy:85, mugicCounters:0,
    elements:['fire','earth'], rarity:'rare', set:'dawn_of_perim',
    attacks:[
      { name:'Iron Fist',   disc:'power',   build:0,  damage:35, element:'earth', effect:null, desc:'' },
      { name:'Brutal Slam', disc:'courage', build:15, damage:45, element:'none',  effect:null, desc:'' },
    ],
    flavorText:"Nothing survives Brathe's full force.",
    artPattern: 'warrior_red',
  },

  h_earring: {
    id:'h_earring', cardType:'creature', name:"H'earring", tribe:'underworld', subtype:'Spy',
    courage:40, power:35, wisdom:55, speed:85, energy:40, mugicCounters:0,
    elements:['none'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Sneaky Jab', disc:'speed',   build:0,  damage:10, element:'none', effect:null,        desc:'' },
      { name:'Run Away!',  disc:'speed',   build:5,  damage:5,  element:'none', effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:"H'earring survives by being very, very fast.",
    artPattern: 'spy_red',
  },

  agitos: {
    id:'agitos', cardType:'creature', name:'Agitos', tribe:'underworld', subtype:'Fighter',
    courage:75, power:70, wisdom:40, speed:50, energy:70, mugicCounters:0,
    elements:['fire'], rarity:'common', set:'zenith_of_hive',
    attacks:[
      { name:'Underworld Smash', disc:'power',   build:0,  damage:20, element:'fire',  effect:null,      desc:'' },
      { name:'Fire Punch',       disc:'courage', build:10, damage:25, element:'fire',  effect:'burn_5',  desc:'Burn 5 per turn.' },
    ],
    flavorText:'Agitos fights for the glory of the Underworld.',
    artPattern: 'fighter_red',
  },

  kopond: {
    id:'kopond', cardType:'creature', name:'Kopond', tribe:'underworld', subtype:'Scout',
    courage:50, power:45, wisdom:60, speed:70, energy:55, mugicCounters:1,
    elements:['fire'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Ember Shot',   disc:'wisdom', build:0,  damage:15, element:'fire', effect:null,        desc:'' },
      { name:'Scout Report', disc:'speed',  build:5,  damage:10, element:'none', effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:"Kopond's knowledge of terrain is unmatched.",
    artPattern: 'scout_red',
  },

  dractyl: {
    id:'dractyl', cardType:'creature', name:'Dractyl', tribe:'underworld', subtype:'Flyer',
    courage:60, power:55, wisdom:35, speed:80, energy:50, mugicCounters:0,
    elements:['fire','air'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Dive Bomb',   disc:'speed',   build:0,  damage:15, element:'air',  effect:null,      desc:'' },
      { name:'Fire Breath', disc:'power',   build:10, damage:25, element:'fire', effect:'burn_5',  desc:'Burn 5 per turn.' },
    ],
    flavorText:'Dractyl rains fire from above.',
    artPattern: 'flyer_red',
  },

  tektalion: {
    id:'tektalion', cardType:'creature', name:'Tektalion', tribe:'underworld', subtype:'Tactician',
    courage:55, power:50, wisdom:65, speed:55, energy:55, mugicCounters:1,
    elements:['fire'], rarity:'uncommon', set:'dawn_of_perim',
    attacks:[
      { name:'Tactical Strike', disc:'wisdom', build:0,  damage:20, element:'fire', effect:null,        desc:'' },
      { name:'Flanking Move',   disc:'speed',  build:10, damage:20, element:'air',  effect:'reduce_15', desc:'Reduce next hit by 15.' },
    ],
    flavorText:'Tektalion wins battles before they begin.',
    artPattern: 'tactician_red',
  },

  skeletal_lord: {
    id:'skeletal_lord', cardType:'creature', name:'Skeletal Lord', tribe:'underworld', subtype:'Undead',
    courage:70, power:75, wisdom:45, speed:40, energy:80, mugicCounters:0,
    elements:['none'], rarity:'rare', set:'secrets_lost_city',
    ability: 'Undying: When KO\'d, return with 20 Energy if there is Mugic remaining.',
    abilityType: 'on_ko',
    attacks:[
      { name:'Bone Crush',  disc:'power',   build:0,  damage:30, element:'none', effect:null,       desc:'' },
      { name:'Death Grip',  disc:'courage', build:15, damage:35, element:'none', effect:'burn_10',  desc:'Burn 10 per turn.' },
    ],
    flavorText:'The lord of the dead never tires.',
    artPattern: 'undead_red',
  },

  takinom: {
    id:'takinom', cardType:'creature', name:'Takinom', tribe:'underworld', subtype:'Warrior',
    courage:65, power:70, wisdom:50, speed:75, energy:65, mugicCounters:1,
    elements:['fire','air'], rarity:'rare', set:'secrets_lost_city',
    attacks:[
      { name:'Underworld Surge', disc:'courage', build:0,  damage:25, element:'fire',  effect:null,      desc:'' },
      { name:'Crimson Slash',    disc:'speed',   build:15, damage:35, element:'air',   effect:null,      desc:'' },
      { name:'Infernal Cleave',  disc:'power',   build:20, damage:40, element:'fire',  effect:'burn_5',  desc:'Burn 5 per turn.' },
    ],
    flavorText:'Takinom is as quick as she is deadly.',
    artPattern: 'warrior_red',
  },

  borth_majar: {
    id:'borth_majar', cardType:'creature', name:'Borth-Majar', tribe:'underworld', subtype:'Warlord',
    courage:85, power:80, wisdom:35, speed:35, energy:85, mugicCounters:1,
    elements:['fire','earth'], rarity:'super_rare', set:'forged_unity',
    ability: 'Warlord\'s Decree: All Underworld allies gain +5 to all disciplines.',
    abilityType: 'passive',
    attacks:[
      { name:'Warlord\'s Strike',  disc:'courage', build:0,  damage:30, element:'fire',  effect:null,       desc:'' },
      { name:'Volcanic Fist',      disc:'power',   build:15, damage:40, element:'earth', effect:null,       desc:'' },
      { name:'Inferno Command',    disc:'power',   build:25, damage:50, element:'fire',  effect:'bench_10', desc:'10 to all bench enemies.' },
    ],
    flavorText:'Borth-Majar has never lost a war.',
    artPattern: 'warlord_red',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  MIPEDIAN CREATURES
  // ═══════════════════════════════════════════════════════════════════════

  frafdo: {
    id:'frafdo', cardType:'creature', name:'Frafdo', tribe:'mipedian', subtype:'Muge',
    courage:40, power:30, wisdom:60, speed:130, energy:35, mugicCounters:2,
    elements:['air'], rarity:'ultra_rare', set:'dawn_of_perim',
    ability: 'Invisibility: Frafdo cannot be targeted by the first attack each battle.',
    abilityType: 'passive',
    attacks:[
      { name:'Sands of Silence', disc:'speed',  build:0,  damage:20, element:'air',   effect:'confuse',  desc:'Confuse opponent.' },
      { name:'Mirage Strike',    disc:'speed',  build:15, damage:30, element:'air',   effect:null,       desc:'' },
      { name:'Desert Wind',      disc:'wisdom', build:20, damage:35, element:'air',   effect:null,       desc:'' },
    ],
    flavorText:'No one in Perim is faster than Frafdo.',
    artPattern: 'muge_gold',
  },

  wagram: {
    id:'wagram', cardType:'creature', name:'Wagram', tribe:'mipedian', subtype:'General',
    courage:50, power:45, wisdom:55, speed:95, energy:55, mugicCounters:2,
    elements:['air'], rarity:'super_rare', set:'dawn_of_perim',
    ability: 'Desert Commander: All Mipedian allies gain +10 Speed.',
    abilityType: 'passive',
    attacks:[
      { name:'Typhoon',        disc:'speed',  build:0,  damage:25, element:'air',  effect:null,        desc:'' },
      { name:'Windstorm',      disc:'wisdom', build:15, damage:30, element:'air',  effect:'bench_10',  desc:'10 to all enemies.' },
      { name:'Desert Cyclone', disc:'speed',  build:20, damage:40, element:'air',  effect:null,        desc:'' },
    ],
    flavorText:'Wagram commands the very winds of the desert.',
    artPattern: 'general_gold',
  },

  kolmo: {
    id:'kolmo', cardType:'creature', name:'Kolmo', tribe:'mipedian', subtype:'Warrior',
    courage:75, power:70, wisdom:40, speed:65, energy:70, mugicCounters:0,
    elements:['air','earth'], rarity:'rare', set:'dawn_of_perim',
    attacks:[
      { name:'Sand Slash',    disc:'courage', build:0,  damage:25, element:'earth', effect:null, desc:'' },
      { name:'Desert Strike', disc:'power',   build:15, damage:35, element:'air',   effect:null, desc:'' },
      { name:'Dune Breaker',  disc:'power',   build:25, damage:45, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Kolmo has survived every desert the Mipedians call home.',
    artPattern: 'warrior_gold',
  },

  aimren: {
    id:'aimren', cardType:'creature', name:'Aimren', tribe:'mipedian', subtype:'Royalty',
    courage:60, power:55, wisdom:65, speed:75, energy:65, mugicCounters:2,
    elements:['air'], rarity:'rare', set:'zenith_of_hive',
    ability: 'Royal Decree: Once per game, automatically win a discipline check.',
    abilityType: 'active',
    attacks:[
      { name:'Royal Command', disc:'wisdom', build:0,  damage:25, element:'air',  effect:'heal_10', desc:'Heal 10 Energy.' },
      { name:'Swift Justice', disc:'speed',  build:15, damage:30, element:'air',  effect:null,      desc:'' },
    ],
    flavorText:'Aimren rules the Mipedians with wisdom and speed.',
    artPattern: 'royalty_gold',
  },

  ursis: {
    id:'ursis', cardType:'creature', name:'Ursis', tribe:'mipedian', subtype:'Beast',
    courage:85, power:90, wisdom:25, speed:40, energy:80, mugicCounters:0,
    elements:['earth'], rarity:'rare', set:'silent_sands',
    attacks:[
      { name:'Sand Crush',    disc:'power',   build:0,  damage:35, element:'earth', effect:null,       desc:'' },
      { name:'Beast Rampage', disc:'courage', build:20, damage:50, element:'earth', effect:'self_10',  desc:'Lose 10 Energy.' },
    ],
    flavorText:'Ursis is the largest creature in the Mipedian desert.',
    artPattern: 'beast_gold',
  },

  maliph: {
    id:'maliph', cardType:'creature', name:'Maliph', tribe:'mipedian', subtype:'Scout',
    courage:45, power:40, wisdom:55, speed:100, energy:45, mugicCounters:1,
    elements:['air'], rarity:'uncommon', set:'dawn_of_perim',
    attacks:[
      { name:'Blurring Gust', disc:'speed', build:0,  damage:15, element:'air', effect:null, desc:'' },
      { name:'Sand Dart',     disc:'speed', build:10, damage:20, element:'air', effect:null, desc:'' },
    ],
    flavorText:'Maliph has never been caught in over 500 missions.',
    artPattern: 'scout_gold',
  },

  vinta: {
    id:'vinta', cardType:'creature', name:'Vinta', tribe:'mipedian', subtype:'Dancer',
    courage:35, power:30, wisdom:80, speed:110, energy:40, mugicCounters:3,
    elements:['air'], rarity:'uncommon', set:'dawn_of_perim',
    attacks:[
      { name:'Dance Strike',  disc:'speed',  build:0,  damage:15, element:'air',  effect:null,       desc:'' },
      { name:'Harmony Wave',  disc:'wisdom', build:10, damage:20, element:'air',  effect:'confuse',  desc:'Confuse opponent.' },
    ],
    flavorText:"Vinta's dance is both beautiful and deadly.",
    artPattern: 'dancer_gold',
  },

  xelfe: {
    id:'xelfe', cardType:'creature', name:'Xelfe', tribe:'mipedian', subtype:'Muge',
    courage:40, power:35, wisdom:90, speed:70, energy:50, mugicCounters:3,
    elements:['air'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Mirage Bolt',    disc:'wisdom', build:0,  damage:20, element:'air',  effect:null, desc:'' },
      { name:'Illusion Storm', disc:'wisdom', build:15, damage:35, element:'air',  effect:null, desc:'' },
    ],
    flavorText:"Reality bends before Xelfe's mastery of illusion.",
    artPattern: 'muge_gold',
  },

  ario: {
    id:'ario', cardType:'creature', name:'Ario', tribe:'mipedian', subtype:'Scout',
    courage:50, power:45, wisdom:40, speed:90, energy:45, mugicCounters:0,
    elements:['air'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Quick Strike', disc:'speed',   build:0,  damage:10, element:'air',  effect:null,       desc:'' },
      { name:'Dust Cloud',   disc:'speed',   build:5,  damage:15, element:'air',  effect:'confuse',  desc:'Confuse opponent.' },
    ],
    flavorText:'Ario scouts ahead so others can fight safely.',
    artPattern: 'scout_gold',
  },

  onyx_mip: {
    id:'onyx_mip', cardType:'creature', name:'Onyx', tribe:'mipedian', subtype:'Warrior',
    courage:70, power:65, wisdom:35, speed:60, energy:65, mugicCounters:0,
    elements:['earth'], rarity:'common', set:'dawn_of_perim',
    attacks:[
      { name:'Desert Slash', disc:'courage', build:0,  damage:15, element:'earth', effect:null, desc:'' },
      { name:'Sand Blow',    disc:'power',   build:10, damage:25, element:'air',   effect:null, desc:'' },
    ],
    flavorText:'Onyx is named for the color of the desert at midnight.',
    artPattern: 'warrior_gold',
  },

  saand: {
    id:'saand', cardType:'creature', name:'Saand', tribe:'mipedian', subtype:'Caster',
    courage:35, power:30, wisdom:75, speed:80, energy:45, mugicCounters:2,
    elements:['air'], rarity:'common', set:'silent_sands',
    attacks:[
      { name:'Sandstorm',  disc:'speed',  build:0,  damage:15, element:'air',   effect:'bench_5',  desc:'5 to all enemies.' },
      { name:'Sand Veil',  disc:'wisdom', build:10, damage:20, element:'air',   effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:'Saand summons sandstorms from thin air.',
    artPattern: 'caster_gold',
  },

  illax: {
    id:'illax', cardType:'creature', name:'Illax', tribe:'mipedian', subtype:'Illusionist',
    courage:30, power:25, wisdom:85, speed:75, energy:40, mugicCounters:3,
    elements:['air'], rarity:'uncommon', set:'secrets_lost_city',
    attacks:[
      { name:'Mirror Image',   disc:'wisdom', build:0,  damage:15, element:'air',  effect:'confuse',  desc:'Confuse opponent.' },
      { name:'Phantom Strike', disc:'speed',  build:10, damage:20, element:'air',  effect:null,       desc:'' },
    ],
    flavorText:"Illax's opponent never knows which strike is real.",
    artPattern: 'illusionist_gold',
  },

  mazerot: {
    id:'mazerot', cardType:'creature', name:'Mazerot', tribe:'mipedian', subtype:'General',
    courage:70, power:65, wisdom:60, speed:80, energy:70, mugicCounters:1,
    elements:['air','earth'], rarity:'super_rare', set:'silent_sands',
    ability: 'Sand Armor: Mazerot reduces all incoming damage by 10.',
    abilityType: 'passive',
    attacks:[
      { name:'Desert Command',  disc:'courage', build:0,  damage:25, element:'air',   effect:null,       desc:'' },
      { name:'Dune Charge',     disc:'speed',   build:15, damage:35, element:'earth', effect:null,       desc:'' },
      { name:'Mirage Army',     disc:'wisdom',  build:25, damage:45, element:'air',   effect:'bench_10', desc:'10 to all bench enemies.' },
    ],
    flavorText:'Mazerot commands armies that appear from nowhere.',
    artPattern: 'general_gold',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  M'ARRILLIAN CREATURES
  // ═══════════════════════════════════════════════════════════════════════

  phelphor: {
    id:'phelphor', cardType:'creature', name:'Phelphor', tribe:'marrillian', subtype:'Chieftain',
    courage:50, power:45, wisdom:80, speed:80, energy:45, mugicCounters:3,
    elements:['water'], rarity:'ultra_rare', set:'marrillian_invasion',
    ability: 'Mind Control: Once per game, take control of an opponent\'s creature for one turn.',
    abilityType: 'active',
    attacks:[
      { name:'Mind Breach',      disc:'wisdom', build:0,  damage:25, element:'water', effect:'confuse',   desc:'Confuse opponent.' },
      { name:'Tidal Wave',       disc:'wisdom', build:15, damage:40, element:'water', effect:'bench_10',  desc:'10 to all enemies.' },
      { name:'Deep Hum Control', disc:'speed',  build:20, damage:35, element:'water', effect:null,        desc:'' },
      { name:'Psychic Tsunami',  disc:'wisdom', build:30, damage:55, element:'water', effect:'confuse',   desc:'Confuse opponent.' },
    ],
    flavorText:"Phelphor's will is stronger than any current.",
    artPattern: 'chieftain_teal',
  },

  aa_une: {
    id:'aa_une', cardType:'creature', name:"Aa'une the Oligarch", tribe:'marrillian', subtype:'Warlord',
    courage:70, power:65, wisdom:90, speed:70, energy:60, mugicCounters:4,
    elements:['water'], rarity:'ultra_rare', set:'marrillian_invasion',
    ability: "Oligarch's Will: All M'arrillian creatures gain +15 Wisdom.",
    abilityType: 'passive',
    attacks:[
      { name:"Aa'une's Tide",     disc:'wisdom', build:0,  damage:30, element:'water', effect:null,        desc:'' },
      { name:'Deep Sea Pressure', disc:'power',  build:15, damage:40, element:'water', effect:'burn_10',   desc:'Burn 10 per turn.' },
      { name:'Oligarch Decree',   disc:'wisdom', build:25, damage:55, element:'water', effect:'bench_10',  desc:'10 to all enemies.' },
    ],
    flavorText:"Aa'une rules the deep with an iron will.",
    artPattern: 'warlord_teal',
  },

  karlen: {
    id:'karlen', cardType:'creature', name:'Karlen', tribe:'marrillian', subtype:'Warrior',
    courage:65, power:60, wisdom:55, speed:55, energy:60, mugicCounters:1,
    elements:['water'], rarity:'super_rare', set:'marrillian_invasion',
    attacks:[
      { name:'Aqua Slash',    disc:'power',  build:0,  damage:25, element:'water', effect:null, desc:'' },
      { name:'Current Blast', disc:'speed',  build:10, damage:30, element:'water', effect:null, desc:'' },
      { name:'Deep Strike',   disc:'power',  build:20, damage:40, element:'water', effect:null, desc:'' },
    ],
    flavorText:'Karlen is the finest warrior the seas have produced.',
    artPattern: 'warrior_teal',
  },

  mudeenu: {
    id:'mudeenu', cardType:'creature', name:'Mudeenu', tribe:'marrillian', subtype:'Muge',
    courage:35, power:30, wisdom:95, speed:65, energy:50, mugicCounters:4,
    elements:['water'], rarity:'rare', set:'marrillian_invasion',
    attacks:[
      { name:'Mental Flood',  disc:'wisdom', build:0,  damage:25, element:'water', effect:null,       desc:'' },
      { name:'Psionic Crush', disc:'wisdom', build:15, damage:40, element:'water', effect:'confuse',  desc:'Confuse opponent.' },
    ],
    flavorText:"Mudeenu's wisdom flows like the deep ocean currents.",
    artPattern: 'muge_teal',
  },

  nunk_worn: {
    id:'nunk_worn', cardType:'creature', name:"Nunk'worn", tribe:'marrillian', subtype:'Colossus',
    courage:80, power:85, wisdom:35, speed:30, energy:75, mugicCounters:0,
    elements:['water','earth'], rarity:'rare', set:'marrillian_invasion',
    ability: 'Colossal Form: Nunk\'worn cannot be swapped out by opponent effects.',
    abilityType: 'passive',
    attacks:[
      { name:'Tidal Slam',  disc:'power',   build:0,  damage:35, element:'water', effect:null, desc:'' },
      { name:'Wave Crush',  disc:'courage', build:15, damage:45, element:'water', effect:null, desc:'' },
    ],
    flavorText:"Nunk'worn can capsize entire fleets.",
    artPattern: 'colossus_teal',
  },

  kharit: {
    id:'kharit', cardType:'creature', name:'Kharit', tribe:'marrillian', subtype:'Raider',
    courage:55, power:50, wisdom:60, speed:80, energy:55, mugicCounters:1,
    elements:['water'], rarity:'uncommon', set:'marrillian_invasion',
    attacks:[
      { name:'Sea Dart',     disc:'speed',  build:0,  damage:15, element:'water', effect:null, desc:'' },
      { name:'Current Rush', disc:'speed',  build:10, damage:20, element:'water', effect:null, desc:'' },
    ],
    flavorText:'Kharit raids coastal settlements without mercy.',
    artPattern: 'raider_teal',
  },

  fivarth: {
    id:'fivarth', cardType:'creature', name:'Fivarth', tribe:'marrillian', subtype:'Archer',
    courage:70, power:65, wisdom:50, speed:60, energy:65, mugicCounters:0,
    elements:['water'], rarity:'uncommon', set:'dawn_of_perim',
    attacks:[
      { name:'Aqua Bolt',     disc:'power', build:0,  damage:20, element:'water', effect:null,       desc:'' },
      { name:'Coral Barrage', disc:'power', build:10, damage:30, element:'water', effect:'bench_5',  desc:'5 to all enemies.' },
    ],
    flavorText:'Fivarth never misses at range.',
    artPattern: 'archer_teal',
  },

  brebe: {
    id:'brebe', cardType:'creature', name:'Brebe', tribe:'marrillian', subtype:'Shaman',
    courage:45, power:55, wisdom:75, speed:60, energy:55, mugicCounters:2,
    elements:['water'], rarity:'uncommon', set:'marrillian_invasion',
    attacks:[
      { name:'Tide Blessing', disc:'wisdom', build:0,  damage:15, element:'water', effect:'heal_15', desc:'Heal 15 Energy.' },
      { name:'Sea Surge',     disc:'wisdom', build:10, damage:25, element:'water', effect:null,      desc:'' },
    ],
    flavorText:"Brebe's blessings keep M'arrillian warriors alive.",
    artPattern: 'shaman_teal',
  },

  unda_dex: {
    id:'unda_dex', cardType:'creature', name:"Unda'dex", tribe:'marrillian', subtype:'Warrior',
    courage:60, power:70, wisdom:65, speed:50, energy:60, mugicCounters:0,
    elements:['water'], rarity:'common', set:'marrillian_invasion',
    attacks:[
      { name:'Current Slash', disc:'power', build:0,  damage:20, element:'water', effect:null, desc:'' },
      { name:'Deep Thrust',   disc:'power', build:10, damage:25, element:'water', effect:null, desc:'' },
    ],
    flavorText:'A soldier of the deep, loyal to the last.',
    artPattern: 'warrior_teal',
  },

  ixxik: {
    id:'ixxik', cardType:'creature', name:'Ixxik', tribe:'marrillian', subtype:'Brawler',
    courage:65, power:70, wisdom:35, speed:55, energy:60, mugicCounters:0,
    elements:['water'], rarity:'common', set:'marrillian_invasion',
    attacks:[
      { name:'Aqua Punch',  disc:'courage', build:0,  damage:15, element:'water', effect:null, desc:'' },
      { name:'Tidal Bash',  disc:'power',   build:10, damage:25, element:'water', effect:null, desc:'' },
    ],
    flavorText:"Ixxik's punches hit as hard as crashing waves.",
    artPattern: 'brawler_teal',
  },

  scrup: {
    id:'scrup', cardType:'creature', name:'Scrup', tribe:'marrillian', subtype:'Warrior',
    courage:50, power:60, wisdom:55, speed:65, energy:55, mugicCounters:1,
    elements:['water'], rarity:'common', set:'marrillian_invasion',
    attacks:[
      { name:'Sea Slash',      disc:'power', build:0,  damage:15, element:'water', effect:null,       desc:'' },
      { name:'Aqua Ambush',    disc:'speed', build:10, damage:20, element:'water', effect:null,       desc:'' },
    ],
    flavorText:"Scrup surfaces without warning to attack.",
    artPattern: 'warrior_teal',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  DANIAN CREATURES
  // ═══════════════════════════════════════════════════════════════════════

  illexia: {
    id:'illexia', cardType:'creature', name:'Illexia', tribe:'danian', subtype:'Queen',
    courage:60, power:55, wisdom:80, speed:65, energy:70, mugicCounters:4,
    elements:['earth'], rarity:'ultra_rare', set:'zenith_of_hive',
    ability: 'Hive Queen: All Danian allies regenerate 5 Energy at the start of each turn.',
    abilityType: 'passive',
    attacks:[
      { name:"Queen's Mandate",  disc:'wisdom', build:0,  damage:25, element:'earth', effect:'heal_15',  desc:'Heal 15 Energy.' },
      { name:'Hive Swarm',       disc:'courage', build:15, damage:35, element:'earth', effect:'bench_10', desc:'10 to all enemies.' },
      { name:'Colony Strike',    disc:'power',   build:25, damage:50, element:'earth', effect:null,       desc:'' },
    ],
    flavorText:'All Danians serve the Queen without question.',
    artPattern: 'queen_brown',
  },

  niadar: {
    id:'niadar', cardType:'creature', name:'Niadar', tribe:'danian', subtype:'Champion',
    courage:75, power:70, wisdom:55, speed:60, energy:80, mugicCounters:2,
    elements:['earth'], rarity:'super_rare', set:'zenith_of_hive',
    ability: 'Nest Defense: When fighting at a Danian location, +20 to all disciplines.',
    abilityType: 'conditional',
    attacks:[
      { name:'Pincer Strike',   disc:'courage', build:0,  damage:25, element:'earth', effect:null,      desc:'' },
      { name:'Colony Charge',   disc:'power',   build:15, damage:35, element:'earth', effect:null,      desc:'' },
      { name:'Hive Warrior',    disc:'courage', build:25, damage:45, element:'earth', effect:'heal_10', desc:'Heal 10 Energy.' },
    ],
    flavorText:"Niadar never retreats while Danians still stand.",
    artPattern: 'champion_brown',
  },

  hifdan: {
    id:'hifdan', cardType:'creature', name:'Hifdan', tribe:'danian', subtype:'Champion',
    courage:70, power:65, wisdom:50, speed:55, energy:75, mugicCounters:1,
    elements:['earth'], rarity:'super_rare', set:'zenith_of_hive',
    attacks:[
      { name:'Mandible Slash',  disc:'courage', build:0,  damage:25, element:'earth', effect:null,      desc:'' },
      { name:'Colony Power',    disc:'power',   build:15, damage:35, element:'earth', effect:null,      desc:'' },
      { name:'Earth Shaker',    disc:'power',   build:25, damage:50, element:'earth', effect:'bench_5', desc:'5 to all bench enemies.' },
    ],
    flavorText:'Hifdan leads the vanguard of every Danian assault.',
    artPattern: 'champion_brown',
  },

  wamma: {
    id:'wamma', cardType:'creature', name:'Wamma', tribe:'danian', subtype:'Warrior',
    courage:65, power:75, wisdom:40, speed:50, energy:70, mugicCounters:0,
    elements:['earth'], rarity:'rare', set:'zenith_of_hive',
    attacks:[
      { name:'Chitin Strike',  disc:'power',   build:0,  damage:25, element:'earth', effect:null, desc:'' },
      { name:'Tunnel Charge',  disc:'courage', build:15, damage:35, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Wamma bursts from the ground without warning.',
    artPattern: 'warrior_brown',
  },

  lore: {
    id:'lore', cardType:'creature', name:'Lore', tribe:'danian', subtype:'Scholar',
    courage:35, power:30, wisdom:85, speed:55, energy:50, mugicCounters:3,
    elements:['earth'], rarity:'rare', set:'zenith_of_hive',
    ability: 'Ancient Knowledge: Lore knows the opponent\'s entire hand.',
    abilityType: 'passive',
    attacks:[
      { name:'Knowledge Bolt',   disc:'wisdom', build:0,  damage:20, element:'earth', effect:null,       desc:'' },
      { name:'Ancient Wisdom',   disc:'wisdom', build:15, damage:30, element:'earth', effect:'reduce_15', desc:'Reduce next hit by 15.' },
    ],
    flavorText:'Lore has memorized every battle in Danian history.',
    artPattern: 'scholar_brown',
  },

  elna: {
    id:'elna', cardType:'creature', name:'Elna', tribe:'danian', subtype:'Muge',
    courage:40, power:35, wisdom:75, speed:60, energy:50, mugicCounters:3,
    elements:['earth'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Hive Song',    disc:'wisdom', build:0,  damage:15, element:'earth', effect:'heal_15',  desc:'Heal 15 Energy.' },
      { name:'Colony Pulse', disc:'wisdom', build:10, damage:25, element:'earth', effect:null,       desc:'' },
    ],
    flavorText:"Elna's music resonates throughout the entire hive.",
    artPattern: 'muge_brown',
  },

  tassanil: {
    id:'tassanil', cardType:'creature', name:'Tassanil', tribe:'danian', subtype:'Warrior',
    courage:60, power:55, wisdom:45, speed:65, energy:60, mugicCounters:1,
    elements:['earth'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Compound Strike', disc:'courage', build:0,  damage:15, element:'earth', effect:null, desc:'' },
      { name:'Mandible Thrust', disc:'power',   build:10, damage:25, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Tassanil has mastered every Danian fighting style.',
    artPattern: 'warrior_brown',
  },

  odu_bathax: {
    id:'odu_bathax', cardType:'creature', name:'Odu-Bathax', tribe:'danian', subtype:'Warrior',
    courage:70, power:65, wisdom:35, speed:45, energy:65, mugicCounters:0,
    elements:['earth'], rarity:'uncommon', set:'zenith_of_hive',
    attacks:[
      { name:'Earth Punch',   disc:'power',   build:0,  damage:20, element:'earth', effect:null, desc:'' },
      { name:'Tunnel Burst',  disc:'courage', build:10, damage:25, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Odu-Bathax tunnels beneath the battlefield unseen.',
    artPattern: 'warrior_brown',
  },

  raznus: {
    id:'raznus', cardType:'creature', name:'Raznus', tribe:'danian', subtype:'Scout',
    courage:55, power:50, wisdom:55, speed:70, energy:50, mugicCounters:1,
    elements:['earth'], rarity:'common', set:'zenith_of_hive',
    attacks:[
      { name:'Ant Bite',     disc:'courage', build:0,  damage:10, element:'earth', effect:null, desc:'' },
      { name:'Colony Rush',  disc:'speed',   build:5,  damage:15, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Raznus carries news to and from the deepest tunnels.',
    artPattern: 'scout_brown',
  },

  eegatat: {
    id:'eegatat', cardType:'creature', name:'Eegatat', tribe:'danian', subtype:'Warrior',
    courage:60, power:55, wisdom:40, speed:55, energy:55, mugicCounters:0,
    elements:['earth'], rarity:'common', set:'zenith_of_hive',
    attacks:[
      { name:'Claw Swipe',    disc:'courage', build:0,  damage:10, element:'earth', effect:null, desc:'' },
      { name:'Pincer Grab',   disc:'power',   build:5,  damage:15, element:'earth', effect:null, desc:'' },
    ],
    flavorText:'Eegatat is among the most loyal of the Danian warriors.',
    artPattern: 'warrior_brown',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  BATTLEGEAR
  // ═══════════════════════════════════════════════════════════════════════

  mowercycle: {
    id:'mowercycle', cardType:'battlegear', name:'Mowercycle', tribe:null,
    rarity:'uncommon', set:'dawn_of_perim',
    bonuses:{ speed:15 },
    effect:'burn_on_hit', effectLabel:'Burns opponent 5 on hit.',
    description:'A blazing vehicle that adds speed and scorches on impact.',
  },

  whepcrack: {
    id:'whepcrack', cardType:'battlegear', name:'Whepcrack', tribe:null,
    rarity:'common', set:'dawn_of_perim',
    bonuses:{ courage:10 },
    effect:null,
    description:'A crackling whip that bolsters courage.',
  },

  torrent_krinth: {
    id:'torrent_krinth', cardType:'battlegear', name:'Torrent Krinth', tribe:'marrillian',
    rarity:'rare', set:'marrillian_invasion',
    bonuses:{ power:15, energy:10 },
    effect:'water_boost', effectLabel:'Water attacks deal 10 extra damage.',
    description:"One of the M'arrillians' most powerful weapons.",
  },

  undoblade: {
    id:'undoblade', cardType:'battlegear', name:'Undoblade', tribe:null,
    rarity:'rare', set:'secrets_lost_city',
    bonuses:{ power:20 },
    effect:'negate_on_equip', effectLabel:'Negate the first attack in battle.',
    description:'A blade that cuts through even magical attacks.',
  },

  spectral_viewer: {
    id:'spectral_viewer', cardType:'battlegear', name:'Spectral Viewer', tribe:null,
    rarity:'uncommon', set:'dawn_of_perim',
    bonuses:{ wisdom:15 },
    effect:'confuse_on_hit', effectLabel:'Confuses opponent on hit.',
    description:'Distorts the opponent\'s perception of reality.',
  },

  blanks: {
    id:'blanks', cardType:'battlegear', name:'Blanks', tribe:null,
    rarity:'uncommon', set:'dawn_of_perim',
    bonuses:{ speed:10, courage:5 },
    effect:null,
    description:'Lightweight armor that sacrifices nothing.',
  },

  shield_of_citofon: {
    id:'shield_of_citofon', cardType:'battlegear', name:'Shield of Citofon', tribe:'overworld',
    rarity:'rare', set:'dawn_of_perim',
    bonuses:{ energy:20 },
    effect:'reflect_10', effectLabel:'Reflects 10 damage when hit.',
    description:"The Overworld's legendary defensive artifact.",
  },

  talisman_of_cular: {
    id:'talisman_of_cular', cardType:'battlegear', name:'Talisman of Cular', tribe:'overworld',
    rarity:'super_rare', set:'zenith_of_hive',
    bonuses:{ wisdom:20, mugicCounters:1 },
    effect:null,
    description:'Ancient Overworld relic granting arcane power.',
  },

  skullscan: {
    id:'skullscan', cardType:'battlegear', name:'Skullscan', tribe:null,
    rarity:'uncommon', set:'dawn_of_perim',
    bonuses:{ power:10 },
    effect:'burn_on_hit', effectLabel:'Burns opponent 5 on hit.',
    description:'A skull-shaped scanner that burns what it reads.',
  },

  shadowleaf: {
    id:'shadowleaf', cardType:'battlegear', name:'Shadowleaf', tribe:'mipedian',
    rarity:'rare', set:'silent_sands',
    bonuses:{ speed:20, courage:5 },
    effect:null,
    description:'A Mipedian blade hidden in shadow.',
  },

  dagger_of_deleator: {
    id:'dagger_of_deleator', cardType:'battlegear', name:'Dagger of Deleator', tribe:null,
    rarity:'rare', set:'secrets_lost_city',
    bonuses:{ power:15, speed:5 },
    effect:'burn_on_hit', effectLabel:'Burns opponent 10 on hit.',
    description:'A cursed dagger that burns on contact.',
  },

  van_bloot_scepter: {
    id:'van_bloot_scepter', cardType:'battlegear', name:"Van Bloot's Scepter", tribe:'underworld',
    rarity:'super_rare', set:'dawn_of_perim',
    bonuses:{ power:25, courage:5 },
    effect:'confuse_on_hit', effectLabel:'Confuses opponent on hit.',
    description:"Van Bloot's command staff twists the mind.",
  },

  heptadd_shard: {
    id:'heptadd_shard', cardType:'battlegear', name:"Heptadd's Shard", tribe:'danian',
    rarity:'rare', set:'zenith_of_hive',
    bonuses:{ wisdom:15, energy:10 },
    effect:'heal_on_hit', effectLabel:'Heal 5 Energy when you deal damage.',
    description:'A crystalline shard of the Danian ancestral mound.',
  },

  nexus_fused: {
    id:'nexus_fused', cardType:'battlegear', name:'Nexus Fused', tribe:null,
    rarity:'super_rare', set:'forged_unity',
    bonuses:{ courage:15, power:10, wisdom:10, speed:10 },
    effect:null,
    description:'Forged from the nexus energy, this gear enhances every discipline.',
  },

  minion_scanner: {
    id:'minion_scanner', cardType:'battlegear', name:'Minion Scanner', tribe:null,
    rarity:'common', set:'dawn_of_perim',
    bonuses:{ courage:5, speed:5 },
    effect:null,
    description:'A basic scanner used by all Chaotic players.',
  },

  lava_pond: {
    id:'lava_pond', cardType:'battlegear', name:'Lava Pond', tribe:'underworld',
    rarity:'uncommon', set:'dawn_of_perim',
    bonuses:{ power:15 },
    effect:'burn_on_hit', effectLabel:'Burns opponent 10 on hit.',
    description:'A smoldering gauntlet that burns everything it touches.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  MUGIC CARDS
  // ═══════════════════════════════════════════════════════════════════════

  melody_of_miracles: {
    id:'melody_of_miracles', cardType:'mugic', name:'Melody of Miracles', tribe:'overworld',
    cost:1, rarity:'uncommon', set:'dawn_of_perim',
    effect:'heal_30', effectLabel:'Heal active creature 30 Energy.',
    description:'A healing song known only to Overworld Muges.',
    restriction:'overworld',
  },

  cadence_of_courage: {
    id:'cadence_of_courage', cardType:'mugic', name:'Cadence of Courage', tribe:'overworld',
    cost:2, rarity:'rare', set:'dawn_of_perim',
    effect:'boost_courage_30', effectLabel:'+30 Courage this turn.',
    description:"Boosts a warrior's battle spirit to extraordinary heights.",
    restriction:'overworld',
  },

  symphony_of_protection: {
    id:'symphony_of_protection', cardType:'mugic', name:'Symphony of Protection', tribe:'overworld',
    cost:1, rarity:'rare', set:'zenith_of_hive',
    effect:'reduce_dmg_next_30', effectLabel:'Reduce next incoming attack by 30.',
    description:'A ward of sound that absorbs devastating blows.',
    restriction:'overworld',
  },

  refrain_of_denial: {
    id:'refrain_of_denial', cardType:'mugic', name:'Refrain of Denial', tribe:null,
    cost:1, rarity:'rare', set:'dawn_of_perim',
    effect:'negate_attack', effectLabel:'Negate opponent\'s next attack.',
    description:'The counter-song that silences any attack.',
    restriction:null,
  },

  cadence_of_malevolence: {
    id:'cadence_of_malevolence', cardType:'mugic', name:'Cadence of Malevolence', tribe:'underworld',
    cost:1, rarity:'uncommon', set:'dawn_of_perim',
    effect:'burn_opponent_15', effectLabel:'Burn opponent for 15 per turn.',
    description:'A dark melody that sets the soul on fire.',
    restriction:'underworld',
  },

  ode_to_obscurity: {
    id:'ode_to_obscurity', cardType:'mugic', name:'Ode to Obscurity', tribe:'mipedian',
    cost:2, rarity:'rare', set:'silent_sands',
    effect:'confuse_opponent', effectLabel:'Confuse opponent creature.',
    description:'A disorienting desert song that clouds the mind.',
    restriction:'mipedian',
  },

  storm_song: {
    id:'storm_song', cardType:'mugic', name:'Storm Song', tribe:'underworld',
    cost:2, rarity:'super_rare', set:'dawn_of_perim',
    effect:'heal_50', effectLabel:'Heal active creature 50 Energy.',
    description:'A thunderous anthem from the Underworld depths.',
    restriction:'underworld',
  },

  mantra_of_speed: {
    id:'mantra_of_speed', cardType:'mugic', name:'Mantra of Speed', tribe:'mipedian',
    cost:1, rarity:'uncommon', set:'dawn_of_perim',
    effect:'boost_speed_30', effectLabel:'+30 Speed this turn.',
    description:'A meditative chant that accelerates thought and action.',
    restriction:'mipedian',
  },

  deep_hum: {
    id:'deep_hum', cardType:'mugic', name:'Deep Hum', tribe:'marrillian',
    cost:2, rarity:'rare', set:'marrillian_invasion',
    effect:'confuse_opponent', effectLabel:'Confuse opponent creature.',
    description:"The M'arrillians' most feared psychic resonance.",
    restriction:'marrillian',
  },

  hymn_of_the_hive: {
    id:'hymn_of_the_hive', cardType:'mugic', name:'Hymn of the Hive', tribe:'danian',
    cost:1, rarity:'uncommon', set:'zenith_of_hive',
    effect:'heal_30_all', effectLabel:'Heal all allied creatures 30 Energy.',
    description:'The communal song of the Danian hive mind.',
    restriction:'danian',
  },

  song_of_recklessness: {
    id:'song_of_recklessness', cardType:'mugic', name:'Song of Recklessness', tribe:'underworld',
    cost:1, rarity:'uncommon', set:'dawn_of_perim',
    effect:'boost_power_25', effectLabel:'+25 Power this turn.',
    description:'A savage battle cry that unlocks raw Underworld fury.',
    restriction:'underworld',
  },

  aria_of_ascendancy: {
    id:'aria_of_ascendancy', cardType:'mugic', name:'Aria of Ascendancy', tribe:null,
    cost:2, rarity:'super_rare', set:'forged_unity',
    effect:'heal_40', effectLabel:'Heal active creature 40 Energy.',
    description:'Transcends tribal boundaries to restore the spirit.',
    restriction:null,
  },

  battle_hymn: {
    id:'battle_hymn', cardType:'mugic', name:'Battle Hymn', tribe:'danian',
    cost:1, rarity:'rare', set:'zenith_of_hive',
    effect:'boost_courage_25', effectLabel:'+25 Courage this turn.',
    description:'The rallying cry that summons Danian courage.',
    restriction:'danian',
  },

  tide_caller: {
    id:'tide_caller', cardType:'mugic', name:"Tide Caller's Song", tribe:'marrillian',
    cost:1, rarity:'uncommon', set:'marrillian_invasion',
    effect:'heal_30', effectLabel:'Heal active creature 30 Energy.',
    description:"The M'arrillian hymn of restoration from the deep.",
    restriction:'marrillian',
  },

  ancestral_chant: {
    id:'ancestral_chant', cardType:'mugic', name:'Ancestral Chant', tribe:null,
    cost:1, rarity:'rare', set:'secrets_lost_city',
    effect:'negate_attack', effectLabel:"Negate opponent's next attack.",
    description:'A chant passed down from Perim\'s ancient ancestors.',
    restriction:null,
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  LOCATION CARDS
  // ═══════════════════════════════════════════════════════════════════════

  plen_o_chao: {
    id:'plen_o_chao', cardType:'location', name:'Plen-O-Chao', set:'dawn_of_perim',
    rarity:'common',
    initiative:'courage',
    description:'The center of Chaotic — a balanced battleground.',
    allBonuses:{}, tribeBonuses:{},
    artPattern: 'location_neutral',
  },

  bodals_arsenal: {
    id:'bodals_arsenal', cardType:'location', name:"Bodal's Arsenal", set:'dawn_of_perim',
    rarity:'uncommon',
    initiative:'wisdom',
    description:'Overworld knowledge grants +20 Wisdom to all.',
    allBonuses:{ wisdom:20 }, tribeBonuses:{},
    artPattern: 'location_blue',
  },

  castle_bodhran: {
    id:'castle_bodhran', cardType:'location', name:'Castle Bodhran', set:'dawn_of_perim',
    rarity:'uncommon',
    initiative:'courage',
    description:'The fortress of the Overworld. Overworld creatures gain +15 Courage, +15 Energy.',
    allBonuses:{}, tribeBonuses:{ overworld:{ courage:15, energy:15 } },
    artPattern: 'location_blue',
  },

  mipedian_oasis: {
    id:'mipedian_oasis', cardType:'location', name:'Mipedian Oasis', set:'silent_sands',
    rarity:'uncommon',
    initiative:'speed',
    description:'Hidden in the sands. All creatures gain +20 Speed.',
    allBonuses:{ speed:20 }, tribeBonuses:{},
    artPattern: 'location_gold',
  },

  lake_morn: {
    id:'lake_morn', cardType:'location', name:'Lake Morn', set:'marrillian_invasion',
    rarity:'uncommon',
    initiative:'wisdom',
    description:"M'arrillian home waters. M'arrillians gain +20 Power and +20 Wisdom.",
    allBonuses:{}, tribeBonuses:{ marrillian:{ power:20, wisdom:20 } },
    artPattern: 'location_teal',
  },

  danian_hive: {
    id:'danian_hive', cardType:'location', name:'Danian Hive', set:'zenith_of_hive',
    rarity:'uncommon',
    initiative:'courage',
    description:'The sacred home of the Danians. Danians gain +25 Energy.',
    allBonuses:{}, tribeBonuses:{ danian:{ energy:25 } },
    artPattern: 'location_brown',
  },

  underworld_ruins: {
    id:'underworld_ruins', cardType:'location', name:'Underworld Ruins', set:'dawn_of_perim',
    rarity:'uncommon',
    initiative:'power',
    description:'Molten ruins where fire blazes. Underworld gains +20 Courage, +15 Power.',
    allBonuses:{}, tribeBonuses:{ underworld:{ courage:20, power:15 } },
    artPattern: 'location_red',
  },

  kiru_city: {
    id:'kiru_city', cardType:'location', name:'Kiru City', set:'zenith_of_hive',
    rarity:'rare',
    initiative:'speed',
    description:'A city of ruins. All creatures gain +15 Courage.',
    allBonuses:{ courage:15 }, tribeBonuses:{},
    artPattern: 'location_neutral',
  },

  the_deep: {
    id:'the_deep', cardType:'location', name:'The Deep', set:'marrillian_invasion',
    rarity:'rare',
    initiative:'speed',
    description:'The abyssal depths of Perim\'s ocean. Water attacks deal +15 damage.',
    allBonuses:{}, tribeBonuses:{ marrillian:{ wisdom:25, speed:10 } },
    artPattern: 'location_teal',
  },

  desert_dunes: {
    id:'desert_dunes', cardType:'location', name:'Desert Dunes', set:'silent_sands',
    rarity:'common',
    initiative:'speed',
    description:'A sea of sand. Mipedians gain +15 Speed and +10 Courage.',
    allBonuses:{}, tribeBonuses:{ mipedian:{ speed:15, courage:10 } },
    artPattern: 'location_gold',
  },

  mt_pillar: {
    id:'mt_pillar', cardType:'location', name:'Mt. Pillar Stronghold', set:'zenith_of_hive',
    rarity:'rare',
    initiative:'power',
    description:'A Danian stronghold atop a mountain. All gains +10 Power.',
    allBonuses:{ power:10 }, tribeBonuses:{ danian:{ energy:10, courage:10 } },
    artPattern: 'location_brown',
  },

  peritheon: {
    id:'peritheon', cardType:'location', name:'The Peritheon', set:'forged_unity',
    rarity:'super_rare',
    initiative:'wisdom',
    description:'The great meeting hall of Perim. Muges gain +30 Wisdom.',
    allBonuses:{ mugicCounters:1 }, tribeBonuses:{},
    artPattern: 'location_neutral',
  },

};

// ═══════════════════════════════════════════════════════════════════════════
//  PACK DEFINITIONS — Tribal packs with 3 rarity tiers each
// ═══════════════════════════════════════════════════════════════════════════
export const PACKS = [
  // ── Overworld ──────────────────────────────────────────────────────────
  {
    id:'overworld_common', name:'Overworld Scout Pack', tribe:'overworld',
    emoji:'⚔️', color:'#1a6ab8', tier:'common', cost:50,
    description:'Basic Overworld cards. Mostly Common and Uncommon warriors.',
    rarityWeights:{ common:60, uncommon:30, rare:9, super_rare:1, ultra_rare:0 },
    tribeFilter:'overworld',
  },
  {
    id:'overworld_rare', name:'Overworld Champion Pack', tribe:'overworld',
    emoji:'🛡️', color:'#3A80C9', tier:'rare', cost:150,
    description:'Champion-tier Overworld cards with Rare and Super Rare warriors.',
    rarityWeights:{ common:20, uncommon:30, rare:35, super_rare:12, ultra_rare:3 },
    tribeFilter:'overworld',
  },
  {
    id:'overworld_legendary', name:'Overworld Legend Pack', tribe:'overworld',
    emoji:'👑', color:'#60a5fa', tier:'legendary', cost:400,
    description:'The most powerful Overworld cards. High chance of Maxxor and Najarin.',
    rarityWeights:{ common:5, uncommon:15, rare:30, super_rare:35, ultra_rare:15 },
    tribeFilter:'overworld',
  },

  // ── Underworld ─────────────────────────────────────────────────────────
  {
    id:'underworld_common', name:'Underworld Grunt Pack', tribe:'underworld',
    emoji:'🔥', color:'#CC2200', tier:'common', cost:50,
    description:'Basic Underworld cards. Common and Uncommon fire warriors.',
    rarityWeights:{ common:60, uncommon:30, rare:9, super_rare:1, ultra_rare:0 },
    tribeFilter:'underworld',
  },
  {
    id:'underworld_rare', name:'Underworld Warlord Pack', tribe:'underworld',
    emoji:'💀', color:'#dd3311', tier:'rare', cost:150,
    description:'Fierce Underworld warriors. Rare and Super Rare infernal creatures.',
    rarityWeights:{ common:20, uncommon:30, rare:35, super_rare:12, ultra_rare:3 },
    tribeFilter:'underworld',
  },
  {
    id:'underworld_legendary', name:"Chaor's Fire Pack", tribe:'underworld',
    emoji:'🌋', color:'#ff4400', tier:'legendary', cost:400,
    description:"The hottest fire in Perim. High chance of Chaor himself.",
    rarityWeights:{ common:5, uncommon:15, rare:30, super_rare:35, ultra_rare:15 },
    tribeFilter:'underworld',
  },

  // ── Mipedian ───────────────────────────────────────────────────────────
  {
    id:'mipedian_common', name:'Mipedian Dune Pack', tribe:'mipedian',
    emoji:'🌪️', color:'#C8960C', tier:'common', cost:50,
    description:'Desert scouts and warriors. Common and Uncommon sand creatures.',
    rarityWeights:{ common:60, uncommon:30, rare:9, super_rare:1, ultra_rare:0 },
    tribeFilter:'mipedian',
  },
  {
    id:'mipedian_rare', name:'Mipedian Storm Pack', tribe:'mipedian',
    emoji:'⚡', color:'#d9a71d', tier:'rare', cost:150,
    description:'Desert storm warriors. Rare and Super Rare wind and sand creatures.',
    rarityWeights:{ common:20, uncommon:30, rare:35, super_rare:12, ultra_rare:3 },
    tribeFilter:'mipedian',
  },
  {
    id:'mipedian_legendary', name:"Frafdo's Mirage Pack", tribe:'mipedian',
    emoji:'🌅', color:'#f59e0b', tier:'legendary', cost:400,
    description:'The fastest tribe in Perim. High chance of Frafdo and Wagram.',
    rarityWeights:{ common:5, uncommon:15, rare:30, super_rare:35, ultra_rare:15 },
    tribeFilter:'mipedian',
  },

  // ── M'arrillian ────────────────────────────────────────────────────────
  {
    id:'marrillian_common', name:"M'arrillian Tide Pack", tribe:'marrillian',
    emoji:'🌊', color:'#009999', tier:'common', cost:50,
    description:"The rising tide of M'arrillian soldiers. Common and Uncommon sea creatures.",
    rarityWeights:{ common:60, uncommon:30, rare:9, super_rare:1, ultra_rare:0 },
    tribeFilter:'marrillian',
  },
  {
    id:'marrillian_rare', name:"M'arrillian Deep Pack", tribe:'marrillian',
    emoji:'🦑', color:'#00aaaa', tier:'rare', cost:150,
    description:"The depths hold powerful warriors. Rare and Super Rare aquatic creatures.",
    rarityWeights:{ common:20, uncommon:30, rare:35, super_rare:12, ultra_rare:3 },
    tribeFilter:'marrillian',
  },
  {
    id:'marrillian_legendary', name:"Phelphor's Mind Pack", tribe:'marrillian',
    emoji:'🧠', color:'#00cccc', tier:'legendary', cost:400,
    description:"The most powerful minds in Perim. High chance of Phelphor and Aa'une.",
    rarityWeights:{ common:5, uncommon:15, rare:30, super_rare:35, ultra_rare:15 },
    tribeFilter:'marrillian',
  },

  // ── Danian ────────────────────────────────────────────────────────────
  {
    id:'danian_common', name:'Danian Colony Pack', tribe:'danian',
    emoji:'🐜', color:'#8B5A2B', tier:'common', cost:50,
    description:'Workers and scouts from the Danian colony. Common and Uncommon.',
    rarityWeights:{ common:60, uncommon:30, rare:9, super_rare:1, ultra_rare:0 },
    tribeFilter:'danian',
  },
  {
    id:'danian_rare', name:'Danian Warrior Pack', tribe:'danian',
    emoji:'🗡️', color:'#9c6b3c', tier:'rare', cost:150,
    description:'Elite Danian fighters. Rare and Super Rare earth warriors.',
    rarityWeights:{ common:20, uncommon:30, rare:35, super_rare:12, ultra_rare:3 },
    tribeFilter:'danian',
  },
  {
    id:'danian_legendary', name:"Illexia's Hive Pack", tribe:'danian',
    emoji:'🏛️', color:'#b07a4a', tier:'legendary', cost:400,
    description:'The most powerful Danians. High chance of Illexia and Niadar.',
    rarityWeights:{ common:5, uncommon:15, rare:30, super_rare:35, ultra_rare:15 },
    tribeFilter:'danian',
  },

  // ── Mixed / Special ────────────────────────────────────────────────────
  {
    id:'perim_starter', name:'Perim Starter Pack', tribe:null,
    emoji:'🌍', color:'#F26522', tier:'common', cost:30,
    description:'Begin your journey! Cards from all 5 tribes including battlegear and mugic.',
    rarityWeights:{ common:55, uncommon:35, rare:8, super_rare:2, ultra_rare:0 },
    tribeFilter:null,
  },
  {
    id:'all_tribes', name:'All Tribes Booster', tribe:null,
    emoji:'⚡', color:'#a855f7', tier:'rare', cost:200,
    description:'A balanced mix from all 5 tribes. Excellent for variety.',
    rarityWeights:{ common:30, uncommon:35, rare:25, super_rare:9, ultra_rare:1 },
    tribeFilter:null,
  },
  {
    id:'ultra_rare_pack', name:'Legendary Scanner Pack', tribe:null,
    emoji:'💎', color:'#f59e0b', tier:'legendary', cost:600,
    description:'The ultimate Chaotic pack. Guaranteed Ultra Rare in every pack!',
    rarityWeights:{ common:10, uncommon:20, rare:30, super_rare:25, ultra_rare:15 },
    tribeFilter:null,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  STORY BATTLE OPPONENTS
// ═══════════════════════════════════════════════════════════════════════════
export const FIXED_OPPONENTS = [
  {
    id:'trainer_ignis', name:'Trainer Ignis', subtitle:'Underworld Apprentice',
    tribe:'underworld', color:'#CC2200', reward:60,
    team:['agitos','kopond','dractyl'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['cadence_of_malevolence'],
    location:'underworld_ruins',
  },
  {
    id:'trainer_nyxara', name:'Trainer Nyxara', subtitle:'Underworld Champion',
    tribe:'underworld', color:'#CC2200', reward:100,
    team:['rothar','ulmar','tektalion','brathe'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['cadence_of_malevolence','song_of_recklessness'],
    location:'underworld_ruins',
  },
  {
    id:'trainer_sandrik', name:'Trainer Sandrik', subtitle:'Mipedian Scout',
    tribe:'mipedian', color:'#C8960C', reward:120,
    team:['ario','maliph','saand','vinta'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['mantra_of_speed','ode_to_obscurity'],
    location:'desert_dunes',
  },
  {
    id:'trainer_hydras', name:'Trainer Hydras', subtitle:"M'arrillian Raider",
    tribe:'marrillian', color:'#009999', reward:150,
    team:['ixxik','scrup','kharit','unda_dex'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['tide_caller','deep_hum'],
    location:'lake_morn',
  },
  {
    id:'trainer_anthrix', name:'Trainer Anthrix', subtitle:'Danian Soldier',
    tribe:'danian', color:'#8B5A2B', reward:180,
    team:['eegatat','raznus','tassanil','odu_bathax','wamma'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['hymn_of_the_hive','battle_hymn'],
    location:'danian_hive',
  },
  {
    id:'kaz_overworld', name:'Kaz', subtitle:'Overworld Expert',
    tribe:'overworld', color:'#1a6ab8', reward:220,
    team:['attacat','zhade','bodal','iparu','lomma'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['melody_of_miracles','cadence_of_courage'],
    location:'castle_bodhran',
  },
  {
    id:'chaor_boss', name:"Chaor's Champion", subtitle:'Underworld Warlord',
    tribe:'underworld', color:'#ff2200', reward:350,
    team:['skartalas','takinom','borth_majar','kiru','skeletal_lord','chaor'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['cadence_of_malevolence','storm_song','song_of_recklessness'],
    location:'underworld_ruins',
  },
  {
    id:'final_boss', name:'Perim Grandmaster', subtitle:'Supreme Battler',
    tribe:'overworld', color:'#f59e0b', reward:500,
    team:['maxxor','najarin','targubaj','illexia','phelphor','wagram'].map(id=>({cardId:id,battlegearId:null,currentEnergy:CARDS[id].energy,maxEnergy:CARDS[id].energy,mugicCounters:CARDS[id].mugicCounters,maxMugicCounters:CARDS[id].mugicCounters,courage:CARDS[id].courage,power:CARDS[id].power,wisdom:CARDS[id].wisdom,speed:CARDS[id].speed,statusEffects:{burned:0,confused:false,reduceDmg:0}})),
    mugic:['refrain_of_denial','aria_of_ascendancy','ancestral_chant'],
    location:'peritheon',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  STARTING DATA
// ═══════════════════════════════════════════════════════════════════════════
export const STARTING_COINS = 150;

export const STARTING_COLLECTION = {
  // Creatures
  attacat:1, owis:1, zhade:1, hoton:1,     // Overworld commons
  h_earring:1, agitos:1, kopond:1,          // Underworld commons
  ario:1, onyx_mip:1,                        // Mipedian commons
  unda_dex:1, ixxik:1,                       // M'arrillian commons
  eegatat:1, raznus:1,                       // Danian commons
  // Battlegear
  whepcrack:1, blanks:1, minion_scanner:1,
  // Mugic
  refrain_of_denial:1,
  // Location
  plen_o_chao:1,
};

export const STARTING_CODEX = {
  team: { attacat:1, owis:1, h_earring:1 },
  battlegear: {},
  mugic: { refrain_of_denial:1 },
  location: 'plen_o_chao',
};

// ═══════════════════════════════════════════════════════════════════════════
//  NPC TRADERS
// ═══════════════════════════════════════════════════════════════════════════
export const NPC_TRADERS = [
  {
    id:'kaz', name:'Kaz Kalinkas', avatar:'⚔️', tribe:'overworld',
    description:"Tom's friend and Overworld specialist. Will trade for Mipedian cards.",
    offers:[
      { give:{ attacat:1 }, want:{ ario:1 }, coinAdjust:0 },
      { give:{ bodal:1 }, want:{ xelfe:1 }, coinAdjust:20 },
      { give:{ vidav:1 }, want:{ illax:1 }, coinAdjust:30 },
    ],
  },
  {
    id:'tom', name:'Tom Majors', avatar:'🌍', tribe:'overworld',
    description:"The main Chaotic player. Always looking for balanced trades.",
    offers:[
      { give:{ lomma:1 }, want:{ kolmo:1 }, coinAdjust:0 },
      { give:{ velreth:1 }, want:{ wamma:1 }, coinAdjust:10 },
      { give:{ targubaj:1 }, want:{ hifdan:1 }, coinAdjust:0 },
    ],
  },
  {
    id:'sarah', name:'Sarah Lee', avatar:'🌿', tribe:'overworld',
    description:"Intress fan who collects all Overworld Muges. Will trade Underworld for Overworld.",
    offers:[
      { give:{ enre_hep:1 }, want:{ elna:1 }, coinAdjust:0 },
      { give:{ skeletal_lord:1 }, want:{ lore:1 }, coinAdjust:50 },
      { give:{ skartalas:1 }, want:{ illexia:1 }, coinAdjust:0 },
    ],
  },
  {
    id:'peyton', name:'Peyton Doyle', avatar:'💨', tribe:'mipedian',
    description:"The fastest Mipedian player in Chaotic. Great stock of desert cards.",
    offers:[
      { give:{ saand:1 }, want:{ dractyl:1 }, coinAdjust:0 },
      { give:{ maliph:1 }, want:{ siril_ean:1 }, coinAdjust:20 },
      { give:{ mazerot:1 }, want:{ borth_majar:1 }, coinAdjust:0 },
    ],
  },
  {
    id:'van_bloot', name:'Lord Van Bloot', avatar:'🌊', tribe:'underworld',
    description:"A treacherous Underworld commander who plays both sides.",
    offers:[
      { give:{ gothos:1 }, want:{ brebe:1 }, coinAdjust:0 },
      { give:{ ulmar:1 }, want:{ mudeenu:1 }, coinAdjust:30 },
      { give:{ chaor:1 }, want:{ aa_une:1 }, coinAdjust:0 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  GUILD PRESETS (for recruitment)
// ═══════════════════════════════════════════════════════════════════════════
export const NPC_GUILD_MEMBERS = [
  { id:'kaz_g', name:'Kaz Kalinkas', rank:'Elite', tribe:'overworld', avatar:'⚔️', wins:142, losses:38, motto:'Overworld forever!' },
  { id:'sarah_g', name:'Sarah Lee', rank:'Veteran', tribe:'overworld', avatar:'🌿', wins:98, losses:52, motto:'Nature always wins.' },
  { id:'peyton_g', name:'Peyton Doyle', rank:'Elite', tribe:'mipedian', avatar:'💨', wins:127, losses:44, motto:'Too fast to catch!' },
  { id:'van_bloot_g', name:'Lord Van Bloot', rank:'Legend', tribe:'underworld', avatar:'💀', wins:203, losses:67, motto:'Power is everything.' },
  { id:'chaor_ally', name:'Chaor Jr.', rank:'Veteran', tribe:'underworld', avatar:'🔥', wins:89, losses:61, motto:'Burn it all down.' },
  { id:'hive_mind', name:'Hive Mind', rank:'Rookie', tribe:'danian', avatar:'🐜', wins:31, losses:29, motto:'The colony grows.' },
  { id:'deep_tide', name:'Deep Tide', rank:'Veteran', tribe:'marrillian', avatar:'🌊', wins:112, losses:73, motto:'The tide brings all.' },
  { id:'wanderer', name:'Desert Wanderer', rank:'Rookie', tribe:'mipedian', avatar:'🌪️', wins:22, losses:18, motto:'The sands reveal all.' },
];
