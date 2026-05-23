import { useState } from 'react';
import { CARDS, RARITY_COLORS, RARITY_BORDER, MAX_DECK_SIZE, MIN_DECK_SIZE, MAX_COPIES_PER_CARD } from '../gameData';
import { deckCardCount } from '../utils';
import CardDisplay from '../components/CardDisplay';

const RARITIES = ['all', 'common', 'rare', 'epic', 'legendary'];
const TIERS = ['all', 1, 2, 3];

export default function Collection({ collection, deck, cardProgress, onDeckChange, onClose, activeTab: initialTab }) {
  const [tab, setTab] = useState(initialTab || 'collection');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [sortBy, setSortBy] = useState('rarity');

  const totalDeck = deckCardCount(deck);

  function addToDeck(cardId) {
    const inDeck = deck[cardId] || 0;
    const owned = collection[cardId] || 0;
    if (inDeck >= MAX_COPIES_PER_CARD) return;
    if (inDeck >= owned) return;
    if (totalDeck >= MAX_DECK_SIZE) return;
    onDeckChange({ ...deck, [cardId]: inDeck + 1 });
  }

  function removeFromDeck(cardId) {
    const inDeck = deck[cardId] || 0;
    if (inDeck <= 0) return;
    const newDeck = { ...deck, [cardId]: inDeck - 1 };
    if (newDeck[cardId] === 0) delete newDeck[cardId];
    onDeckChange(newDeck);
  }

  function clearDeck() {
    onDeckChange({});
  }

  let collectionCards = Object.entries(collection)
    .filter(([, count]) => count > 0)
    .map(([cardId, count]) => ({ cardId, count, card: CARDS[cardId] }))
    .filter(({ card }) => card);

  if (filterRarity !== 'all') collectionCards = collectionCards.filter(({ card }) => card.rarity === filterRarity);
  if (filterTier !== 'all') collectionCards = collectionCards.filter(({ card }) => card.tier === filterTier);

  collectionCards.sort((a, b) => {
    if (sortBy === 'rarity') {
      const order = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return order[a.card.rarity] - order[b.card.rarity];
    }
    if (sortBy === 'tier') return b.card.tier - a.card.tier;
    if (sortBy === 'cost') return a.card.cost - b.card.cost;
    if (sortBy === 'name') return a.card.name.localeCompare(b.card.name);
    return 0;
  });

  const deckCards = Object.entries(deck)
    .filter(([, count]) => count > 0)
    .map(([cardId, count]) => ({ cardId, count, card: CARDS[cardId] }))
    .filter(({ card }) => card);

  deckCards.sort((a, b) => a.card.cost - b.card.cost);

  const isValid = totalDeck >= MIN_DECK_SIZE;

  const s = {
    root: { fontFamily: "'Segoe UI', sans-serif", background: '#0d0d1a', color: '#e0e0f0', minHeight: '100vh', padding: 20 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#c084fc' },
    tabs: { display: 'flex', gap: 8, marginBottom: 16 },
    tab: (active) => ({
      background: active ? '#6366f1' : '#1a1a2e',
      border: `1px solid ${active ? '#6366f1' : '#2d2d4d'}`,
      color: active ? '#fff' : '#94a3b8',
      borderRadius: 8, padding: '7px 18px', fontSize: 13,
      cursor: 'pointer', fontWeight: active ? 'bold' : 'normal',
    }),
    filters: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' },
    filter: (active) => ({
      background: active ? '#1e2a3a' : 'transparent',
      border: `1px solid ${active ? '#6366f1' : '#2d2d4d'}`,
      color: active ? '#e2e8f0' : '#64748b',
      borderRadius: 6, padding: '4px 10px', fontSize: 11,
      cursor: 'pointer',
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10, marginBottom: 16 },
    deckStatus: {
      background: '#1a1a2e', border: `1px solid ${isValid ? '#166534' : '#7f1d1d'}`,
      borderRadius: 8, padding: '10px 16px', marginBottom: 14,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    deckCount: { fontSize: 14, color: isValid ? '#4ade80' : '#f87171', fontWeight: 'bold' },
    deckRule: { fontSize: 11, color: '#475569' },
    deckGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 },
    deckCardWrap: { position: 'relative' },
    removeBtn: {
      position: 'absolute', top: -6, right: -6,
      background: '#7f1d1d', border: '1px solid #ef4444',
      borderRadius: '50%', width: 20, height: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 12, color: '#fca5a5', zIndex: 2,
    },
    addBtn: (canAdd) => ({
      position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
      background: canAdd ? '#14532d' : '#1e293b',
      border: `1px solid ${canAdd ? '#22c55e' : '#334155'}`,
      borderRadius: 6, padding: '2px 10px', fontSize: 10,
      color: canAdd ? '#4ade80' : '#475569',
      cursor: canAdd ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', zIndex: 2,
    }),
    emptyMsg: { color: '#475569', fontSize: 13, padding: '24px 0', textAlign: 'center' },
    backBtn: { background: 'transparent', color: '#64748b', border: '1px solid #2d2d4d', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' },
    clearBtn: { background: 'transparent', color: '#64748b', border: '1px solid #2d2d4d', borderRadius: 6, padding: '5px 12px', fontSize: 11, cursor: 'pointer' },
    sortLabel: { fontSize: 11, color: '#475569', marginRight: 4 },
    select: { background: '#1a1a2e', border: '1px solid #2d2d4d', color: '#94a3b8', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer' },
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.title}>{tab === 'collection' ? 'Card Collection' : 'Deck Builder'}</div>
        <button style={s.backBtn} onClick={onClose}>← Back</button>
      </div>

      <div style={s.tabs}>
        <button style={s.tab(tab === 'collection')} onClick={() => setTab('collection')}>
          📚 Collection ({Object.values(collection).reduce((a, b) => a + b, 0)} cards)
        </button>
        <button style={s.tab(tab === 'deck')} onClick={() => setTab('deck')}>
          🃏 Deck Builder ({totalDeck}/{MAX_DECK_SIZE})
        </button>
      </div>

      {tab === 'collection' && (
        <>
          <div style={s.filters}>
            <span style={s.sortLabel}>Filter:</span>
            {RARITIES.map(r => (
              <button key={r} style={s.filter(filterRarity === r)} onClick={() => setFilterRarity(r)}>
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
            <span style={{ width: 8 }} />
            {TIERS.map(t => (
              <button key={t} style={s.filter(filterTier === t)} onClick={() => setFilterTier(t)}>
                {t === 'all' ? 'All Tiers' : `Tier ${t}`}
              </button>
            ))}
            <span style={s.sortLabel}>Sort:</span>
            <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rarity">Rarity</option>
              <option value="tier">Tier</option>
              <option value="cost">Cost</option>
              <option value="name">Name</option>
            </select>
          </div>

          {collectionCards.length === 0 ? (
            <div style={s.emptyMsg}>No cards match this filter.</div>
          ) : (
            <div style={s.grid}>
              {collectionCards.map(({ cardId, count }) => {
                const inDeck = deck[cardId] || 0;
                const canAdd = inDeck < MAX_COPIES_PER_CARD && inDeck < count && totalDeck < MAX_DECK_SIZE;
                return (
                  <div key={cardId} style={{ position: 'relative', paddingBottom: 22 }}>
                    <CardDisplay
                      cardId={cardId}
                      cardProgress={cardProgress}
                      count={count}
                      inDeck={inDeck}
                      showProgress
                      disabled={false}
                    />
                    <button style={s.addBtn(canAdd)} onClick={() => canAdd && addToDeck(cardId)}>
                      {inDeck >= MAX_COPIES_PER_CARD ? 'Max copies' : inDeck >= count ? 'All in deck' : totalDeck >= MAX_DECK_SIZE ? 'Deck full' : `+ Add to Deck`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'deck' && (
        <>
          <div style={s.deckStatus}>
            <div>
              <div style={s.deckCount}>{totalDeck} / {MAX_DECK_SIZE} cards</div>
              <div style={s.deckRule}>
                {isValid ? '✓ Valid deck — ready to battle' : `Need at least ${MIN_DECK_SIZE} cards`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={s.clearBtn} onClick={clearDeck}>Clear Deck</button>
            </div>
          </div>

          {deckCards.length === 0 ? (
            <div style={s.emptyMsg}>
              Your deck is empty. Go to Collection and add cards.
            </div>
          ) : (
            <div style={s.deckGrid}>
              {deckCards.map(({ cardId, count }) => (
                <div key={cardId} style={s.deckCardWrap}>
                  {Array.from({ length: count }, (_, ci) => (
                    <div key={ci} style={{ marginBottom: ci < count - 1 ? 4 : 0 }}>
                      <CardDisplay
                        cardId={cardId}
                        cardProgress={cardProgress}
                        disabled={false}
                        compact={ci > 0}
                      />
                    </div>
                  ))}
                  <button style={s.removeBtn} onClick={() => removeFromDeck(cardId)}>−</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16, fontSize: 11, color: '#475569' }}>
            Max {MAX_COPIES_PER_CARD} copies of any card. Min {MIN_DECK_SIZE} cards to battle. Click − to remove a copy.
          </div>
        </>
      )}
    </div>
  );
}
