// ══════════════════════════════════════════════════════
//  CHAOTIC TCG — Complete Card Database
//  Tribes: Overworld · Underworld · Mipedian · M'arrillian · Danian
// ══════════════════════════════════════════════════════

export const TRIBE_DATA = {
  overworld:  { name: 'Overworld',   color: '#1a6ab8', dark: '#061228', glow: 'rgba(26,106,184,0.3)',  icon: '⚔️',  border: '#3A80C9', badge: '#4a90d9' },
  underworld: { name: 'Underworld',  color: '#CC2200', dark: '#12010a', glow: 'rgba(204,34,0,0.3)',    icon: '🔥',  border: '#CC2200', badge: '#dd3311' },
  mipedian:   { name: 'Mipedian',    color: '#C8960C', dark: '#130d00', glow: 'rgba(200,150,12,0.3)',  icon: '🌪️',  border: '#C8960C', badge: '#d9a71d' },
  marrillian: { name: "M'arrillian", color: '#009999', dark: '#001414', glow: 'rgba(0,153,153,0.3)',   icon: '🌊',  border: '#009999', badge: '#00aaaa' },
  danian:     { name: 'Danian',      color: '#8B5A2B', dark: '#0d0800', glow: 'rgba(139,90,43,0.3)',   icon: '🐜',  border: '#8B5A2B', badge: '#9c6b3c' },
};

export const RARITY_DATA = {
  common:    { color: '#8a9ab0', stars: '◆',      label: 'Common' },
  uncommon:  { color: '#4ade80', stars: '◆◆',    label: 'Uncommon' },
  rare:      { color: '#3b82f6', stars: '◆◆◆',   label: 'Rare' },
  epic:      { color: '#a855f7', stars: '◆◆◆◆',  label: 'Epic' },
  legendary: { color: '#f59e0b', stars: '◆◆◆◆◆', label: 'Legendary' },
};

export const RARITY_STARS = Object.fromEntries(Object.entries(RARITY_DATA).map(([k,v]) => [k, v.stars]));

export const DISCIPLINE_ICON = { courage: '⚔', power: '💪', wisdom: '✨', speed: '⚡' };
export const DISCIPLINE_COLOR = { courage: '#ef4444', power: '#f97316', wisdom: '#8b5cf6', speed: '#22d3ee' };

export const CARDS = {
  // ═══════════════════════════════════════════════════
  // OVERWORLD CREATURES
  // ═══════════════════════════════════════════════════
  maxxor: {
    id:'maxxor', cardType:'creature', name:'Maxxor', tribe:'overworld', subtype:'Warrior',
    courage:95, power:65, wisdom:50, speed:60, energy:80, mugicCounters:0,
    rarity:'legendary', tier:3, set:'perim',
    attacks:[
      { name:'Reckless Charge', disc:'courage', build:35, damage:20, effect:null, desc:'' },
      { name:'Overworld Order', disc:'power',   build:40, damage:30, effect:'heal_15', desc:'Heal 15 Energy.' },
      { name:'Primal Smash',    disc:'power',   build:55, damage:45, effect:null, desc:'' },
    ],
    flavorText:"Maxxor's courage is the shield of the Overworld.",
  },
  intress: {
    id:'intress', cardType:'creature', name:'Intress Natureforce', tribe:'overworld', subtype:'Muge',
    courage:50, power:45, wisdom:70, speed:55, energy:70, mugicCounters:3,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Vine Whip',   disc:'courage', build:30, damage:15, effect:null, desc:'' },
      { name:'Nature Surge',disc:'wisdom',  build:45, damage:30, effect:'heal_20', desc:'Heal 20 Energy.' },
      { name:'Forest Wrath',disc:'wisdom',  build:60, damage:40, effect:null, desc:'' },
    ],
    flavorText:'Nature itself bends to Intress\'s will.',
  },
  najarin: {
    id:'najarin', cardType:'creature', name:'Najarin', tribe:'overworld', subtype:'Muge',
    courage:30, power:30, wisdom:100, speed:85, energy:55, mugicCounters:4,
    rarity:'legendary', tier:3, set:'perim',
    attacks:[
      { name:'Wisdom Scepter',  disc:'wisdom', build:40, damage:20, effect:null, desc:'' },
      { name:'Arcane Torrent',  disc:'wisdom', build:60, damage:40, effect:'confuse', desc:'Confuse opponent.' },
      { name:'Elemental Quotient', disc:'wisdom', build:75, damage:55, effect:null, desc:'' },
    ],
    flavorText:"Najarin's wisdom spans millennia of Perim's history.",
  },
  lomma: {
    id:'lomma', cardType:'creature', name:'Lomma', tribe:'overworld', subtype:'Warrior',
    courage:65, power:60, wisdom:55, speed:60, energy:75, mugicCounters:1,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Fearless Strike', disc:'courage', build:30, damage:20, effect:null, desc:'' },
      { name:'Rally Cry',       disc:'courage', build:45, damage:25, effect:'heal_10', desc:'Heal 10 Energy.' },
    ],
    flavorText:'Lomma never retreats from battle.',
  },
  tartarek: {
    id:'tartarek', cardType:'creature', name:'Tartarek', tribe:'overworld', subtype:'Warrior',
    courage:75, power:80, wisdom:35, speed:50, energy:75, mugicCounters:0,
    rarity:'rare', tier:2, set:'zenith',
    attacks:[
      { name:'Ground Pound',   disc:'power',   build:35, damage:25, effect:null, desc:'' },
      { name:'Battle Howl',    disc:'courage', build:40, damage:30, effect:null, desc:'' },
      { name:'Stone Rampage',  disc:'power',   build:55, damage:40, effect:'bench_10', desc:'10 damage to all opponents.' },
    ],
    flavorText:'Nothing stands in Tartarek\'s path for long.',
  },
  bodal: {
    id:'bodal', cardType:'creature', name:'Bodal', tribe:'overworld', subtype:'Archivist',
    courage:35, power:25, wisdom:75, speed:50, energy:50, mugicCounters:2,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Research Blast', disc:'wisdom', build:30, damage:15, effect:null, desc:'' },
      { name:'Archive Storm',  disc:'wisdom', build:45, damage:25, effect:null, desc:'' },
    ],
    flavorText:"Bodal has catalogued every creature in Perim's history.",
  },
  iparu: {
    id:'iparu', cardType:'creature', name:'Iparu', tribe:'overworld', subtype:'Flyer',
    courage:45, power:40, wisdom:60, speed:95, energy:45, mugicCounters:2,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Fleet Foot',    disc:'speed',   build:35, damage:15, effect:null, desc:'' },
      { name:'Aerial Strike', disc:'courage', build:40, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Iparu moves so fast even arrows miss.',
  },
  olkiex: {
    id:'olkiex', cardType:'creature', name:'Olkiex', tribe:'overworld', subtype:'Inventor',
    courage:50, power:65, wisdom:70, speed:45, energy:65, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'zenith',
    attacks:[
      { name:'Gadget Barrage', disc:'power',   build:35, damage:20, effect:null, desc:'' },
      { name:'Inventive Strike',disc:'wisdom', build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Every one of Olkiex\'s inventions is a weapon.',
  },
  attacat: {
    id:'attacat', cardType:'creature', name:'Attacat', tribe:'overworld', subtype:'Scout',
    courage:65, power:60, wisdom:50, speed:85, energy:50, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Cat Swipe',    disc:'speed',   build:25, damage:10, effect:null, desc:'' },
      { name:'Claw Barrage', disc:'courage', build:35, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Fast, fierce, and fearless.',
  },
  hoton: {
    id:'hoton', cardType:'creature', name:'Hoton', tribe:'overworld', subtype:'Warrior',
    courage:80, power:85, wisdom:30, speed:30, energy:90, mugicCounters:0,
    rarity:'rare', tier:2, set:'silent_sands',
    attacks:[
      { name:'Headlong Rush',  disc:'courage', build:40, damage:25, effect:null, desc:'' },
      { name:'Pile Driver',    disc:'power',   build:50, damage:40, effect:null, desc:'' },
      { name:'Unstoppable',    disc:'power',   build:65, damage:55, effect:'self_10', desc:'Lose 10 Energy.' },
    ],
    flavorText:'Hoton charges without hesitation.',
  },
  zhade: {
    id:'zhade', cardType:'creature', name:'Zhade', tribe:'overworld', subtype:'Rogue',
    courage:60, power:50, wisdom:45, speed:80, energy:60, mugicCounters:1,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Sneak Strike', disc:'speed',   build:30, damage:15, effect:null, desc:'' },
      { name:'Backstab',     disc:'courage', build:40, damage:25, effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:'Zhade strikes from the shadows.',
  },
  vidav: {
    id:'vidav', cardType:'creature', name:'Vidav', tribe:'overworld', subtype:'Sage',
    courage:40, power:35, wisdom:90, speed:55, energy:55, mugicCounters:3,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Mind Bolt',   disc:'wisdom', build:35, damage:20, effect:null, desc:'' },
      { name:'Psionic Wave',disc:'wisdom', build:50, damage:30, effect:'confuse', desc:'Confuse the opponent.' },
    ],
    flavorText:'Vidav sees the battle before it begins.',
  },
  milla_iin: {
    id:'milla_iin', cardType:'creature', name:"Milla'iin", tribe:'overworld', subtype:'Guardian',
    courage:70, power:60, wisdom:65, speed:65, energy:75, mugicCounters:1,
    rarity:'rare', tier:2, set:'dawn',
    attacks:[
      { name:'Guardian Slash', disc:'courage', build:35, damage:20, effect:null, desc:'' },
      { name:'Defense Wave',   disc:'power',   build:45, damage:30, effect:'reduce_15', desc:'Reduce next attack by 15.' },
    ],
    flavorText:"Milla'iin guards all who cannot guard themselves.",
  },
  owis: {
    id:'owis', cardType:'creature', name:'Owis', tribe:'overworld', subtype:'Footsoldier',
    courage:55, power:45, wisdom:50, speed:70, energy:55, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Standard Slash', disc:'courage', build:25, damage:15, effect:null, desc:'' },
      { name:'Rally!',         disc:'courage', build:35, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Every army needs soldiers like Owis.',
  },
  velreth: {
    id:'velreth', cardType:'creature', name:'Velreth', tribe:'overworld', subtype:'Champion',
    courage:75, power:70, wisdom:45, speed:55, energy:85, mugicCounters:1,
    rarity:'rare', tier:2, set:'zenith',
    attacks:[
      { name:'Champion Blow',   disc:'power',   build:40, damage:30, effect:null, desc:'' },
      { name:'Overworld Might', disc:'courage', build:50, damage:35, effect:null, desc:'' },
    ],
    flavorText:'Velreth has earned the Overworld\'s highest honor.',
  },

  // ═══════════════════════════════════════════════════
  // UNDERWORLD CREATURES
  // ═══════════════════════════════════════════════════
  chaor: {
    id:'chaor', cardType:'creature', name:'Chaor', tribe:'underworld', subtype:'Warlord',
    courage:80, power:75, wisdom:40, speed:40, energy:65, mugicCounters:2,
    rarity:'legendary', tier:3, set:'perim',
    attacks:[
      { name:'Inferno',       disc:'power',   build:40, damage:30, effect:'burn_10', desc:'Burn 10/turn.' },
      { name:'Firestorm',     disc:'power',   build:55, damage:45, effect:'bench_10', desc:'10 to all opponents.' },
      { name:"Chaor's Wrath", disc:'courage', build:60, damage:50, effect:null, desc:'' },
    ],
    flavorText:"Chaor's wrath has leveled entire Overworld cities.",
  },
  kiru: {
    id:'kiru', cardType:'creature', name:'Kiru', tribe:'underworld', subtype:'Warrior',
    courage:70, power:65, wisdom:45, speed:85, energy:55, mugicCounters:1,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Blazing Strike', disc:'speed',   build:40, damage:25, effect:null, desc:'' },
      { name:'Fire Dash',      disc:'speed',   build:50, damage:30, effect:'burn_10', desc:'Burn 10/turn.' },
      { name:'Searing Blow',   disc:'power',   build:55, damage:40, effect:null, desc:'' },
    ],
    flavorText:'Kiru strikes before his foes can react.',
  },
  skartalas: {
    id:'skartalas', cardType:'creature', name:'Skartalas', tribe:'underworld', subtype:'Giant',
    courage:85, power:90, wisdom:30, speed:35, energy:70, mugicCounters:0,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Lava Smash',    disc:'power',   build:45, damage:35, effect:null, desc:'' },
      { name:'Magma Burst',   disc:'power',   build:60, damage:50, effect:'burn_10', desc:'Burn 10/turn.' },
      { name:'Volcanic Rage', disc:'power',   build:70, damage:60, effect:'self_20', desc:'Lose 20 Energy.' },
    ],
    flavorText:'Skartalas was born from the volcano itself.',
  },
  rothar: {
    id:'rothar', cardType:'creature', name:'Rothar', tribe:'underworld', subtype:'Warrior',
    courage:60, power:80, wisdom:35, speed:55, energy:80, mugicCounters:0,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Earth Pulse',   disc:'power',   build:35, damage:25, effect:null, desc:'' },
      { name:'Tremor Strike', disc:'power',   build:50, damage:35, effect:'bench_10', desc:'10 to all opponents.' },
    ],
    flavorText:'The ground shakes wherever Rothar walks.',
  },
  ulmar: {
    id:'ulmar', cardType:'creature', name:'Ulmar', tribe:'underworld', subtype:'Scientist',
    courage:30, power:40, wisdom:80, speed:55, energy:50, mugicCounters:2,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Ulmar\'s Ray',    disc:'wisdom', build:35, damage:20, effect:null, desc:'' },
      { name:'Disintegration',  disc:'wisdom', build:55, damage:35, effect:'burn_10', desc:'Burn 10/turn.' },
    ],
    flavorText:'Science and cruelty combined into one being.',
  },
  gothos: {
    id:'gothos', cardType:'creature', name:'Gothos', tribe:'underworld', subtype:'Ghost',
    courage:65, power:55, wisdom:50, speed:60, energy:60, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Haunting Strike', disc:'courage', build:30, damage:15, effect:'confuse', desc:'Confuse opponent.' },
      { name:'Terror Wave',     disc:'wisdom',  build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Gothos haunts the ruins of ancient battles.',
  },
  enre_hep: {
    id:'enre_hep', cardType:'creature', name:'Enre-Hep', tribe:'underworld', subtype:'Muge',
    courage:45, power:35, wisdom:70, speed:65, energy:55, mugicCounters:3,
    rarity:'uncommon', tier:1, set:'zenith',
    attacks:[
      { name:'Dark Pulse',    disc:'wisdom', build:30, damage:15, effect:null, desc:'' },
      { name:'Shadow Mend',   disc:'wisdom', build:40, damage:10, effect:'heal_20', desc:'Heal 20 Energy.' },
    ],
    flavorText:'Even in darkness, healing can be found.',
  },
  siril_ean: {
    id:'siril_ean', cardType:'creature', name:"Siril'ean", tribe:'underworld', subtype:'Spy',
    courage:55, power:50, wisdom:45, speed:90, energy:50, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Shadow Dash',   disc:'speed',   build:35, damage:15, effect:null, desc:'' },
      { name:'Stealth Strike',disc:'speed',   build:45, damage:20, effect:null, desc:'' },
    ],
    flavorText:"Siril'ean knows every secret in Perim.",
  },
  brathe: {
    id:'brathe', cardType:'creature', name:'Brathe', tribe:'underworld', subtype:'Warrior',
    courage:90, power:95, wisdom:20, speed:25, energy:85, mugicCounters:0,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Iron Fist',   disc:'power',   build:45, damage:35, effect:null, desc:'' },
      { name:'Brutal Slam', disc:'courage', build:55, damage:45, effect:null, desc:'' },
    ],
    flavorText:"Nothing survives Brathe's full force.",
  },
  h_earring: {
    id:'h_earring', cardType:'creature', name:"H'earring", tribe:'underworld', subtype:'Spy',
    courage:40, power:35, wisdom:55, speed:85, energy:40, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Sneaky Jab',  disc:'speed',   build:25, damage:10, effect:null, desc:'' },
      { name:'Run Away!',   disc:'speed',   build:30, damage:5,  effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:"H'earring survives by being very, very fast.",
  },
  agitos: {
    id:'agitos', cardType:'creature', name:'Agitos', tribe:'underworld', subtype:'Fighter',
    courage:75, power:70, wisdom:40, speed:50, energy:70, mugicCounters:0,
    rarity:'common', tier:1, set:'zenith',
    attacks:[
      { name:'Underworld Smash', disc:'power',   build:35, damage:20, effect:null, desc:'' },
      { name:'Fire Punch',       disc:'courage', build:40, damage:25, effect:'burn_5', desc:'Burn 5/turn.' },
    ],
    flavorText:'Agitos fights for the glory of the Underworld.',
  },
  kopond: {
    id:'kopond', cardType:'creature', name:'Kopond', tribe:'underworld', subtype:'Scout',
    courage:50, power:45, wisdom:60, speed:70, energy:55, mugicCounters:1,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Ember Shot',    disc:'wisdom', build:25, damage:15, effect:null, desc:'' },
      { name:'Scout Report',  disc:'speed',  build:30, damage:10, effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:"Kopond's knowledge of terrain is unmatched.",
  },
  dractyl: {
    id:'dractyl', cardType:'creature', name:'Dractyl', tribe:'underworld', subtype:'Flyer',
    courage:60, power:55, wisdom:35, speed:80, energy:50, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Dive Bomb',   disc:'speed',   build:30, damage:15, effect:null, desc:'' },
      { name:'Fire Breath', disc:'power',   build:40, damage:25, effect:'burn_5', desc:'Burn 5/turn.' },
    ],
    flavorText:'Dractyl rains fire from above.',
  },
  tektalion: {
    id:'tektalion', cardType:'creature', name:'Tektalion', tribe:'underworld', subtype:'Tactician',
    courage:55, power:50, wisdom:65, speed:55, energy:55, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'dawn',
    attacks:[
      { name:'Tactical Strike', disc:'wisdom', build:35, damage:20, effect:null, desc:'' },
      { name:'Flanking Move',   disc:'speed',  build:40, damage:20, effect:'reduce_15', desc:'Reduce next hit by 15.' },
    ],
    flavorText:'Tektalion wins battles before they begin.',
  },
  skeletal_lord: {
    id:'skeletal_lord', cardType:'creature', name:'Skeletal Lord', tribe:'underworld', subtype:'Undead',
    courage:70, power:75, wisdom:45, speed:40, energy:80, mugicCounters:0,
    rarity:'rare', tier:2, set:'secrets',
    attacks:[
      { name:'Bone Crush',    disc:'power',   build:40, damage:30, effect:null, desc:'' },
      { name:'Death Grip',    disc:'courage', build:50, damage:35, effect:'burn_10', desc:'Burn 10/turn.' },
    ],
    flavorText:'The lord of the dead never tires.',
  },

  // ═══════════════════════════════════════════════════
  // MIPEDIAN CREATURES
  // ═══════════════════════════════════════════════════
  frafdo: {
    id:'frafdo', cardType:'creature', name:'Frafdo', tribe:'mipedian', subtype:'Muge',
    courage:40, power:30, wisdom:60, speed:130, energy:35, mugicCounters:2,
    rarity:'legendary', tier:3, set:'perim',
    attacks:[
      { name:'Sands of Silence', disc:'speed',   build:50, damage:20, effect:'confuse', desc:'Confuse opponent.' },
      { name:'Mirage Strike',    disc:'speed',   build:65, damage:30, effect:null, desc:'' },
      { name:'Desert Wind',      disc:'wisdom',  build:50, damage:35, effect:null, desc:'' },
    ],
    flavorText:'No one in Perim is faster than Frafdo.',
  },
  wagram: {
    id:'wagram', cardType:'creature', name:'Wagram', tribe:'mipedian', subtype:'General',
    courage:50, power:45, wisdom:55, speed:95, energy:55, mugicCounters:2,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Typhoon',        disc:'speed',   build:45, damage:25, effect:null, desc:'' },
      { name:'Windstorm',      disc:'wisdom',  build:50, damage:30, effect:'bench_10', desc:'10 to all opponents.' },
      { name:'Desert Cyclone', disc:'speed',   build:60, damage:40, effect:null, desc:'' },
    ],
    flavorText:'Wagram commands the very winds of the desert.',
  },
  kolmo: {
    id:'kolmo', cardType:'creature', name:'Kolmo', tribe:'mipedian', subtype:'Warrior',
    courage:75, power:70, wisdom:40, speed:65, energy:70, mugicCounters:0,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Sand Slash',     disc:'courage', build:35, damage:25, effect:null, desc:'' },
      { name:'Desert Strike',  disc:'power',   build:45, damage:35, effect:null, desc:'' },
    ],
    flavorText:'Kolmo has survived every desert the Mipedians call home.',
  },
  aimren: {
    id:'aimren', cardType:'creature', name:'Aimren', tribe:'mipedian', subtype:'Royalty',
    courage:60, power:55, wisdom:65, speed:75, energy:65, mugicCounters:2,
    rarity:'rare', tier:2, set:'zenith',
    attacks:[
      { name:'Royal Command', disc:'wisdom',  build:40, damage:25, effect:'heal_10', desc:'Heal 10 Energy.' },
      { name:'Swift Justice', disc:'speed',   build:45, damage:30, effect:null, desc:'' },
    ],
    flavorText:'Aimren rules the Mipedians with wisdom and speed.',
  },
  ursis: {
    id:'ursis', cardType:'creature', name:'Ursis', tribe:'mipedian', subtype:'Beast',
    courage:85, power:90, wisdom:25, speed:40, energy:80, mugicCounters:0,
    rarity:'rare', tier:2, set:'silent_sands',
    attacks:[
      { name:'Sand Crush',   disc:'power',   build:45, damage:35, effect:null, desc:'' },
      { name:'Beast Rampage',disc:'courage', build:55, damage:45, effect:'self_10', desc:'Lose 10 Energy.' },
    ],
    flavorText:'Ursis is the largest creature in the Mipedian desert.',
  },
  maliph: {
    id:'maliph', cardType:'creature', name:'Maliph', tribe:'mipedian', subtype:'Scout',
    courage:45, power:40, wisdom:55, speed:100, energy:45, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Blurring Gust', disc:'speed',  build:40, damage:15, effect:null, desc:'' },
      { name:'Sand Dart',     disc:'speed',  build:50, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Maliph has never been caught in over 500 missions.',
  },
  vinta: {
    id:'vinta', cardType:'creature', name:'Vinta', tribe:'mipedian', subtype:'Dancer',
    courage:35, power:30, wisdom:80, speed:110, energy:40, mugicCounters:3,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Dance Strike',  disc:'speed',   build:40, damage:15, effect:null, desc:'' },
      { name:'Harmony Wave',  disc:'wisdom',  build:45, damage:20, effect:'confuse', desc:'Confuse opponent.' },
    ],
    flavorText:"Vinta's dance is both beautiful and deadly.",
  },
  xelfe: {
    id:'xelfe', cardType:'creature', name:'Xelfe', tribe:'mipedian', subtype:'Muge',
    courage:40, power:35, wisdom:90, speed:70, energy:50, mugicCounters:3,
    rarity:'uncommon', tier:1, set:'zenith',
    attacks:[
      { name:'Mirage Bolt',    disc:'wisdom', build:35, damage:20, effect:null, desc:'' },
      { name:'Illusion Storm', disc:'wisdom', build:55, damage:35, effect:null, desc:'' },
    ],
    flavorText:'Reality bends before Xelfe\'s mastery of illusion.',
  },
  ario: {
    id:'ario', cardType:'creature', name:'Ario', tribe:'mipedian', subtype:'Scout',
    courage:50, power:45, wisdom:40, speed:90, energy:45, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Quick Strike', disc:'speed',   build:25, damage:10, effect:null, desc:'' },
      { name:'Dust Cloud',   disc:'speed',   build:35, damage:15, effect:'confuse', desc:'Confuse opponent.' },
    ],
    flavorText:'Ario scouts ahead so others can fight safely.',
  },
  onyx_mip: {
    id:'onyx_mip', cardType:'creature', name:'Onyx', tribe:'mipedian', subtype:'Warrior',
    courage:70, power:65, wisdom:35, speed:60, energy:65, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Desert Slash', disc:'courage', build:30, damage:15, effect:null, desc:'' },
      { name:'Sand Blow',    disc:'power',   build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Onyx is named for the color of the desert at midnight.',
  },
  saand: {
    id:'saand', cardType:'creature', name:'Saand', tribe:'mipedian', subtype:'Caster',
    courage:35, power:30, wisdom:75, speed:80, energy:45, mugicCounters:2,
    rarity:'common', tier:1, set:'silent_sands',
    attacks:[
      { name:'Sandstorm',   disc:'speed',  build:35, damage:15, effect:'bench_5', desc:'5 to all opponents.' },
      { name:'Sand Veil',   disc:'wisdom', build:40, damage:20, effect:'reduce_10', desc:'Reduce next hit by 10.' },
    ],
    flavorText:'Saand summons sandstorms from thin air.',
  },
  illax: {
    id:'illax', cardType:'creature', name:'Illax', tribe:'mipedian', subtype:'Illusionist',
    courage:30, power:25, wisdom:85, speed:75, energy:40, mugicCounters:3,
    rarity:'uncommon', tier:1, set:'secrets',
    attacks:[
      { name:'Mirror Image',    disc:'wisdom', build:35, damage:15, effect:'confuse', desc:'Confuse opponent.' },
      { name:'Phantom Strike',  disc:'speed',  build:45, damage:20, effect:null, desc:'' },
    ],
    flavorText:"Illax's opponent never knows which strike is real.",
  },

  // ═══════════════════════════════════════════════════
  // M'ARRILLIAN CREATURES
  // ═══════════════════════════════════════════════════
  phelphor: {
    id:'phelphor', cardType:'creature', name:'Phelphor', tribe:'marrillian', subtype:'Chieftain',
    courage:50, power:45, wisdom:80, speed:80, energy:45, mugicCounters:3,
    rarity:'legendary', tier:3, set:'marrillian',
    attacks:[
      { name:'Mind Breach',      disc:'wisdom', build:45, damage:25, effect:'confuse', desc:'Confuse opponent.' },
      { name:'Tidal Wave',       disc:'wisdom', build:60, damage:40, effect:'bench_10', desc:'10 to all opponents.' },
      { name:'Deep Hum Control', disc:'speed',  build:55, damage:35, effect:null, desc:'' },
    ],
    flavorText:"Phelphor's will is stronger than any current.",
  },
  karlen: {
    id:'karlen', cardType:'creature', name:'Karlen', tribe:'marrillian', subtype:'Warrior',
    courage:65, power:60, wisdom:55, speed:55, energy:60, mugicCounters:1,
    rarity:'epic', tier:3, set:'marrillian',
    attacks:[
      { name:'Aqua Slash',   disc:'power',  build:35, damage:25, effect:null, desc:'' },
      { name:'Current Blast',disc:'speed',  build:45, damage:30, effect:null, desc:'' },
      { name:'Deep Strike',  disc:'power',  build:55, damage:40, effect:null, desc:'' },
    ],
    flavorText:'Karlen is the finest warrior the seas have produced.',
  },
  mudeenu: {
    id:'mudeenu', cardType:'creature', name:'Mudeenu', tribe:'marrillian', subtype:'Muge',
    courage:35, power:30, wisdom:95, speed:65, energy:50, mugicCounters:4,
    rarity:'rare', tier:2, set:'marrillian',
    attacks:[
      { name:'Mental Flood',  disc:'wisdom', build:45, damage:25, effect:null, desc:'' },
      { name:'Psionic Crush', disc:'wisdom', build:60, damage:40, effect:'confuse', desc:'Confuse opponent.' },
    ],
    flavorText:"Mudeenu's wisdom flows like the deep ocean currents.",
  },
  nunk_worn: {
    id:'nunk_worn', cardType:'creature', name:"Nunk'worn", tribe:'marrillian', subtype:'Colossus',
    courage:80, power:85, wisdom:35, speed:30, energy:75, mugicCounters:0,
    rarity:'rare', tier:2, set:'marrillian',
    attacks:[
      { name:'Tidal Slam',  disc:'power',   build:45, damage:35, effect:null, desc:'' },
      { name:'Wave Crush',  disc:'courage', build:55, damage:45, effect:null, desc:'' },
    ],
    flavorText:"Nunk'worn can capsize entire fleets.",
  },
  kharit: {
    id:'kharit', cardType:'creature', name:'Kharit', tribe:'marrillian', subtype:'Raider',
    courage:55, power:50, wisdom:60, speed:80, energy:55, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'marrillian',
    attacks:[
      { name:'Sea Dart',      disc:'speed',  build:35, damage:15, effect:null, desc:'' },
      { name:'Current Rush',  disc:'speed',  build:45, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Kharit raids coastal settlements without mercy.',
  },
  fivarth: {
    id:'fivarth', cardType:'creature', name:'Fivarth', tribe:'marrillian', subtype:'Archer',
    courage:70, power:65, wisdom:50, speed:60, energy:65, mugicCounters:0,
    rarity:'uncommon', tier:1, set:'dawn',
    attacks:[
      { name:'Aqua Bolt',    disc:'power',  build:35, damage:20, effect:null, desc:'' },
      { name:'Coral Barrage',disc:'power',  build:45, damage:30, effect:'bench_5', desc:'5 to all opponents.' },
    ],
    flavorText:'Fivarth never misses at range.',
  },
  brebe: {
    id:'brebe', cardType:'creature', name:'Brebe', tribe:'marrillian', subtype:'Shaman',
    courage:45, power:55, wisdom:75, speed:60, energy:55, mugicCounters:2,
    rarity:'uncommon', tier:1, set:'marrillian',
    attacks:[
      { name:'Tide Blessing', disc:'wisdom', build:35, damage:15, effect:'heal_15', desc:'Heal 15 Energy.' },
      { name:'Sea Surge',     disc:'wisdom', build:45, damage:25, effect:null, desc:'' },
    ],
    flavorText:"Brebe's blessings keep M'arrillian warriors alive.",
  },
  unda_dex: {
    id:'unda_dex', cardType:'creature', name:"Unda'dex", tribe:'marrillian', subtype:'Warrior',
    courage:60, power:70, wisdom:65, speed:50, energy:60, mugicCounters:0,
    rarity:'common', tier:1, set:'marrillian',
    attacks:[
      { name:'Current Slash', disc:'power',  build:30, damage:20, effect:null, desc:'' },
      { name:'Deep Thrust',   disc:'power',  build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'A soldier of the deep, loyal to the last.',
  },
  ixxik: {
    id:'ixxik', cardType:'creature', name:'Ixxik', tribe:'marrillian', subtype:'Brawler',
    courage:65, power:70, wisdom:35, speed:55, energy:60, mugicCounters:0,
    rarity:'common', tier:1, set:'marrillian',
    attacks:[
      { name:'Brute Slam',   disc:'power',   build:30, damage:20, effect:null, desc:'' },
      { name:'Sea Crash',    disc:'courage', build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Ixxik relies on overwhelming force.',
  },
  uran: {
    id:'uran', cardType:'creature', name:'Uran', tribe:'marrillian', subtype:'Minion',
    courage:40, power:45, wisdom:50, speed:60, energy:40, mugicCounters:0,
    rarity:'common', tier:1, set:'marrillian',
    attacks:[
      { name:'Mindless Strike', disc:'power', build:25, damage:10, effect:null, desc:'' },
      { name:'Surge',           disc:'speed', build:30, damage:15, effect:null, desc:'' },
    ],
    flavorText:'Uran fights because it is commanded to.',
  },

  // ═══════════════════════════════════════════════════
  // DANIAN CREATURES
  // ═══════════════════════════════════════════════════
  nimmei: {
    id:'nimmei', cardType:'creature', name:'Nimmei', tribe:'danian', subtype:'Queen',
    courage:50, power:45, wisdom:85, speed:55, energy:60, mugicCounters:4,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Colony Call',      disc:'wisdom',  build:45, damage:20, effect:'bench_5', desc:'5 to all opponents.' },
      { name:'Hive Wrath',       disc:'wisdom',  build:60, damage:40, effect:null, desc:'' },
      { name:'Queen\'s Command', disc:'courage', build:50, damage:30, effect:'heal_20', desc:'Heal 20 Energy.' },
    ],
    flavorText:'All Danians answer to Nimmei.',
  },
  tiaane: {
    id:'tiaane', cardType:'creature', name:'Tiaane', tribe:'danian', subtype:'Worker Queen',
    courage:55, power:50, wisdom:65, speed:70, energy:55, mugicCounters:2,
    rarity:'rare', tier:2, set:'perim',
    attacks:[
      { name:'Acid Spray',    disc:'wisdom',  build:40, damage:20, effect:'burn_5', desc:'Burn 5/turn.' },
      { name:'Colony Shield', disc:'courage', build:45, damage:15, effect:'reduce_15', desc:'Reduce next hit by 15.' },
    ],
    flavorText:'Tiaane protects the next generation of Danians.',
  },
  ramarhvir: {
    id:'ramarhvir', cardType:'creature', name:'Ramarhvir', tribe:'danian', subtype:'Soldier',
    courage:75, power:80, wisdom:40, speed:45, energy:80, mugicCounters:0,
    rarity:'rare', tier:2, set:'zenith',
    attacks:[
      { name:'Mandible Crush', disc:'power',   build:40, damage:30, effect:null, desc:'' },
      { name:'Soldier\'s Rush',disc:'courage', build:50, damage:35, effect:null, desc:'' },
    ],
    flavorText:'Ramarhvir has never lost a battle he was ordered to win.',
  },
  odu_bathax: {
    id:'odu_bathax', cardType:'creature', name:'Odu-Bathax', tribe:'danian', subtype:'Champion',
    courage:85, power:90, wisdom:30, speed:25, energy:90, mugicCounters:0,
    rarity:'rare', tier:3, set:'perim',
    attacks:[
      { name:'Hive Slam',    disc:'power',   build:50, damage:40, effect:null, desc:'' },
      { name:'Colony Crash', disc:'courage', build:60, damage:50, effect:'self_10', desc:'Lose 10 Energy.' },
    ],
    flavorText:'Odu-Bathax is the mightiest warrior in the colony.',
  },
  lore: {
    id:'lore', cardType:'creature', name:'Lore', tribe:'danian', subtype:'Muge',
    courage:35, power:30, wisdom:100, speed:50, energy:50, mugicCounters:4,
    rarity:'epic', tier:3, set:'perim',
    attacks:[
      { name:'Ancient Knowledge', disc:'wisdom', build:50, damage:25, effect:null, desc:'' },
      { name:'Hive Mind',         disc:'wisdom', build:65, damage:40, effect:'confuse', desc:'Confuse opponent.' },
    ],
    flavorText:"Lore holds the accumulated knowledge of ten thousand Danian generations.",
  },
  arbeid: {
    id:'arbeid', cardType:'creature', name:'Arbeid', tribe:'danian', subtype:'Worker',
    courage:45, power:55, wisdom:60, speed:75, energy:55, mugicCounters:1,
    rarity:'uncommon', tier:1, set:'perim',
    attacks:[
      { name:'Work Order',    disc:'wisdom',  build:30, damage:15, effect:null, desc:'' },
      { name:'Digging Claw', disc:'power',   build:40, damage:20, effect:null, desc:'' },
    ],
    flavorText:'Arbeid works tirelessly for the good of the colony.',
  },
  skreeth: {
    id:'skreeth', cardType:'creature', name:'Skreeth', tribe:'danian', subtype:'Warrior',
    courage:65, power:60, wisdom:50, speed:80, energy:60, mugicCounters:0,
    rarity:'uncommon', tier:1, set:'zenith',
    attacks:[
      { name:'Acid Slash',    disc:'courage', build:30, damage:15, effect:'burn_5', desc:'Burn 5/turn.' },
      { name:'Swarm Strike',  disc:'speed',   build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Skreeth strikes with acid-coated mandibles.',
  },
  danian_kolmo: {
    id:'danian_kolmo', cardType:'creature', name:'Danian Kolmo', tribe:'danian', subtype:'Soldier',
    courage:70, power:65, wisdom:45, speed:70, energy:65, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Ant Crush',    disc:'power',   build:30, damage:20, effect:null, desc:'' },
      { name:'Hive Charge',  disc:'courage', build:40, damage:25, effect:null, desc:'' },
    ],
    flavorText:'Named after a legendary warrior, Danian Kolmo lives up to the title.',
  },
  hive_sentinel: {
    id:'hive_sentinel', cardType:'creature', name:'Hive Sentinel', tribe:'danian', subtype:'Guard',
    courage:60, power:65, wisdom:40, speed:45, energy:70, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Guard Bash',   disc:'power',   build:30, damage:20, effect:null, desc:'' },
      { name:'Colony Wall',  disc:'courage', build:35, damage:15, effect:'reduce_15', desc:'Reduce next hit by 15.' },
    ],
    flavorText:'The sentinel never sleeps, never tires.',
  },
  ant_drone: {
    id:'ant_drone', cardType:'creature', name:'Ant Drone', tribe:'danian', subtype:'Drone',
    courage:40, power:45, wisdom:35, speed:60, energy:40, mugicCounters:0,
    rarity:'common', tier:1, set:'perim',
    attacks:[
      { name:'Drone Strike', disc:'power',  build:25, damage:10, effect:null, desc:'' },
      { name:'Swarm',        disc:'speed',  build:30, damage:15, effect:'bench_5', desc:'5 to all opponents.' },
    ],
    flavorText:'Strength in numbers.',
  },

  // ═══════════════════════════════════════════════════
  // BATTLEGEAR
  // ═══════════════════════════════════════════════════
  shield_of_kallor: {
    id:'shield_of_kallor', cardType:'battlegear', name:'Shield of Kallor',
    tribe:'overworld', rarity:'rare', tier:2, set:'perim',
    bonuses:{ power:10, energy:10 }, effect:'reduce_dmg_10',
    description:'Gain +10 Power and +10 max Energy. Reduce incoming damage by 10.',
    flavorText:'Forged in the heart of the Overworld.',
  },
  najarin_tablet: {
    id:'najarin_tablet', cardType:'battlegear', name:"Najarin's Tablet",
    tribe:'overworld', rarity:'epic', tier:3, set:'perim',
    bonuses:{ wisdom:20, mugicCounters:2 }, effect:null,
    description:'Gain +20 Wisdom and +2 Mugic Counters.',
    flavorText:'Contains ancient Overworld spells.',
  },
  perithane_shield: {
    id:'perithane_shield', cardType:'battlegear', name:'Perithane Shield',
    tribe:'overworld', rarity:'uncommon', tier:1, set:'zenith',
    bonuses:{ courage:10 }, effect:'reduce_dmg_5',
    description:'Gain +10 Courage. Reduce incoming damage by 5.',
    flavorText:'Standard issue Overworld protection.',
  },
  bodal_satchel: {
    id:'bodal_satchel', cardType:'battlegear', name:"Bodal's Satchel",
    tribe:'overworld', rarity:'uncommon', tier:1, set:'perim',
    bonuses:{ wisdom:10 }, effect:'extra_mugic_counter',
    description:'Gain +10 Wisdom and 1 extra Mugic Counter.',
    flavorText:"Bodal's research tools, repurposed for battle.",
  },
  ulmar_projector: {
    id:'ulmar_projector', cardType:'battlegear', name:"Ulmar's Projector",
    tribe:'underworld', rarity:'epic', tier:3, set:'perim',
    bonuses:{ wisdom:15, power:10 }, effect:'burn_on_hit',
    description:'Gain +15 Wisdom, +10 Power. Your attacks burn the opponent for 5.',
    flavorText:'A weapon of pure science and cruelty.',
  },
  chaor_charger: {
    id:'chaor_charger', cardType:'battlegear', name:"Chaor's Charger",
    tribe:'underworld', rarity:'rare', tier:2, set:'perim',
    bonuses:{ courage:15, power:10 }, effect:null,
    description:'Gain +15 Courage and +10 Power.',
    flavorText:"Chaor's personal battle armor, charged with Underworld fire.",
  },
  kiru_flame_armor: {
    id:'kiru_flame_armor', cardType:'battlegear', name:"Kiru's Flame Armor",
    tribe:'underworld', rarity:'uncommon', tier:1, set:'perim',
    bonuses:{ speed:15 }, effect:'burn_on_hit',
    description:'Gain +15 Speed. Your attacks apply Burn 5.',
    flavorText:'Armor that blazes with inner fire.',
  },
  skartalas_fireshield: {
    id:'skartalas_fireshield', cardType:'battlegear', name:"Skartalas' Fireshield",
    tribe:'underworld', rarity:'uncommon', tier:1, set:'zenith',
    bonuses:{ energy:15 }, effect:'reflect_5',
    description:'Gain +15 max Energy. Reflect 5 damage to attackers.',
    flavorText:'The shield burns those who touch it.',
  },
  balladeer_flute: {
    id:'balladeer_flute', cardType:'battlegear', name:"Mipedian Balladeer's Flute",
    tribe:'mipedian', rarity:'epic', tier:3, set:'perim',
    bonuses:{ speed:20, wisdom:10 }, effect:'confuse_on_hit',
    description:'Gain +20 Speed, +10 Wisdom. Your attacks may Confuse the opponent.',
    flavorText:'The music of the desert can drive enemies to madness.',
  },
  mirage_cloak: {
    id:'mirage_cloak', cardType:'battlegear', name:'Mirage Cloak',
    tribe:'mipedian', rarity:'rare', tier:2, set:'silent_sands',
    bonuses:{ speed:10 }, effect:'reduce_dmg_15',
    description:'Gain +10 Speed. Reduce incoming damage by 15.',
    flavorText:'The wearer appears to be everywhere and nowhere.',
  },
  velocity_boots: {
    id:'velocity_boots', cardType:'battlegear', name:'Velocity Boots',
    tribe:'mipedian', rarity:'uncommon', tier:1, set:'perim',
    bonuses:{ speed:20 }, effect:null,
    description:'Gain +20 Speed.',
    flavorText:'These boots were made for running.',
  },
  sandstorm_belt: {
    id:'sandstorm_belt', cardType:'battlegear', name:'Sandstorm Belt',
    tribe:'mipedian', rarity:'uncommon', tier:1, set:'silent_sands',
    bonuses:{ courage:10, speed:10 }, effect:null,
    description:'Gain +10 Courage and +10 Speed.',
    flavorText:'Channels the power of the desert storm.',
  },
  coral_suit: {
    id:'coral_suit', cardType:'battlegear', name:'Coral Suit',
    tribe:'marrillian', rarity:'rare', tier:2, set:'marrillian',
    bonuses:{ energy:20 }, effect:'reduce_dmg_10',
    description:'Gain +20 max Energy. Reduce incoming damage by 10.',
    flavorText:'Living coral, shaped into armor by M\'arrillian crafters.',
  },
  mindlock_device: {
    id:'mindlock_device', cardType:'battlegear', name:'Mindlock Device',
    tribe:'marrillian', rarity:'epic', tier:3, set:'marrillian',
    bonuses:{ wisdom:20 }, effect:'confuse_on_hit',
    description:'Gain +20 Wisdom. Your attacks may Confuse the opponent.',
    flavorText:'A device that reaches into the opponent\'s mind.',
  },
  aqua_barrier: {
    id:'aqua_barrier', cardType:'battlegear', name:'Aqua Barrier',
    tribe:'marrillian', rarity:'uncommon', tier:1, set:'marrillian',
    bonuses:{ power:10 }, effect:'reduce_dmg_5',
    description:'Gain +10 Power. Reduce incoming damage by 5.',
    flavorText:'A wall of compressed water.',
  },
  current_driver: {
    id:'current_driver', cardType:'battlegear', name:'Current Driver',
    tribe:'marrillian', rarity:'uncommon', tier:1, set:'dawn',
    bonuses:{ speed:10, wisdom:10 }, effect:null,
    description:'Gain +10 Speed and +10 Wisdom.',
    flavorText:'Harnesses ocean currents for speed.',
  },
  hivesword: {
    id:'hivesword', cardType:'battlegear', name:'Danian Hivesword',
    tribe:'danian', rarity:'rare', tier:2, set:'perim',
    bonuses:{ courage:15 }, effect:'burn_on_hit',
    description:'Gain +15 Courage. Your attacks apply Burn 5.',
    flavorText:'A sword carved from the sharpest obsidian in the Danian mound.',
  },
  infect_armor: {
    id:'infect_armor', cardType:'battlegear', name:'Infect Armor',
    tribe:'danian', rarity:'uncommon', tier:1, set:'zenith',
    bonuses:{ energy:15, courage:5 }, effect:'burn_on_hit',
    description:'Gain +15 max Energy, +5 Courage. Your attacks apply Burn 5.',
    flavorText:'Coated in Danian toxins.',
  },
  anthill_pack: {
    id:'anthill_pack', cardType:'battlegear', name:'Anthill Pack',
    tribe:'danian', rarity:'uncommon', tier:1, set:'perim',
    bonuses:{ power:10, wisdom:5 }, effect:null,
    description:'Gain +10 Power and +5 Wisdom.',
    flavorText:'Everything a Danian warrior needs.',
  },
  queen_guard_mail: {
    id:'queen_guard_mail', cardType:'battlegear', name:"Queen's Guard Mail",
    tribe:'danian', rarity:'rare', tier:2, set:'secrets',
    bonuses:{ courage:10, energy:10 }, effect:'reduce_dmg_10',
    description:'Gain +10 Courage, +10 max Energy. Reduce incoming damage by 10.',
    flavorText:'Worn only by those who guard the Queen.',
  },

  // ═══════════════════════════════════════════════════
  // MUGIC CARDS
  // ═══════════════════════════════════════════════════
  refrain_of_denial: {
    id:'refrain_of_denial', cardType:'mugic', name:'Refrain of Denial',
    tribe:'overworld', cost:1, rarity:'rare', tier:2, set:'perim',
    effect:'negate_attack', description:'Negate an attack. Opponent does 0 damage this turn.',
    flavorText:'The melody that silences all aggression.',
  },
  fanfare_of_thoribor: {
    id:'fanfare_of_thoribor', cardType:'mugic', name:'Fanfare of Thoribor',
    tribe:'overworld', cost:2, rarity:'epic', tier:3, set:'perim',
    effect:'boost_all_20', description:'Gain +20 to all disciplines until end of battle.',
    flavorText:"Thoribor's fanfare has turned the tide of many battles.",
  },
  footstep_of_brave: {
    id:'footstep_of_brave', cardType:'mugic', name:'Footstep of the Brave',
    tribe:'overworld', cost:1, rarity:'uncommon', tier:1, set:'perim',
    effect:'boost_courage_30', description:'Active creature gains +30 Courage this turn.',
    flavorText:'Courage is the first step to victory.',
  },
  melody_mirthful: {
    id:'melody_mirthful', cardType:'mugic', name:'Melody of the Mirthful',
    tribe:'overworld', cost:1, rarity:'uncommon', tier:1, set:'zenith',
    effect:'heal_30', description:'Heal 30 Energy from your active creature.',
    flavorText:'A cheerful tune that mends wounds.',
  },
  cadence_of_malvadine: {
    id:'cadence_of_malvadine', cardType:'mugic', name:'Cadence of Malvadine',
    tribe:'underworld', cost:2, rarity:'epic', tier:3, set:'perim',
    effect:'heal_50', description:'Heal 50 Energy from your active creature.',
    flavorText:"Malvadine's cadence draws on the Underworld's darkest energies.",
  },
  dirge_of_deserter: {
    id:'dirge_of_deserter', cardType:'mugic', name:'Dirge of the Deserter',
    tribe:'underworld', cost:1, rarity:'rare', tier:2, set:'perim',
    effect:'burn_opponent_15', description:"Apply Burn 15 to the opponent's active creature.",
    flavorText:'The last song a traitor hears.',
  },
  overture_of_broken: {
    id:'overture_of_broken', cardType:'mugic', name:'Overture of the Brokenhearted',
    tribe:'underworld', cost:1, rarity:'uncommon', tier:1, set:'zenith',
    effect:'confuse_opponent', description:"Confuse the opponent's active creature.",
    flavorText:'Sorrow made into a weapon.',
  },
  hooligan_hymn: {
    id:'hooligan_hymn', cardType:'mugic', name:"Hooligan's Hymn",
    tribe:'underworld', cost:1, rarity:'uncommon', tier:1, set:'perim',
    effect:'boost_power_30', description:'Active creature gains +30 Power this turn.',
    flavorText:'A rough tune that fills the heart with bloodlust.',
  },
  sands_of_silence: {
    id:'sands_of_silence', cardType:'mugic', name:'Sands of Silence',
    tribe:'mipedian', cost:1, rarity:'rare', tier:2, set:'silent_sands',
    effect:'negate_attack', description:'Negate an attack. Opponent does 0 damage this turn.',
    flavorText:'The desert swallows all sound.',
  },
  melody_of_mirage: {
    id:'melody_of_mirage', cardType:'mugic', name:'Melody of Mirage',
    tribe:'mipedian', cost:1, rarity:'uncommon', tier:1, set:'perim',
    effect:'boost_speed_30', description:'Active creature gains +30 Speed this turn.',
    flavorText:'The mirage shifts, and so does the battle.',
  },
  invisibility_song: {
    id:'invisibility_song', cardType:'mugic', name:'Song of Invisibility',
    tribe:'mipedian', cost:2, rarity:'epic', tier:3, set:'silent_sands',
    effect:'reduce_dmg_next_30', description:'Reduce next attack against your creature by 30.',
    flavorText:'What cannot be seen cannot be hit.',
  },
  desert_hymn: {
    id:'desert_hymn', cardType:'mugic', name:'Desert Hymn',
    tribe:'mipedian', cost:1, rarity:'uncommon', tier:1, set:'perim',
    effect:'heal_20', description:'Heal 20 Energy from your active creature.',
    flavorText:'The desert provides for those who know its secrets.',
  },
  deep_hum: {
    id:'deep_hum', cardType:'mugic', name:'Deep Hum',
    tribe:'marrillian', cost:1, rarity:'uncommon', tier:1, set:'marrillian',
    effect:'boost_wisdom_30', description:'Active creature gains +30 Wisdom this turn.',
    flavorText:'The hum that rises from the ocean depths.',
  },
  tide_melody: {
    id:'tide_melody', cardType:'mugic', name:'Tide Melody',
    tribe:'marrillian', cost:2, rarity:'epic', tier:3, set:'marrillian',
    effect:'heal_40', description:'Heal 40 Energy from your active creature.',
    flavorText:'The tide heals all wounds.',
  },
  marrilian_chant: {
    id:'marrilian_chant', cardType:'mugic', name:"M'arrillian Chant",
    tribe:'marrillian', cost:1, rarity:'rare', tier:2, set:'marrillian',
    effect:'confuse_opponent', description:"Confuse the opponent's active creature.",
    flavorText:'The chant reaches deep into the mind.',
  },
  void_chorus: {
    id:'void_chorus', cardType:'mugic', name:'Void Chorus',
    tribe:'marrillian', cost:1, rarity:'uncommon', tier:1, set:'dawn',
    effect:'boost_speed_20', description:'Active creature gains +20 Speed this turn.',
    flavorText:'The void sings, and the sea obeys.',
  },
  danian_migratory_hymn: {
    id:'danian_migratory_hymn', cardType:'mugic', name:'Danian Migratory Hymn',
    tribe:'danian', cost:1, rarity:'rare', tier:2, set:'perim',
    effect:'swap_active', description:'Swap your active creature with a reserve.',
    flavorText:'The hymn that guides the colony to new territory.',
  },
  colony_call: {
    id:'colony_call', cardType:'mugic', name:'Colony Call',
    tribe:'danian', cost:2, rarity:'epic', tier:3, set:'perim',
    effect:'heal_30_all', description:'Heal 30 Energy to ALL your creatures.',
    flavorText:'The colony rises as one.',
  },
  underground_rumble: {
    id:'underground_rumble', cardType:'mugic', name:'Underground Rumble',
    tribe:'danian', cost:1, rarity:'uncommon', tier:1, set:'zenith',
    effect:'boost_power_30', description:'Active creature gains +30 Power this turn.',
    flavorText:'The earth shakes at the Danians\' call.',
  },
  antiphon_of_hive: {
    id:'antiphon_of_hive', cardType:'mugic', name:'Antiphon of the Hive',
    tribe:'danian', cost:1, rarity:'uncommon', tier:1, set:'perim',
    effect:'negate_attack', description:'Negate an attack. Opponent does 0 damage this turn.',
    flavorText:'The hive mind cannot be silenced.',
  },

  // ═══════════════════════════════════════════════════
  // LOCATIONS
  // ═══════════════════════════════════════════════════
  plen_o_chao: {
    id:'plen_o_chao', cardType:'location', name:'Plen-O-Chao',
    initiative:'courage', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{ courage:10 }, tribeBonuses:{},
    description:"All creatures gain +10 Courage. Initiative: Courage.",
    flavorText:'A place where courage is the only currency.',
  },
  castle_bodhran: {
    id:'castle_bodhran', cardType:'location', name:'Castle Bodhran',
    initiative:'power', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{ power:10 }, tribeBonuses:{},
    description:'All creatures gain +10 Power. Initiative: Power.',
    flavorText:'The great castle where power is king.',
  },
  gothos_tower: {
    id:'gothos_tower', cardType:'location', name:"Gothos' Tower",
    initiative:'wisdom', rarity:'rare', tier:2, set:'perim',
    allBonuses:{}, tribeBonuses:{ underworld:{ wisdom:20 } },
    description:"Underworld creatures gain +20 Wisdom. Initiative: Wisdom.",
    flavorText:"Gothos' tower was built from the bones of defeated enemies.",
  },
  doors_of_deepmines: {
    id:'doors_of_deepmines', cardType:'location', name:'Doors of the Deepmines',
    initiative:'speed', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{}, tribeBonuses:{ danian:{ speed:15, courage:10 } },
    description:'Danian creatures gain +15 Speed and +10 Courage. Initiative: Speed.',
    flavorText:'The tunnels beneath Perim that only Danians truly know.',
  },
  overworld_city: {
    id:'overworld_city', cardType:'location', name:'Overworld City',
    initiative:'courage', rarity:'rare', tier:2, set:'perim',
    allBonuses:{}, tribeBonuses:{ overworld:{ courage:15, power:10, wisdom:10, speed:10 } },
    description:'Overworld creatures gain +15 Courage, +10 all other disciplines.',
    flavorText:'The heart of Overworld civilization.',
  },
  m_arrillian_seas: {
    id:'m_arrillian_seas', cardType:'location', name:"M'arrillian Seas",
    initiative:'wisdom', rarity:'rare', tier:2, set:'marrillian',
    allBonuses:{}, tribeBonuses:{ marrillian:{ wisdom:20, speed:10 } },
    description:"M'arrillian creatures gain +20 Wisdom and +10 Speed.",
    flavorText:'Deep waters where the M\'arrillians are supreme.',
  },
  mipedian_desert: {
    id:'mipedian_desert', cardType:'location', name:'Mipedian Desert',
    initiative:'speed', rarity:'rare', tier:2, set:'silent_sands',
    allBonuses:{}, tribeBonuses:{ mipedian:{ speed:25, wisdom:10 } },
    description:'Mipedian creatures gain +25 Speed and +10 Wisdom.',
    flavorText:'The vast desert where Mipedians are never lost.',
  },
  danian_mound: {
    id:'danian_mound', cardType:'location', name:'Danian Mound',
    initiative:'courage', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{}, tribeBonuses:{ danian:{ courage:15, power:15 } },
    description:'Danian creatures gain +15 Courage and +15 Power.',
    flavorText:'The great mound that serves as home and fortress.',
  },
  riverlands: {
    id:'riverlands', cardType:'location', name:'Riverlands',
    initiative:'speed', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{ speed:10, courage:-5 }, tribeBonuses:{},
    description:'All creatures gain +10 Speed but -5 Courage. Initiative: Speed.',
    flavorText:'The river slows heavy warriors.',
  },
  glacier_plains: {
    id:'glacier_plains', cardType:'location', name:'Glacier Plains',
    initiative:'wisdom', rarity:'uncommon', tier:1, set:'zenith',
    allBonuses:{ wisdom:10, speed:-10 }, tribeBonuses:{},
    description:'All creatures gain +10 Wisdom but -10 Speed. Initiative: Wisdom.',
    flavorText:'The cold clarity of ice sharpens the mind.',
  },
  brawlers_burrow: {
    id:'brawlers_burrow', cardType:'location', name:"Brawler's Burrow",
    initiative:'power', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{ power:15, wisdom:-5 }, tribeBonuses:{},
    description:'All creatures gain +15 Power but -5 Wisdom. Initiative: Power.',
    flavorText:'Where brawn, not brains, wins the day.',
  },
  the_deepmines: {
    id:'the_deepmines', cardType:'location', name:'The Deepmines',
    initiative:'wisdom', rarity:'rare', tier:2, set:'perim',
    allBonuses:{}, tribeBonuses:{ danian:{ courage:20, power:20 } },
    description:'Danian creatures gain +20 Courage and +20 Power.',
    flavorText:'Miles of tunnels, each carved by Danian claws.',
  },
  lava_pond: {
    id:'lava_pond', cardType:'location', name:'Lava Pond',
    initiative:'courage', rarity:'rare', tier:2, set:'perim',
    allBonuses:{}, tribeBonuses:{ underworld:{ courage:15, power:20 } },
    description:'Underworld creatures gain +15 Courage and +20 Power.',
    flavorText:'Born of fire, mastered by the Underworld.',
  },
  storm_valley: {
    id:'storm_valley', cardType:'location', name:'Storm Valley',
    initiative:'speed', rarity:'uncommon', tier:1, set:'zenith',
    allBonuses:{ speed:15 }, tribeBonuses:{},
    description:'All creatures gain +15 Speed. Initiative: Speed.',
    flavorText:'Constant storms keep only the fastest creatures alive.',
  },
  perim_jungle: {
    id:'perim_jungle', cardType:'location', name:'Perim Jungle',
    initiative:'courage', rarity:'uncommon', tier:1, set:'perim',
    allBonuses:{}, tribeBonuses:{ overworld:{ wisdom:15, courage:10 } },
    description:'Overworld creatures gain +15 Wisdom and +10 Courage.',
    flavorText:'The ancient jungle favors those who respect nature.',
  },
  ancient_temple: {
    id:'ancient_temple', cardType:'location', name:'Ancient Temple',
    initiative:'wisdom', rarity:'rare', tier:2, set:'secrets',
    allBonuses:{ wisdom:15, mugicCounters:1 }, tribeBonuses:{},
    description:'All creatures gain +15 Wisdom and +1 Mugic Counter.',
    flavorText:'Ancient power flows through these ruins.',
  },
  frozen_barrens: {
    id:'frozen_barrens', cardType:'location', name:'Frozen Barrens',
    initiative:'power', rarity:'uncommon', tier:1, set:'secrets',
    allBonuses:{ power:10, speed:-15 }, tribeBonuses:{},
    description:'All creatures gain +10 Power but -15 Speed. Initiative: Power.',
    flavorText:'Nothing moves fast when frozen to the bone.',
  },
  sand_sea: {
    id:'sand_sea', cardType:'location', name:'Sand Sea',
    initiative:'speed', rarity:'rare', tier:2, set:'silent_sands',
    allBonuses:{}, tribeBonuses:{ mipedian:{ speed:30 } },
    description:'Mipedian creatures gain +30 Speed.',
    flavorText:'A sea of sand that only the Mipedians can navigate.',
  },
  underwater_ruins: {
    id:'underwater_ruins', cardType:'location', name:'Underwater Ruins',
    initiative:'wisdom', rarity:'rare', tier:2, set:'marrillian',
    allBonuses:{}, tribeBonuses:{ marrillian:{ wisdom:25, speed:15 } },
    description:"M'arrillian creatures gain +25 Wisdom and +15 Speed.",
    flavorText:'Ancient ruins that predate even M\'arrillian civilization.',
  },
  skies_of_perim: {
    id:'skies_of_perim', cardType:'location', name:'Skies of Perim',
    initiative:'speed', rarity:'epic', tier:3, set:'perim',
    allBonuses:{ speed:20, courage:10 }, tribeBonuses:{},
    description:'All creatures gain +20 Speed and +10 Courage.',
    flavorText:'The boundless skies where only legends soar.',
  },
};

// ═══════════════════════════════════════════════════
// FIXED OPPONENTS (Story Mode)
// ═══════════════════════════════════════════════════
function mkFighter(cardId) {
  const c = CARDS[cardId];
  return { cardId, currentEnergy: c.energy, maxEnergy: c.energy, mugicCounters: c.mugicCounters, courage: c.courage, power: c.power, wisdom: c.wisdom, speed: c.speed, statusEffects: { burned: 0, confused: false, reduceDmg: 0 }, battlegearId: null };
}

export const FIXED_OPPONENTS = [
  { id:'ignis', wave:1, name:'Trainer Ignis', subtitle:'Mipedian Adept', tribe:'mipedian', color:'#C8960C', prize:3, reward:50, mugic:[], location:'plen_o_chao',
    team:['ario','onyx_mip','kolmo'].map(mkFighter) },
  { id:'nyx', wave:2, name:'Trainer Nyx', subtitle:'Underworld Champion', tribe:'underworld', color:'#CC2200', prize:3, reward:80, mugic:['overture_of_broken'], location:'lava_pond',
    team:['h_earring','gothos','rothar'].map(mkFighter) },
  { id:'steelborn', wave:3, name:'Trainer Steelborn', subtitle:'Overworld Veteran', tribe:'overworld', color:'#3A80C9', prize:3, reward:110, mugic:['footstep_of_brave'], location:'castle_bodhran',
    team:['attacat','lomma','tartarek'].map(mkFighter) },
  { id:'tidemaster', wave:4, name:"Tidemaster Okar", subtitle:"M'arrillian Elite", tribe:'marrillian', color:'#009999', prize:3, reward:150, mugic:['deep_hum','tide_melody'], location:'m_arrillian_seas',
    team:['uran','kharit','karlen'].map(mkFighter) },
  { id:'queencaller', wave:5, name:'Queen Caller Heth', subtitle:'Danian Champion', tribe:'danian', color:'#8B5A2B', prize:4, reward:200, mugic:['underground_rumble','colony_call'], location:'danian_mound',
    team:['ant_drone','arbeid','ramarhvir','odu_bathax'].map(mkFighter) },
  { id:'chaos_champion', wave:6, name:'Chaos Champion', subtitle:'Mixed Master', tribe:'overworld', color:'#f59e0b', prize:4, reward:280, mugic:['fanfare_of_thoribor','cadence_of_malvadine'], location:'skies_of_perim',
    team:['kiru','wagram','intress','lore'].map(mkFighter) },
  { id:'the_prime', wave:7, name:'The Prime', subtitle:'Final Challenge', tribe:'underworld', color:'#c084fc', prize:5, reward:400, mugic:['cadence_of_malvadine','refrain_of_denial','fanfare_of_thoribor'], location:'ancient_temple',
    team:['maxxor','chaor','phelphor','nimmei'].map(mkFighter) },
];

// ═══════════════════════════════════════════════════
// PACKS (Chaotic TCG Sets)
// ═══════════════════════════════════════════════════
export const PACKS = [
  { id:'perim_starter', name:'Perim Starter', cost:30, color:'#3A80C9', emoji:'📦', set:'perim', tier:1,
    description:'Basic cards from all 5 tribes. Creatures, Battlegear, and Mugic.',
    rarityWeights:{ common:65, uncommon:30, rare:5, epic:0, legendary:0 } },
  { id:'zenith', name:'Zenith of Chaotic', cost:80, color:'#6366f1', emoji:'⚡', set:'zenith', tier:2,
    description:'Uncommon and Rare cards from all tribes.',
    rarityWeights:{ common:20, uncommon:45, rare:30, epic:5, legendary:0 } },
  { id:'silent_sands', name:'Silent Sands', cost:100, color:'#C8960C', emoji:'🌪️', set:'silent_sands', tier:2,
    description:'Mipedian-heavy set. Sand and speed.',
    rarityWeights:{ common:15, uncommon:40, rare:35, epic:10, legendary:0 } },
  { id:'marrillian', name:"M'arrillian Invasion", cost:150, color:'#009999', emoji:'🌊', set:'marrillian', tier:2,
    description:"M'arrillian invasion cards. Includes unique mugic.",
    rarityWeights:{ common:10, uncommon:35, rare:40, epic:15, legendary:0 } },
  { id:'dawn', name:'Dawn of Perim', cost:250, color:'#f59e0b', emoji:'🌅', set:'dawn', tier:3,
    description:'Rare and Epic cards. Legendary possible.',
    rarityWeights:{ common:0, uncommon:15, rare:45, epic:35, legendary:5 } },
  { id:'secrets', name:'Secrets of the Lost City', cost:500, color:'#c084fc', emoji:'🏛️', set:'secrets', tier:3,
    description:'Epic and Legendary guaranteed. The rarest cards in Perim.',
    rarityWeights:{ common:0, uncommon:0, rare:20, epic:50, legendary:30 } },
];

// ═══════════════════════════════════════════════════
// STARTING DATA
// ═══════════════════════════════════════════════════
export const STARTING_COLLECTION = {
  // Overworld starters
  attacat:2, zhade:2, owis:2, bodal:1,
  // Underworld starters
  h_earring:2, kopond:2, gothos:1,
  // Mipedian starters
  ario:2, onyx_mip:2,
  // M'arrillian starters
  uran:2, unda_dex:1,
  // Danian starters
  ant_drone:2, hive_sentinel:1,
  // Battlegear starters
  perithane_shield:2, sandstorm_belt:2, velocity_boots:1,
  // Mugic starters
  footstep_of_brave:2, hooligan_hymn:2, melody_of_mirage:1,
  // Locations
  plen_o_chao:2, storm_valley:1,
};

export const STARTING_CODEX = {
  team: { attacat:1, zhade:1, h_earring:1, ario:1 },
  battlegear: {},
  mugic: { footstep_of_brave:1, hooligan_hymn:1 },
  location: null,
};

export const STARTING_COINS = 100;
export const PACK_SIZE = 7;
export const MAX_TEAM_SIZE = 6;
export const MIN_TEAM_SIZE = 1;
export const MAX_MUGIC = 4;
export const MAX_BATTLEGEAR_PER_CREATURE = 1;

// Legacy compat (used by existing components)
export const STARTING_DECK = STARTING_CODEX.team;
export const MAX_DECK_SIZE = 6;
export const MIN_DECK_SIZE = 1;
export const MAX_COPIES = 2;
export const MAX_BENCH = 5;
export const PRIZE_COUNT = 3;
export const WEAKNESS_BONUS = 20;
export const WEAKNESS_CHART = {};
export const RARITY_COLORS = Object.fromEntries(Object.entries(RARITY_DATA).map(([k,v])=>[k,v.color]));
export const OPPONENTS = FIXED_OPPONENTS;
