import { useState } from 'react';
import { PACKS, PACK_SIZE, RARITY_STARS } from '../gameData';
import { sampleCards } from '../utils';
import CardDisplay from '../components/CardDisplay';

const C = { bg: '#080808', panel: '#0f0f0f', border: '#1e1a10', orange: '#F26522', amber: '#F5A623', text: '#EDE0CC', muted: '#5A4A36' };

export default function Shop({ coins, onBuyPack, onClose }) {
  const [opened, setOpened] = useState(null);
  const [revealIdx, setRevealIdx] = useState(0);
  const [revealing, setRevealing] = useState(false);

  function buyPack(pack) {
    if (coins < pack.cost) return;
    const cards = sampleCards(pack.tierFilter, pack.rarityWeights, PACK_SIZE);
    onBuyPack(pack.id, cards, pack.cost);
    setOpened({ packName: pack.name, cards, color: pack.color, emoji: pack.emoji });
    setRevealIdx(0);
    setRevealing(true);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setRevealIdx(i);
      if (i >= cards.length) { clearInterval(iv); setRevealing(false); }
    }, 380);
  }

  if (opened) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Scanner — Pack Opening</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: C.orange, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 2 }}>{opened.packName}</div>
        <div style={{ width: 60, height: 2, background: C.orange, boxShadow: `0 0 8px ${C.orange}`, margin: '8px auto 20px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 760, marginBottom: 24 }}>
          {opened.cards.map((cardId, i) => (
            <div key={i} style={{ opacity: i < revealIdx ? 1 : 0.08, transform: i < revealIdx ? 'scale(1)' : 'scale(0.85)', transition: 'opacity 0.4s, transform 0.4s' }}>
              {i < revealIdx ? <CardDisplay cardId={cardId} /> : <CardDisplay cardId={cardId} faceDown />}
            </div>
          ))}
        </div>
        <button onClick={() => setOpened(null)} disabled={revealing} style={{ background: revealing ? '#1a1a1a' : C.orange, color: revealing ? C.muted : '#000', border: 'none', borderRadius: 6, padding: '10px 36px', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, cursor: revealing ? 'not-allowed' : 'pointer' }}>
          {revealing ? 'Scanning...' : 'Done'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <div style={{ background: '#0c0800', borderBottom: `2px solid ${C.orange}`, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>Chaotic</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: C.orange, textTransform: 'uppercase', letterSpacing: 2 }}>⚡ Scanner Shop</div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 16, color: C.amber, fontWeight: 'bold' }}>💰 {coins}</div>
          <button style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }} onClick={onClose}>← Back</button>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 20 }}>Scan packs to unlock creatures, Battlegear, and energy. Each pack contains {PACK_SIZE} cards.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
          {PACKS.map(pack => {
            const canBuy = coins >= pack.cost;
            const active = Object.entries(pack.rarityWeights).filter(([, w]) => w > 0);
            return (
              <div key={pack.id} onClick={() => canBuy && buyPack(pack)} style={{
                background: C.panel, borderRadius: 10, overflow: 'hidden',
                border: `2px solid ${canBuy ? pack.color : '#1a1410'}`,
                boxShadow: canBuy ? `0 0 12px ${pack.color}33` : 'none',
                cursor: canBuy ? 'pointer' : 'not-allowed', opacity: canBuy ? 1 : 0.5,
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{ background: canBuy ? pack.color + '33' : '#111', padding: '14px 16px', borderBottom: `1px solid ${pack.color}44` }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{pack.emoji}</div>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: canBuy ? pack.color : C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{pack.name}</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginBottom: 10 }}>{pack.description}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {active.map(([r, w]) => (
                      <span key={r} style={{ fontSize: 8, padding: '2px 6px', borderRadius: 3, background: '#1a1410', color: C.amber, border: `1px solid ${C.border}`, textTransform: 'uppercase' }}>
                        {r} {w}%
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 'bold', color: canBuy ? C.amber : C.muted }}>💰 {pack.cost}</span>
                    <span style={{ fontSize: 10, color: C.muted }}>{PACK_SIZE} cards</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
