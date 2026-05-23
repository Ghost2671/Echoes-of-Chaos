import { useState } from 'react';
import { CARDS, MAX_DECK_SIZE, MIN_DECK_SIZE, MAX_COPIES, RARITY_STARS } from '../gameData';
import { deckCardCount } from '../utils';
import CardDisplay from '../components/CardDisplay';
import { TRIBE } from '../components/CardDisplay';

const CARD_TYPES = ['all', 'creature', 'energy', 'trainer'];
const TYPES = ['all', 'shadow', 'void', 'chaos', 'iron'];

const C = {
  bg: '#080808', panel: '#0f0f0f', border: '#1e1a10',
  orange: '#F26522', amber: '#F5A623', text: '#EDE0CC', muted: '#5A4A36',
};

export default function Collection({ collection, deck, onDeckChange, onClose, activeTab: initialTab = 'collection' }) {
  const [tab, setTab] = useState(initialTab);
  const [cardTypeFilter, setCardTypeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');

  const totalDeck = deckCardCount(deck);
  const deckCreatures = Object.entries(deck).filter(([id, n]) => n > 0 && CARDS[id]?.cardType === 'creature').reduce((s, [, n]) => s + n, 0);
  const deckValid = totalDeck >= MIN_DECK_SIZE && totalDeck <= MAX_DECK_SIZE && deckCreatures >= 2;

  function addToDeck(cardId) {
    if ((deck[cardId] || 0) >= MAX_COPIES) return;
    if ((deck[cardId] || 0) >= (collection[cardId] || 0)) return;
    if (totalDeck >= MAX_DECK_SIZE) return;
    onDeckChange({ ...deck, [cardId]: (deck[cardId] || 0) + 1 });
  }
  function removeFromDeck(cardId) {
    if ((deck[cardId] || 0) <= 0) return;
    const n = { ...deck, [cardId]: deck[cardId] - 1 };
    if (n[cardId] === 0) delete n[cardId];
    onDeckChange(n);
  }
  function clearDeck() { onDeckChange({}); }

  const allOwned = Object.keys(collection).filter(id => (collection[id] || 0) > 0 && CARDS[id]);
  const filtered = allOwned.filter(id => {
    const c = CARDS[id];
    if (!c) return false;
    if (cardTypeFilter !== 'all' && c.cardType !== cardTypeFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter && c.energyType !== typeFilter) return false;
    if (rarityFilter !== 'all' && c.rarity !== rarityFilter) return false;
    return true;
  }).sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return (order[CARDS[a].rarity] ?? 5) - (order[CARDS[b].rarity] ?? 5);
  });

  const deckEntries = Object.entries(deck).filter(([id, n]) => n > 0 && CARDS[id]);

  const s = {
    root: { fontFamily: "'Segoe UI', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { background: '#0c0800', borderBottom: `2px solid ${C.orange}`, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
    title: { fontSize: 16, fontWeight: 'bold', color: C.orange, textTransform: 'uppercase', letterSpacing: 2 },
    tabs: { display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, flexShrink: 0 },
    tab: (active) => ({ padding: '10px 20px', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer', color: active ? C.orange : C.muted, borderBottom: active ? `2px solid ${C.orange}` : '2px solid transparent', background: 'transparent', border: 'none', transition: 'color 0.2s' }),
    filters: { display: 'flex', gap: 8, padding: '10px 16px', background: C.panel, flexWrap: 'wrap', flexShrink: 0, borderBottom: `1px solid ${C.border}` },
    filterBtn: (active, color) => ({ fontSize: 10, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', border: `1px solid ${active ? (color || C.orange) : '#2a1a0a'}`, background: active ? (color || C.orange) + '22' : 'transparent', color: active ? (color || C.amber) : C.muted, fontWeight: active ? 'bold' : 'normal', textTransform: 'uppercase', letterSpacing: 0.5 }),
    grid: { display: 'flex', flexWrap: 'wrap', gap: 10, padding: 16, overflowY: 'auto', flex: 1 },
    cardWrap: { position: 'relative' },
    badge: { position: 'absolute', top: -4, right: -4, background: C.orange, color: '#000', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 'bold', zIndex: 1 },
    deckPanel: { display: 'flex', flexDirection: 'column', padding: 16, overflowY: 'auto', flex: 1 },
    deckStats: { background: C.panel, border: `1px solid ${deckValid ? C.orange : '#5a1a1a'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12 },
    deckRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    deckEntryRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#0f0f0f', borderRadius: 6, marginBottom: 4, border: '1px solid #1a1410' },
    qtyBtn: (c) => ({ background: c, border: 'none', color: '#fff', width: 20, height: 20, borderRadius: 4, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
    backBtn: { background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 11, cursor: 'pointer' },
    clearBtn: { background: 'transparent', color: '#5a1a1a', border: '1px solid #3a1010', borderRadius: 6, padding: '6px 14px', fontSize: 11, cursor: 'pointer' },
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.title}>⚡ Chaotic — {tab === 'collection' ? 'Scanner Archive' : 'Battle Deck'}</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: C.muted }}>{Object.values(collection).reduce((a, b) => a + b, 0)} cards owned</span>
          <button style={s.backBtn} onClick={onClose}>← Back</button>
        </div>
      </div>

      <div style={s.tabs}>
        <button style={s.tab(tab === 'collection')} onClick={() => setTab('collection')}>📚 Collection</button>
        <button style={s.tab(tab === 'deck')} onClick={() => setTab('deck')}>🃏 Battle Deck ({totalDeck}/{MAX_DECK_SIZE})</button>
      </div>

      {tab === 'collection' && (
        <>
          <div style={s.filters}>
            <div style={{ display: 'flex', gap: 4 }}>
              {CARD_TYPES.map(t => <button key={t} style={s.filterBtn(cardTypeFilter === t)} onClick={() => setCardTypeFilter(t)}>{t}</button>)}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {TYPES.map(t => <button key={t} style={s.filterBtn(typeFilter === t, TRIBE[t]?.primary)} onClick={() => setTypeFilter(t)}>{t}</button>)}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all','common','uncommon','rare','epic','legendary'].map(r => <button key={r} style={s.filterBtn(rarityFilter === r)} onClick={() => setRarityFilter(r)}>{r}</button>)}
            </div>
          </div>
          <div style={s.grid}>
            {filtered.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No cards match your filters.</div>}
            {filtered.map(id => {
              const owned = collection[id] || 0;
              const inDeck = deck[id] || 0;
              const canAdd = inDeck < MAX_COPIES && inDeck < owned && totalDeck < MAX_DECK_SIZE;
              return (
                <div key={id} style={s.cardWrap} onClick={() => canAdd && addToDeck(id)}>
                  <CardDisplay cardId={id} compact={false} disabled={!canAdd} />
                  <div style={s.badge}>×{owned}</div>
                  {inDeck > 0 && (
                    <div style={{ ...s.badge, top: 14, right: -4, background: '#22c55e' }}>{inDeck}✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'deck' && (
        <div style={s.deckPanel}>
          <div style={s.deckStats}>
            <div style={s.deckRow}>
              <span style={{ fontSize: 12, fontWeight: 'bold', color: C.amber, textTransform: 'uppercase', letterSpacing: 1 }}>Deck Status</span>
              <span style={{ fontSize: 11, color: deckValid ? '#22c55e' : '#f87171', fontWeight: 'bold' }}>
                {deckValid ? '✓ READY' : '✗ INVALID'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <span style={{ fontSize: 11, color: C.muted }}>Total: <b style={{ color: C.text }}>{totalDeck}</b>/{MAX_DECK_SIZE}</span>
              <span style={{ fontSize: 11, color: C.muted }}>Creatures: <b style={{ color: deckCreatures >= 2 ? '#22c55e' : '#f87171' }}>{deckCreatures}</b> (min 2)</span>
              <span style={{ fontSize: 11, color: C.muted }}>Min total: <b style={{ color: totalDeck >= MIN_DECK_SIZE ? '#22c55e' : '#f87171' }}>{MIN_DECK_SIZE}</b></span>
            </div>
            {!deckValid && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>
                {deckCreatures < 2 && '⚠ Need at least 2 creature cards. '}
                {totalDeck < MIN_DECK_SIZE && `⚠ Need ${MIN_DECK_SIZE - totalDeck} more cards. `}
                {totalDeck > MAX_DECK_SIZE && '⚠ Too many cards. '}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Deck Contents</span>
            <button style={s.clearBtn} onClick={clearDeck}>Clear All</button>
          </div>

          {deckEntries.length === 0 && (
            <div style={{ color: C.muted, fontSize: 12, padding: '20px 0' }}>
              Your deck is empty. Go to Collection and click cards to add them.
            </div>
          )}

          {deckEntries.map(([id, count]) => {
            const card = CARDS[id];
            if (!card) return null;
            const tribe = card.type ? (TRIBE[card.type] || {}) : {};
            return (
              <div key={id} style={s.deckEntryRow}>
                <div style={{ width: 6, height: 28, borderRadius: 2, background: tribe.primary || '#F26522', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: C.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{card.name}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>
                    {card.cardType === 'creature' ? `${tribe.name || card.type} · HP ${card.hp}` : card.cardType === 'energy' ? `${tribe.name || card.energyType} Energy` : `Trainer — ${card.trainerType}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <button style={s.qtyBtn('#3a1a1a')} onClick={() => removeFromDeck(id)}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: C.amber, minWidth: 16, textAlign: 'center' }}>×{count}</span>
                  <button style={s.qtyBtn('#1a3a1a')} onClick={() => addToDeck(id)} disabled={(deck[id] || 0) >= Math.min(MAX_COPIES, collection[id] || 0) || totalDeck >= MAX_DECK_SIZE}>+</button>
                </div>
                <div style={{ fontSize: 9, color: TRIBE[card.rarity]?.primary || C.muted }}>{RARITY_STARS[card.rarity]}</div>
              </div>
            );
          })}

          {/* Quick-add from collection */}
          <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Quick-Add from Collection</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.keys(collection).filter(id => (collection[id] || 0) > 0 && CARDS[id]).map(id => {
                const owned = collection[id] || 0;
                const inDeck = deck[id] || 0;
                const canAdd = inDeck < MAX_COPIES && inDeck < owned && totalDeck < MAX_DECK_SIZE;
                const card = CARDS[id];
                const tribeColor = TRIBE[card?.type || card?.energyType]?.primary || '#444';
                return (
                  <button key={id} onClick={() => canAdd && addToDeck(id)} disabled={!canAdd} style={{
                    fontSize: 9, padding: '3px 8px', borderRadius: 4, cursor: canAdd ? 'pointer' : 'not-allowed',
                    border: `1px solid ${canAdd ? tribeColor : '#2a1a0a'}`, background: canAdd ? tribeColor + '22' : 'transparent',
                    color: canAdd ? '#EDE0CC' : '#3a2a1a', textTransform: 'uppercase', letterSpacing: 0.4,
                  }}>
                    {card?.name} ({inDeck}/{Math.min(MAX_COPIES, owned)})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
