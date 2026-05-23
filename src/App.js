import { useState, useEffect } from 'react';
import { STARTING_COLLECTION, STARTING_DECK, STARTING_COINS, CARDS } from './gameData';
import { deckCardCount } from './utils';
import Battle, { buildBattleState } from './screens/Battle';
import Shop from './screens/Shop';
import Collection from './screens/Collection';

const LEVEL_UP_USES = 5;

function buildInitialProgress() {
  const prog = {};
  for (const id of Object.keys(CARDS)) {
    prog[id] = { level: 1, uses: 0 };
  }
  return prog;
}

function buildInitialState() {
  return {
    screen: 'hub',
    coins: STARTING_COINS,
    collection: { ...STARTING_COLLECTION },
    deck: { ...STARTING_DECK },
    cardProgress: buildInitialProgress(),
    battle: null,
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem('echoes-v3');
    if (!saved) return buildInitialState();
    const parsed = JSON.parse(saved);
    // Merge cardProgress so new cards from updates get defaults
    const prog = { ...buildInitialProgress(), ...(parsed.cardProgress || {}) };
    return { ...parsed, cardProgress: prog };
  } catch {
    return buildInitialState();
  }
}

export default function App() {
  const [gs, setGs] = useState(loadState);

  useEffect(() => {
    const { battle, ...toSave } = gs;
    localStorage.setItem('echoes-v3', JSON.stringify(toSave));
  }, [gs]);

  function nav(screen) { setGs(prev => ({ ...prev, screen })); }

  function startBattle() {
    const battle = buildBattleState(gs.deck);
    setGs(prev => ({ ...prev, screen: 'battle', battle }));
  }

  function onUpdateBattle(newBattle) {
    setGs(prev => ({ ...prev, battle: newBattle }));
  }

  function onCardUsed(cardId) {
    setGs(prev => {
      const prog = prev.cardProgress[cardId] || { level: 1, uses: 0 };
      const newUses = prog.uses + 1;
      const leveled = newUses % LEVEL_UP_USES === 0 && prog.level < 5;
      return {
        ...prev,
        cardProgress: {
          ...prev.cardProgress,
          [cardId]: { level: leveled ? prog.level + 1 : prog.level, uses: newUses },
        },
      };
    });
  }

  function onEndBattle(victory, coinsEarned) {
    setGs(prev => ({
      ...prev,
      screen: 'hub',
      battle: null,
      coins: prev.coins + (coinsEarned || 0),
    }));
  }

  function onBuyPack(packId, cards, cost) {
    setGs(prev => {
      const newCollection = { ...prev.collection };
      for (const cardId of cards) {
        newCollection[cardId] = (newCollection[cardId] || 0) + 1;
      }
      return { ...prev, coins: prev.coins - cost, collection: newCollection };
    });
  }

  function onDeckChange(newDeck) {
    setGs(prev => ({ ...prev, deck: newDeck }));
  }

  function resetAll() {
    localStorage.removeItem('echoes-v3');
    setGs(buildInitialState());
  }

  const { screen, coins, collection, deck, cardProgress, battle } = gs;

  if (screen === 'battle' && battle) {
    return (
      <Battle
        state={battle}
        onUpdateBattle={onUpdateBattle}
        onEndBattle={onEndBattle}
        cardProgress={cardProgress}
        onCardUsed={onCardUsed}
      />
    );
  }

  if (screen === 'shop') {
    return (
      <Shop
        coins={coins}
        collection={collection}
        cardProgress={cardProgress}
        onBuyPack={onBuyPack}
        onClose={() => nav('hub')}
      />
    );
  }

  if (screen === 'collection' || screen === 'deckbuilder') {
    return (
      <Collection
        collection={collection}
        deck={deck}
        cardProgress={cardProgress}
        onDeckChange={onDeckChange}
        onClose={() => nav('hub')}
        activeTab={screen === 'deckbuilder' ? 'deck' : 'collection'}
      />
    );
  }

  // Hub
  const deckSize = deckCardCount(deck);
  const deckValid = deckSize >= 4;
  const totalCards = Object.values(collection).reduce((a, b) => a + b, 0);

  const s = {
    root: {
      fontFamily: "'Segoe UI', sans-serif",
      background: '#0d0d1a',
      color: '#e0e0f0',
      minHeight: '100vh',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: { fontSize: 36, fontWeight: 'bold', color: '#c084fc', marginBottom: 4, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#475569', marginBottom: 36, textAlign: 'center' },
    coins: { fontSize: 18, color: '#f59e0b', fontWeight: 'bold', marginBottom: 28 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, maxWidth: 700, width: '100%', marginBottom: 32 },
    card: (color, disabled) => ({
      background: '#1a1a2e',
      border: `2px solid ${disabled ? '#2d2d4d' : color}`,
      borderRadius: 14,
      padding: '24px 20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      textAlign: 'center',
      transition: 'transform 0.1s, box-shadow 0.1s',
    }),
    cardEmoji: { fontSize: 36, marginBottom: 8 },
    cardTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4, color: '#e2e8f0' },
    cardDesc: { fontSize: 12, color: '#64748b', lineHeight: 1.5 },
    deck: {
      background: '#1a1a2e', border: '1px solid #2d2d4d', borderRadius: 10,
      padding: '12px 20px', maxWidth: 700, width: '100%', marginBottom: 20,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    deckLabel: { fontSize: 12, color: '#64748b' },
    deckCount: { fontSize: 14, fontWeight: 'bold', color: deckValid ? '#4ade80' : '#f87171' },
    resetBtn: { background: 'transparent', color: '#334155', border: 'none', fontSize: 11, cursor: 'pointer', marginTop: 12 },
    warningBox: {
      background: '#1c1010', border: '1px solid #7f1d1d', borderRadius: 8,
      padding: '10px 16px', maxWidth: 700, width: '100%', marginBottom: 16,
      fontSize: 12, color: '#fca5a5',
    },
  };

  return (
    <div style={s.root}>
      <h1 style={s.title}>Echoes of Chaos</h1>
      <p style={s.subtitle}>Build your deck. Face the void. Survive the waves.</p>
      <div style={s.coins}>💰 {coins} coins</div>

      <div style={s.deck}>
        <div>
          <div style={s.deckLabel}>Current Deck</div>
          <div style={s.deckCount}>{deckSize} / 10 cards {deckValid ? '✓ Ready' : `— need ${4 - deckSize} more`}</div>
        </div>
        <button
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}
          onClick={() => nav('deckbuilder')}
        >
          Edit Deck
        </button>
      </div>

      {!deckValid && (
        <div style={s.warningBox}>
          ⚠️ Your deck needs at least 4 cards to battle. Go to the Deck Builder to add cards.
        </div>
      )}

      <div style={s.grid}>
        <div style={s.card('#ef4444', !deckValid)} onClick={() => deckValid && startBattle()}>
          <div style={s.cardEmoji}>⚔️</div>
          <div style={s.cardTitle}>Battle</div>
          <div style={s.cardDesc}>Fight through 6 waves of enemies. Earn coins from every victory.</div>
        </div>

        <div style={s.card('#6366f1', false)} onClick={() => nav('collection')}>
          <div style={s.cardEmoji}>📚</div>
          <div style={s.cardTitle}>Collection</div>
          <div style={s.cardDesc}>{totalCards} cards owned. View and filter your full collection.</div>
        </div>

        <div style={s.card('#a855f7', false)} onClick={() => nav('deckbuilder')}>
          <div style={s.cardEmoji}>🃏</div>
          <div style={s.cardTitle}>Deck Builder</div>
          <div style={s.cardDesc}>Build your battle deck. Up to 10 cards, max 2 of each.</div>
        </div>

        <div style={s.card('#f59e0b', false)} onClick={() => nav('shop')}>
          <div style={s.cardEmoji}>🛒</div>
          <div style={s.cardTitle}>Card Shop</div>
          <div style={s.cardDesc}>Spend coins on card packs. 4 pack tiers — Starter to Eclipse.</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#1e293b', textAlign: 'center', maxWidth: 700, lineHeight: 1.6 }}>
        Tip: Cards level up as you play them — cheap cards played often can outgrow expensive ones you rarely use.
      </div>

      <button style={s.resetBtn} onClick={resetAll}>Reset all progress</button>
    </div>
  );
}
