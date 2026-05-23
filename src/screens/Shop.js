import { useState } from 'react';
import { PACKS, PACK_SIZE, CARDS, RARITY_COLORS } from '../gameData';
import { sampleCards } from '../utils';
import CardDisplay from '../components/CardDisplay';

export default function Shop({ coins, collection, cardProgress, onBuyPack, onClose }) {
  const [openedPack, setOpenedPack] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [revealing, setRevealing] = useState(false);

  function buyPack(pack) {
    if (coins < pack.cost) return;
    const cards = sampleCards(CARDS, pack.tierFilter, pack.rarityWeights, PACK_SIZE);
    setOpenedPack({ packId: pack.id, packName: pack.name, cards, color: pack.color });
    setRevealIndex(0);

    let idx = 0;
    setRevealing(true);
    const interval = setInterval(() => {
      idx++;
      setRevealIndex(idx);
      if (idx >= cards.length) {
        clearInterval(interval);
        setRevealing(false);
      }
    }, 320);

    onBuyPack(pack.id, cards, pack.cost);
  }

  function closePack() {
    setOpenedPack(null);
    setRevealIndex(0);
  }

  const s = {
    root: { fontFamily: "'Segoe UI', sans-serif", background: '#0d0d1a', color: '#e0e0f0', minHeight: '100vh', padding: 20 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#c084fc' },
    coins: { fontSize: 16, color: '#f59e0b', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 },
    packCard: (affordable, color) => ({
      background: '#1a1a2e',
      border: `2px solid ${affordable ? color : '#2d2d4d'}`,
      borderRadius: 12,
      padding: '20px 18px',
      cursor: affordable ? 'pointer' : 'not-allowed',
      opacity: affordable ? 1 : 0.5,
      transition: 'transform 0.1s, box-shadow 0.1s',
    }),
    packEmoji: { fontSize: 36, marginBottom: 8 },
    packName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    packDesc: { fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 1.5 },
    packCost: (affordable, color) => ({
      fontWeight: 'bold', fontSize: 15,
      color: affordable ? color : '#64748b',
    }),
    packSize: { fontSize: 11, color: '#475569', marginTop: 4 },
    rarityRow: { display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 },
    rarityChip: (rarity) => ({
      fontSize: 9, fontWeight: 'bold', padding: '2px 6px',
      borderRadius: 4, background: RARITY_COLORS[rarity] + '22',
      border: `1px solid ${RARITY_COLORS[rarity]}`,
      color: RARITY_COLORS[rarity], textTransform: 'uppercase',
    }),
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: 20,
    },
    packTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: '#c084fc' },
    packSubtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
    revealGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 10, maxWidth: 700, width: '100%', marginBottom: 20 },
    cardSlot: (visible) => ({
      background: visible ? 'transparent' : '#0a0a18',
      border: `2px solid ${visible ? 'transparent' : '#1e2a3a'}`,
      borderRadius: 10,
      minHeight: 140,
      transition: 'all 0.3s',
      overflow: 'hidden',
    }),
    doneBtn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' },
    backBtn: { background: 'transparent', color: '#64748b', border: '1px solid #2d2d4d', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' },
  };

  if (openedPack) {
    return (
      <div style={s.overlay}>
        <div style={s.packTitle}>{openedPack.packName}</div>
        <div style={s.packSubtitle}>{PACK_SIZE} new cards</div>
        <div style={s.revealGrid}>
          {openedPack.cards.map((cardId, i) => (
            <div key={i} style={s.cardSlot(i < revealIndex)}>
              {i < revealIndex && (
                <CardDisplay cardId={cardId} cardProgress={cardProgress} disabled={false} compact={false} />
              )}
            </div>
          ))}
        </div>
        <button style={s.doneBtn} onClick={closePack} disabled={revealing}>
          {revealing ? 'Opening...' : 'Add to Collection'}
        </button>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.title}>Card Shop</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={s.coins}>💰 {coins} coins</div>
          <button style={s.backBtn} onClick={onClose}>← Back</button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        Buy packs to expand your collection. Each pack contains {PACK_SIZE} cards.
      </div>

      <div style={s.grid}>
        {PACKS.map(pack => {
          const affordable = coins >= pack.cost;
          const weights = pack.rarityWeights;
          const activeRarities = Object.entries(weights).filter(([, w]) => w > 0).map(([r]) => r);
          return (
            <div
              key={pack.id}
              style={s.packCard(affordable, pack.color)}
              onClick={() => affordable && buyPack(pack)}
            >
              <div style={s.packEmoji}>{pack.emoji}</div>
              <div style={s.packName}>{pack.name}</div>
              <div style={s.packDesc}>{pack.description}</div>
              <div style={s.rarityRow}>
                {activeRarities.map(r => (
                  <span key={r} style={s.rarityChip(r)}>{r} {weights[r]}%</span>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <span style={s.packCost(affordable, pack.color)}>💰 {pack.cost} coins</span>
                <div style={s.packSize}>{PACK_SIZE} cards per pack</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, color: '#475569' }}>
        Coins are earned by defeating enemies in battle. Stronger waves reward more coins.
      </div>
    </div>
  );
}
