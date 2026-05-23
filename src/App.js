import { useState, useEffect } from 'react';
import { STARTING_COLLECTION, STARTING_DECK, STARTING_COINS, CARDS, OPPONENTS } from './gameData';
import { deckCardCount } from './utils';
import Battle, { buildBattleState } from './screens/Battle';
import Shop from './screens/Shop';
import Collection from './screens/Collection';

const C = { bg: '#080808', panel: '#0f0f0f', border: '#1e1a10', orange: '#F26522', amber: '#F5A623', text: '#EDE0CC', muted: '#5A4A36' };

function buildInitialState() {
  return { screen: 'hub', coins: STARTING_COINS, collection: { ...STARTING_COLLECTION }, deck: { ...STARTING_DECK }, battle: null, highestWave: 0 };
}
function loadState() {
  try { const s = localStorage.getItem('chaotic-v1'); return s ? { ...buildInitialState(), ...JSON.parse(s) } : buildInitialState(); } catch { return buildInitialState(); }
}

export default function App() {
  const [gs, setGs] = useState(loadState);
  useEffect(() => { const { battle, ...save } = gs; localStorage.setItem('chaotic-v1', JSON.stringify(save)); }, [gs]);

  function nav(screen) { setGs(p => ({ ...p, screen })); }

  function startBattle(opponentIndex) {
    const deckArr = Object.values(gs.deck).reduce((a, b) => a + b, 0);
    if (deckArr < 10) return;
    const creatureCount = Object.entries(gs.deck).filter(([id, n]) => n > 0 && CARDS[id]?.cardType === 'creature').reduce((s, [, n]) => s + n, 0);
    if (creatureCount < 2) return;
    const battle = buildBattleState(gs.deck, opponentIndex);
    setGs(p => ({ ...p, screen: 'battle', battle }));
  }

  function onUpdateBattle(b) { setGs(p => ({ ...p, battle: b })); }

  function onEndBattle(victory, coinsEarned) {
    setGs(p => ({
      ...p, screen: 'hub', battle: null,
      coins: p.coins + (coinsEarned || 0),
      highestWave: victory ? Math.max(p.highestWave, (p.battle?.opponentIndex ?? 0) + 1) : p.highestWave,
    }));
  }

  function onBuyPack(packId, cards, cost) {
    setGs(p => {
      const c = { ...p.collection };
      for (const id of cards) c[id] = (c[id] || 0) + 1;
      return { ...p, coins: p.coins - cost, collection: c };
    });
  }
  function onDeckChange(deck) { setGs(p => ({ ...p, deck })); }
  function resetAll() { localStorage.removeItem('chaotic-v1'); setGs(buildInitialState()); }

  const { screen, coins, collection, deck, battle, highestWave } = gs;

  if (screen === 'battle' && battle) return <Battle state={battle} onUpdateBattle={onUpdateBattle} onEndBattle={onEndBattle} />;
  if (screen === 'shop') return <Shop coins={coins} onBuyPack={onBuyPack} onClose={() => nav('hub')} />;
  if (screen === 'collection' || screen === 'deckbuilder') return <Collection collection={collection} deck={deck} onDeckChange={onDeckChange} onClose={() => nav('hub')} activeTab={screen === 'deckbuilder' ? 'deck' : 'collection'} />;

  // ── Hub ─────────────────────────────────────────────────────────────────
  const deckSize = deckCardCount(deck);
  const deckCreatures = Object.entries(deck).filter(([id, n]) => n > 0 && CARDS[id]?.cardType === 'creature').reduce((s, [, n]) => s + n, 0);
  const deckValid = deckSize >= 10 && deckCreatures >= 2;
  const totalCards = Object.values(collection).reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.bg, minHeight: '100vh', color: C.text }}>
      {/* Scan-line overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(242,101,34,0.015) 3px, rgba(242,101,34,0.015) 4px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ borderBottom: `2px solid ${C.orange}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0c0800' }}>
          <div>
            <div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 2 }}>Digital Battling System</div>
            <div style={{ fontSize: 26, fontWeight: 'bold', color: C.orange, textTransform: 'uppercase', letterSpacing: 4, textShadow: `0 0 20px ${C.orange}88` }}>Echoes of Chaos</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginTop: 2 }}>Scan · Battle · Conquer</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: C.amber }}>💰 {coins}</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{totalCards} cards scanned</div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', maxWidth: 900, margin: '0 auto' }}>
          {/* Deck status */}
          <div style={{ background: C.panel, border: `1px solid ${deckValid ? C.orange : '#5a1a1a'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Battle Deck</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: deckValid ? C.orange : '#f87171', textTransform: 'uppercase', letterSpacing: 1 }}>
                {deckValid ? `✓ Ready — ${deckSize} cards, ${deckCreatures} creatures` : `✗ Invalid — ${deckSize < 10 ? `need ${10 - deckSize} more cards` : deckCreatures < 2 ? 'need 2+ creatures' : ''}`}
              </div>
            </div>
            <button onClick={() => nav('deckbuilder')} style={{ background: 'transparent', color: C.orange, border: `1px solid ${C.orange}`, borderRadius: 6, padding: '7px 16px', fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>Edit Deck</button>
          </div>

          {/* Nav grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Collection', icon: '📡', desc: `${totalCards} cards scanned. Browse your archive.`, color: '#009999', action: () => nav('collection') },
              { label: 'Deck Builder', icon: '🃏', desc: `Build your battle deck (min 10 cards, 2+ creatures).`, color: '#C8960C', action: () => nav('deckbuilder') },
              { label: 'Scanner Shop', icon: '⚡', desc: 'Scan new packs to discover creatures and Battlegear.', color: C.orange, action: () => nav('shop') },
            ].map(({ label, icon, desc, color, action }) => (
              <div key={label} onClick={action} style={{ background: C.panel, border: `1px solid ${color}55`, borderRadius: 10, padding: '18px 16px', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: `0 0 0px ${color}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 12px ${color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: 14, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Battle — opponent list */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>⚔ Battle Opponents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OPPONENTS.map((opp, i) => {
                const unlocked = i <= highestWave;
                const beaten = i < highestWave;
                return (
                  <div key={opp.id} onClick={() => unlocked && deckValid && startBattle(i)} style={{
                    background: C.panel, border: `1px solid ${unlocked ? opp.color + '88' : '#1a1410'}`,
                    borderRadius: 8, padding: '12px 16px', cursor: unlocked && deckValid ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.4,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: beaten ? `0 0 8px ${opp.color}22` : 'none',
                  }}
                    onMouseEnter={e => { if (unlocked && deckValid) e.currentTarget.style.boxShadow = `0 0 12px ${opp.color}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = beaten ? `0 0 8px ${opp.color}22` : 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 6, height: 36, borderRadius: 3, background: unlocked ? opp.color : '#2a1a0a', flexShrink: 0, boxShadow: unlocked ? `0 0 6px ${opp.color}` : 'none' }} />
                      <div>
                        <div style={{ fontSize: 9, color: unlocked ? opp.color : C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                          Wave {i + 1} — {opp.subtitle}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 'bold', color: unlocked ? C.text : C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{opp.name}</div>
                        <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
                          {opp.team.length} creatures · Prize cards: {opp.prize} · Reward: 💰 {opp.reward}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      {beaten && <span style={{ fontSize: 9, color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>✓ Beaten</span>}
                      {unlocked && !beaten && <span style={{ fontSize: 9, color: C.orange, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>▶ Challenge</span>}
                      {!unlocked && <span style={{ fontSize: 9, color: C.muted }}>🔒 Locked</span>}
                      {unlocked && !deckValid && <span style={{ fontSize: 8, color: '#f87171' }}>Deck not ready</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={resetAll} style={{ background: 'transparent', color: '#3a2a1a', border: 'none', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>Reset all progress</button>
        </div>
      </div>
    </div>
  );
}
