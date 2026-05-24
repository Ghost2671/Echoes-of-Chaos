import { useState, useEffect } from 'react';
import { STARTING_COLLECTION, STARTING_CODEX, STARTING_COINS, CARDS, FIXED_OPPONENTS, PACKS } from './gameData';
import { generateOpponent, makeFighter } from './utils';
import Battle, { buildBattleState } from './screens/Battle';
import Shop from './screens/Shop';
import Collection from './screens/Collection';
import Trading from './screens/Trading';
import PvP from './screens/PvP';
import Guild from './screens/Guild';

const SAVE_KEY = 'chaotic-v4';
const C = {
  bg:'#07070a', panel:'#0d0d12', orange:'#F26522', amber:'#F5A623',
  text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171',
  blue:'#60a5fa', purple:'#c084fc', border:'#1a1625',
};

const TRIBE_DATA_LOCAL = {
  overworld:  { color:'#1a6ab8', name:'Overworld',   icon:'⚔️' },
  underworld: { color:'#CC2200', name:'Underworld',  icon:'🔥' },
  mipedian:   { color:'#C8960C', name:'Mipedian',    icon:'🌪️' },
  marrillian: { color:'#009999', name:"M'arrillian", icon:'🌊' },
  danian:     { color:'#8B5A2B', name:'Danian',      icon:'🐜' },
};

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function defaultSave() {
  return {
    coins: STARTING_COINS,
    collection: { ...STARTING_COLLECTION },
    codex: { ...STARTING_CODEX },
    wins: 0,
    losses: 0,
    storyProgress: 0,
    endlessWave: 1,
    guild: null,
    version: 4,
  };
}

function saveSave(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e) {}
}

// ── Hub card component ─────────────────────────────────────────────────────────
function HubCard({ icon, title, subtitle, onClick, color = C.orange, badge = null, disabled = false }) {
  const [hov, setHov] = useState(false);
  const lines = typeof subtitle === 'string' ? subtitle.split('\n') : [subtitle];
  return (
    <div
      onClick={disabled ? null : onClick}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${color}18` : C.panel,
        border: `1px solid ${hov ? color : C.border}`,
        borderRadius: 12, padding: '20px 22px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s', position: 'relative',
        boxShadow: hov ? `0 0 20px ${color}22` : 'none',
      }}
    >
      {badge && (
        <div style={{ position: 'absolute', top: 10, right: 12, background: color + '33', border: `1px solid ${color}`, color, fontSize: 8, padding: '1px 6px', borderRadius: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>
          {badge}
        </div>
      )}
      <div style={{ fontSize: 36, marginBottom: 10, filter: hov ? `drop-shadow(0 0 10px ${color}88)` : 'none', transition: 'filter 0.2s' }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 'bold', color: hov ? color : C.text, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 8.5, color: C.muted, lineHeight: 1.7 }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

// ── Notification toast ─────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#0a1a0a', border: `1px solid ${C.green}`, color: C.green, padding: '10px 28px', borderRadius: 10, zIndex: 9999, fontSize: 11, fontWeight: 'bold', boxShadow: `0 4px 30px ${C.green}33`, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  );
}

export default function App() {
  const [save, setSave] = useState(() => {
    const s = loadSave();
    if (!s || s.version !== 4) return defaultSave();
    return s;
  });
  const [screen, setScreen] = useState('hub'); // hub | battle | shop | collection | trading | pvp | guild
  const [battleState, setBattleState] = useState(null);
  const [toast, setToast] = useState(null);
  const [storyTab, setStoryTab] = useState('story'); // 'story' | 'endless'

  useEffect(() => { saveSave(save); }, [save]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  function updateSave(fn) {
    setSave(prev => { const next = fn(prev); saveSave(next); return next; });
  }

  // ── Battle flow ──────────────────────────────────────────────────────────────
  function startBattle(opponentData) {
    const bs = buildBattleState(save.codex, opponentData);
    if (!bs) { showToast('⚠ Add creatures to your codex first!'); return; }
    setBattleState(bs);
    setScreen('battle');
  }

  function startPvPBattle(type, opponentName) {
    // Generate a random opponent for the PvP match
    const opp = generateOpponent(save.wins + 1);
    opp.name = opponentName;
    opp.subtitle = 'PvP Challenger';
    startBattle(opp);
  }

  function handleBattleUpdate(newState) {
    setBattleState(newState);
  }

  function handleBattleEnd(won, coinsEarned) {
    updateSave(prev => ({
      ...prev,
      coins:      Math.max(0, prev.coins + coinsEarned),
      wins:       won ? prev.wins + 1 : prev.wins,
      losses:     won ? prev.losses : prev.losses + 1,
      storyProgress: (won && battleState?.opponentData?.id && !battleState.opponentData.generated)
        ? Math.max(prev.storyProgress, FIXED_OPPONENTS.findIndex(o => o.id === battleState.opponentData.id) + 1)
        : prev.storyProgress,
      endlessWave: (won && battleState?.opponentData?.generated)
        ? prev.endlessWave + 1
        : prev.endlessWave,
    }));
    showToast(won ? `🏆 Victory! +${coinsEarned} coins` : '💀 Defeated — train harder!');
    setScreen('hub');
    setBattleState(null);
  }

  // ── Shop ─────────────────────────────────────────────────────────────────────
  function handleBuyPack(packId, cardIds, cost) {
    updateSave(prev => {
      const newColl = { ...prev.collection };
      cardIds.forEach(id => { newColl[id] = (newColl[id] || 0) + 1; });
      return { ...prev, coins: Math.max(0, prev.coins - cost), collection: newColl };
    });
  }

  // ── Collection / Codex ───────────────────────────────────────────────────────
  function handleUpdateCodex(newCodex) {
    updateSave(prev => ({ ...prev, codex: newCodex }));
  }

  // ── Trading ──────────────────────────────────────────────────────────────────
  function handleTrade(delta, coinDelta) {
    updateSave(prev => {
      const newColl = { ...prev.collection };
      Object.entries(delta).forEach(([id, d]) => {
        newColl[id] = Math.max(0, (newColl[id] || 0) + d);
        if (newColl[id] === 0) delete newColl[id];
      });
      return { ...prev, collection: newColl, coins: Math.max(0, prev.coins + coinDelta) };
    });
  }

  // ── Guild ─────────────────────────────────────────────────────────────────────
  function handleUpdateGuild(newGuild, sideEffects = {}) {
    updateSave(prev => ({
      ...prev,
      guild: newGuild,
      coins: prev.coins - (sideEffects.spendCoins || 0) + (sideEffects.earnCoins || 0),
    }));
    if (sideEffects.earnCoins) showToast(`💰 +${sideEffects.earnCoins} coins from guild challenge!`);
  }

  // ── Reset save ────────────────────────────────────────────────────────────────
  function resetSave() {
    if (!window.confirm('Reset ALL progress? This cannot be undone.')) return;
    const fresh = defaultSave();
    setSave(fresh);
    saveSave(fresh);
    showToast('Game reset. Welcome to Chaotic!');
  }

  const teamSize = Object.values(save.codex?.team || {}).reduce((s, n) => s + n, 0);
  const totalCards = Object.values(save.collection || {}).reduce((s, n) => s + n, 0);

  // ── Screens ───────────────────────────────────────────────────────────────────
  if (screen === 'battle') {
    return (
      <Battle
        state={battleState}
        onUpdateBattle={handleBattleUpdate}
        onEndBattle={handleBattleEnd}
      />
    );
  }

  if (screen === 'shop') {
    return (
      <Shop
        coins={save.coins}
        onBuyPack={handleBuyPack}
        onClose={() => setScreen('hub')}
      />
    );
  }

  if (screen === 'collection') {
    return (
      <Collection
        collection={save.collection}
        codex={save.codex}
        onUpdateCodex={handleUpdateCodex}
        onClose={() => setScreen('hub')}
      />
    );
  }

  if (screen === 'trading') {
    return (
      <Trading
        collection={save.collection}
        coins={save.coins}
        onTrade={handleTrade}
        onClose={() => setScreen('hub')}
      />
    );
  }

  if (screen === 'pvp') {
    return (
      <PvP
        codex={save.codex}
        collection={save.collection}
        coins={save.coins}
        onClose={() => setScreen('hub')}
        onStartBattle={startPvPBattle}
      />
    );
  }

  if (screen === 'guild') {
    return (
      <Guild
        guild={save.guild}
        coins={save.coins}
        wins={save.wins}
        onUpdateGuild={handleUpdateGuild}
        onClose={() => setScreen('hub')}
      />
    );
  }

  // ── HUB ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: C.bg, minHeight: '100vh', color: C.text }}>
      <Toast msg={toast} />

      {/* Top nav bar */}
      <div style={{ background: '#08060a', borderBottom: `2px solid ${C.orange}`, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 26, filter: `drop-shadow(0 0 8px ${C.orange}88)` }}>⚡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: C.orange, textTransform: 'uppercase', letterSpacing: 3, lineHeight: 1 }}>CHAOTIC</div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 2 }}>Master of Perim</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: C.amber }}>💰 {save.coins}</div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase' }}>Coins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: C.green }}>🏆 {save.wins}</div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase' }}>Wins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: C.text }}>📦 {totalCards}</div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase' }}>Cards</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: C.blue }}>⚔ {teamSize}/6</div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase' }}>Team</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* Battle Section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
            {['story', 'endless'].map(t => (
              <button key={t} onClick={() => setStoryTab(t)} style={{ padding: '7px 20px', borderRadius: t === 'story' ? '6px 0 0 6px' : '0 6px 6px 0', background: storyTab === t ? C.orange + '33' : 'transparent', border: `1px solid ${storyTab === t ? C.orange : C.border}`, color: storyTab === t ? C.orange : C.muted, fontSize: 9, cursor: 'pointer', fontWeight: storyTab === t ? 'bold' : 'normal', textTransform: 'uppercase', letterSpacing: 1 }}>
                {t === 'story' ? '📖 Story Mode' : '♾ Endless Mode'}
              </button>
            ))}
          </div>

          {storyTab === 'story' && (
            <div>
              <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                Story Battles — Progress: {save.storyProgress}/{FIXED_OPPONENTS.length}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {FIXED_OPPONENTS.map((opp, i) => {
                  const unlocked = i <= save.storyProgress;
                  const completed = i < save.storyProgress;
                  const td = TRIBE_DATA_LOCAL[opp.tribe] || {};
                  return (
                    <div
                      key={opp.id}
                      onClick={() => unlocked && startBattle(opp)}
                      style={{ background: completed ? '#0a160a' : unlocked ? C.panel : '#080808', border: `1px solid ${completed ? '#1a4a1a' : unlocked ? td.color + '44' || C.border : '#111'}`, borderRadius: 10, padding: '14px 16px', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.4, transition: 'all 0.15s', position: 'relative' }}
                    >
                      {completed && <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 12 }}>✅</div>}
                      {!unlocked && <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 12 }}>🔒</div>}
                      <div style={{ fontSize: 8, color: td.color || C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Battle {i + 1} · {td.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: C.text, marginBottom: 2 }}>{opp.name}</div>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 6 }}>{opp.subtitle}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: C.muted }}>
                        <span>{opp.team.length} creatures</span>
                        <span style={{ color: C.amber }}>💰 {opp.reward}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {storyTab === 'endless' && (
            <div>
              <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                Endless Mode — Current Wave: {save.endlessWave}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {[0, 1, 2, 3, 4].map(offset => {
                  const wave = save.endlessWave + offset;
                  const isNext = offset === 0;
                  const opp = generateOpponent(wave);
                  const td = TRIBE_DATA_LOCAL[opp.tribe] || {};
                  return (
                    <div
                      key={wave}
                      onClick={() => isNext && startBattle(opp)}
                      style={{ background: isNext ? `${C.orange}11` : C.panel, border: `1px solid ${isNext ? C.orange : C.border}`, borderRadius: 10, padding: '14px 16px', cursor: isNext ? 'pointer' : 'not-allowed', opacity: isNext ? 1 : 0.4 }}
                    >
                      <div style={{ fontSize: 8, color: isNext ? C.orange : C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Wave {wave} · {isNext ? 'FIGHT!' : 'Upcoming'}</div>
                      <div style={{ fontSize: 11, fontWeight: 'bold', color: C.text, marginBottom: 2 }}>{opp.name}</div>
                      <div style={{ fontSize: 9, color: td.color || C.muted, marginBottom: 6 }}>{opp.subtitle}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: C.muted }}>
                        <span>{opp.team.length} creatures</span>
                        <span style={{ color: C.amber }}>💰 {opp.reward}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Hub Grid */}
        <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Chaotic Hub</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          <HubCard icon="📦" title="Collection" subtitle={`${totalCards} cards · ${Object.keys(save.collection || {}).length} unique\nBuild your battle codex`} onClick={() => setScreen('collection')} color={C.blue} badge={teamSize === 0 ? 'Set Team!' : null} />
          <HubCard icon="🎴" title="Scanner Shop" subtitle={`${save.coins} coins · ${Object.keys(PACKS).length} packs available\n3 rarity tiers per tribe`} onClick={() => setScreen('shop')} color={C.amber} />
          <HubCard icon="🤝" title="Card Market" subtitle="Trade with NPC players\nor the open market" onClick={() => setScreen('trading')} color={C.green} />
          <HubCard icon="⚔" title="PvP Arena" subtitle="Battle other Chaotic players\nlive in the arena" onClick={() => setScreen('pvp')} color={C.red} />
          <HubCard icon="🏛" title="Guild" subtitle={save.guild ? `${save.guild.name}\n${save.guild.rank} · ${save.guild.wins} wins` : 'Create or join a guild\nComplete challenges'} onClick={() => setScreen('guild')} color={C.purple} badge={!save.guild ? 'New!' : null} />
        </div>

        {/* Stats bar */}
        <div style={{ background: C.panel, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Wins', value: save.wins, color: C.green },
              { label: 'Total Losses', value: save.losses, color: C.red },
              { label: 'Win Rate', value: save.wins + save.losses > 0 ? `${Math.round((save.wins / (save.wins + save.losses)) * 100)}%` : '—', color: C.amber },
              { label: 'Story Progress', value: `${save.storyProgress}/${FIXED_OPPONENTS.length}`, color: C.blue },
              { label: 'Endless Wave', value: save.endlessWave, color: C.purple },
              { label: 'Guild', value: save.guild ? save.guild.name : '—', color: save.guild ? C.purple : C.muted },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <button onClick={resetSave} style={{ background: 'transparent', border: '1px solid #f87171', color: C.red, borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Reset Save</button>
        </div>

        {/* Tribe reference */}
        <div style={{ background: C.panel, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 20px' }}>
          <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>The 5 Tribes of Perim</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(TRIBE_DATA_LOCAL).map(([id, td]) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: td.color + '11', border: `1px solid ${td.color}33`, borderRadius: 20 }}>
                <span style={{ fontSize: 14 }}>{td.icon}</span>
                <span style={{ fontSize: 9, color: td.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>{td.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 8, color: C.muted, lineHeight: 1.6 }}>
            Elements: 🔥 Fire beats 💨 Air · 💧 Water beats 🔥 Fire · 🌿 Earth beats 💧 Water · 💨 Air beats 🌿 Earth &nbsp;·&nbsp; Winning element deals +10 damage, resisting reduces by 5
          </div>
        </div>
      </div>
    </div>
  );
}
