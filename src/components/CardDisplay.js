import { CARDS, RARITY_COLORS, RARITY_BG, RARITY_BORDER, TIER_LABELS, TIER_COLORS, TYPE_ICONS } from '../gameData';
import { cardEffectivePower } from '../utils';

const LEVEL_UP_USES = 5;

export default function CardDisplay({
  cardId,
  cardProgress = {},
  onClick,
  disabled = false,
  selected = false,
  compact = false,
  showProgress = false,
  count,
  inDeck,
}) {
  const card = CARDS[cardId];
  if (!card) return null;

  const prog = cardProgress[cardId] || { level: 1, uses: 0 };
  const eff = cardEffectivePower(card, cardProgress);
  const usesToNext = LEVEL_UP_USES - (prog.uses % LEVEL_UP_USES);

  const borderColor = selected ? '#fff' : RARITY_BORDER[card.rarity];
  const bgColor = RARITY_BG[card.rarity];
  const rarityColor = RARITY_COLORS[card.rarity];

  const s = {
    card: {
      background: disabled && !selected ? '#0e0e1c' : bgColor,
      border: `2px solid ${disabled && !selected ? '#2d2d4d' : borderColor}`,
      borderRadius: 10,
      padding: compact ? '8px 10px' : '12px 14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled && !selected ? 0.45 : 1,
      transition: 'transform 0.12s, box-shadow 0.12s',
      position: 'relative',
      userSelect: 'none',
      boxShadow: selected ? `0 0 12px ${borderColor}` : 'none',
    },
    rarity: {
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: rarityColor,
      marginBottom: 2,
    },
    name: {
      fontWeight: 'bold',
      fontSize: compact ? 12 : 13,
      color: '#e2e8f0',
      marginBottom: compact ? 2 : 4,
      lineHeight: 1.2,
    },
    stat: { fontSize: 11, color: '#94a3b8', marginBottom: 1 },
    desc: { fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.4 },
    costRow: { display: 'flex', alignItems: 'center', gap: 2, marginTop: compact ? 4 : 6 },
    dot: (filled) => ({
      width: 8, height: 8, borderRadius: '50%',
      background: filled ? '#6366f1' : '#2d2d4d',
      display: 'inline-block',
    }),
    tier: {
      fontSize: 9, color: TIER_COLORS[card.tier],
      textTransform: 'uppercase', letterSpacing: 1,
    },
    badge: {
      position: 'absolute', top: 6, right: 8,
      fontSize: 9, fontWeight: 'bold', color: '#f59e0b',
    },
    countBadge: {
      position: 'absolute', top: 6, right: 8,
      background: '#1e293b', border: '1px solid #334155',
      borderRadius: 4, padding: '1px 5px',
      fontSize: 10, color: '#94a3b8',
    },
    inDeckBadge: {
      position: 'absolute', bottom: 6, right: 8,
      background: '#1e3a2a', border: '1px solid #166534',
      borderRadius: 4, padding: '1px 5px',
      fontSize: 9, color: '#4ade80',
    },
  };

  function getStatLine() {
    switch (card.type) {
      case 'attack':  return `${TYPE_ICONS.attack} ${eff.value} dmg`;
      case 'defense': return `${TYPE_ICONS.defense} +${eff.value} shield`;
      case 'burn':    return `${TYPE_ICONS.burn} ${eff.value} burn × ${card.turns}t`;
      case 'double':  return `${TYPE_ICONS.double} ${eff.value}×2 dmg`;
      case 'drain':   return `${TYPE_ICONS.drain} ${eff.damage} dmg / +${eff.heal} HP`;
      case 'surge':   return `${TYPE_ICONS.surge} ${eff.value} dmg +${card.energy}⚡`;
      case 'stun':    return `${TYPE_ICONS.stun} Stun + ${eff.value} dmg`;
      case 'heal':    return `${TYPE_ICONS.heal} +${eff.value} HP`;
      case 'draw':    return `${TYPE_ICONS.draw} ${eff.value} dmg +${card.draw} cards`;
      case 'combo':   return `${TYPE_ICONS.combo} ${eff.bonus} dmg + ${eff.value} burn×${card.turns}t`;
      default: return '';
    }
  }

  return (
    <div style={s.card} onClick={!disabled ? onClick : undefined}>
      {prog.level > 1 && <span style={s.badge}>Lv{prog.level}</span>}
      {count != null && !inDeck && <span style={s.countBadge}>×{count}</span>}
      {inDeck != null && inDeck > 0 && <span style={s.inDeckBadge}>In deck ×{inDeck}</span>}
      <div style={s.tier}>{TIER_LABELS[card.tier]}</div>
      <div style={s.rarity}>{card.rarity}</div>
      <div style={s.name}>{card.name}</div>
      {!compact && <div style={s.stat}>{getStatLine()}</div>}
      {compact && <div style={{ fontSize: 11, color: '#94a3b8' }}>{getStatLine()}</div>}
      {!compact && <div style={s.desc}>{card.description}</div>}
      {showProgress && prog.level < 5 && (
        <div style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>
          {usesToNext} use{usesToNext !== 1 ? 's' : ''} to Lv{prog.level + 1}
        </div>
      )}
      <div style={s.costRow}>
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} style={s.dot(i < card.cost)} />
        ))}
        <span style={{ fontSize: 10, color: '#6366f1', marginLeft: 4 }}>{card.cost} energy</span>
      </div>
    </div>
  );
}
