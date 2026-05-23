import { CARDS, RARITY_STARS } from '../gameData';

export const TRIBE = {
  shadow: { name: 'Underworld',   primary: '#CC2200', dark: '#140305', glow: 'rgba(204,34,0,0.25)',   icon: '🔥' },
  void:   { name: "M'arrillian",  primary: '#009999', dark: '#021212', glow: 'rgba(0,153,153,0.25)',  icon: '🌊' },
  chaos:  { name: 'Mipedian',     primary: '#C89010', dark: '#130e00', glow: 'rgba(200,144,16,0.25)', icon: '🌪️' },
  iron:   { name: 'Overworld',    primary: '#3A80C9', dark: '#030a18', glow: 'rgba(58,128,201,0.25)', icon: '⚡' },
  rainbow:{ name: 'Rainbow',      primary: '#9c3fbf', dark: '#0d0412', glow: 'rgba(156,63,191,0.25)', icon: '🌈' },
};

const RARITY_COLOR = { common: '#7a7a8a', uncommon: '#3db87a', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };

function EnergyDot({ type, size = 10 }) {
  const t = TRIBE[type] || TRIBE.rainbow;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: t.primary, border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: `0 0 4px ${t.primary}88`, flexShrink: 0,
    }} title={t.name} />
  );
}

function HpBar({ current, max, color, compact }) {
  const pct = Math.max(0, current / max);
  const barColor = pct > 0.5 ? color : pct > 0.25 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ background: '#111', borderRadius: 3, height: compact ? 4 : 6, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.3s' }} />
    </div>
  );
}

export default function CardDisplay({
  cardId, compact = false, selected = false, faceDown = false,
  onClick, disabled = false, attached = [],
  showHpBar = false, currentHp = null, maxHp = null,
}) {
  const card = CARDS[cardId];

  if (faceDown || !card) {
    const W = compact ? 72 : 120;
    const H = compact ? 98 : 168;
    return (
      <div onClick={onClick} style={{
        width: W, minHeight: H, background: 'linear-gradient(145deg,#1a0d00,#0a0500)',
        border: '2px solid #F26522', borderRadius: 8, cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 0 8px rgba(242,101,34,0.4)',
      }}>
        <span style={{ fontSize: compact ? 18 : 28, opacity: 0.6 }}>🌀</span>
      </div>
    );
  }

  const tribe = TRIBE[card.type || card.energyType] || TRIBE.shadow;
  const W = compact ? 80 : 138;
  const rColor = RARITY_COLOR[card.rarity] || '#7a7a8a';

  const base = {
    width: W, flexShrink: 0, borderRadius: 8, overflow: 'hidden',
    border: `2px solid ${selected ? '#fff' : tribe.primary}`,
    boxShadow: selected ? `0 0 16px ${tribe.primary}` : `0 0 6px ${tribe.primary}44`,
    cursor: (onClick && !disabled) ? 'pointer' : disabled ? 'not-allowed' : 'default',
    opacity: disabled ? 0.45 : 1,
    fontFamily: "'Segoe UI', sans-serif",
    background: tribe.dark,
  };

  // ── ENERGY CARD ──────────────────────────────────────────────────────
  if (card.cardType === 'energy') {
    return (
      <div style={base} onClick={(!disabled && onClick) ? onClick : undefined}>
        <div style={{ background: tribe.primary, padding: compact ? '2px 5px' : '3px 7px' }}>
          <span style={{ fontSize: compact ? 7 : 8, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
            ⚡ BASIC ENERGY
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: compact ? '8px 4px' : '14px 6px', gap: 4 }}>
          <span style={{ fontSize: compact ? 22 : 34 }}>{tribe.icon}</span>
          <span style={{ fontSize: compact ? 7 : 10, color: tribe.primary, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>{tribe.name}</span>
          {!compact && <span style={{ fontSize: 8, color: '#5a4a36' }}>{RARITY_STARS[card.rarity]}</span>}
        </div>
      </div>
    );
  }

  // ── TRAINER CARD ─────────────────────────────────────────────────────
  if (card.cardType === 'trainer') {
    const headerBg = card.trainerType === 'supporter' ? '#6B2F00' : card.trainerType === 'stadium' ? '#004422' : '#3D2800';
    const label = card.trainerType === 'supporter' ? 'BATTLEGEAR — SUPPORT' : card.trainerType === 'stadium' ? 'LOCATION' : 'BATTLEGEAR';
    return (
      <div style={{ ...base, background: '#0e0900' }} onClick={(!disabled && onClick) ? onClick : undefined}>
        <div style={{ background: headerBg, padding: compact ? '2px 5px' : '3px 7px' }}>
          <span style={{ fontSize: compact ? 6 : 7, color: '#F5A623', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
        </div>
        <div style={{ padding: compact ? '4px' : '6px 7px' }}>
          <div style={{ fontSize: compact ? 8 : 10, fontWeight: 'bold', color: '#F5A623', textTransform: 'uppercase', marginBottom: compact ? 2 : 4 }}>{card.name}</div>
          {!compact && (
            <>
              <div style={{ fontSize: 20, textAlign: 'center', margin: '4px 0' }}>
                {card.trainerType === 'supporter' ? '🧙' : card.trainerType === 'stadium' ? '🏟️' : '🔮'}
              </div>
              <div style={{ height: 1, background: '#F5A62322', margin: '4px 0' }} />
              <div style={{ fontSize: 8, color: '#8a7a60', lineHeight: 1.4 }}>{card.description}</div>
            </>
          )}
        </div>
        <div style={{ padding: compact ? '2px 5px' : '3px 7px', borderTop: `1px solid ${headerBg}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 7, color: '#3a2a10' }}>{card.trainerType}</span>
          <span style={{ fontSize: 7, color: rColor }}>{RARITY_STARS[card.rarity]}</span>
        </div>
      </div>
    );
  }

  // ── CREATURE CARD ─────────────────────────────────────────────────────
  const hp = showHpBar && currentHp !== null ? currentHp : card.hp;
  const mhp = showHpBar && maxHp !== null ? maxHp : card.hp;

  return (
    <div style={base} onClick={(!disabled && onClick) ? onClick : undefined}>
      {/* Outer tribe bar */}
      <div style={{ height: compact ? 3 : 4, background: tribe.primary, boxShadow: `0 0 6px ${tribe.primary}` }} />
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.6)', padding: compact ? '2px 5px' : '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: compact ? 6 : 7, color: tribe.primary, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {tribe.icon} {tribe.name}
        </span>
        <span style={{ fontSize: compact ? 8 : 9, color: '#EDE0CC', fontWeight: 'bold' }}>
          ⚡{hp}
        </span>
      </div>
      {/* Name */}
      <div style={{ padding: compact ? '2px 5px' : '3px 8px', fontSize: compact ? 8 : 10, fontWeight: 'bold', color: '#EDE0CC', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.2 }}>
        {card.name}
      </div>
      {/* HP bar */}
      {showHpBar && (
        <div style={{ padding: '0 5px 3px', display: 'flex', gap: 4, alignItems: 'center' }}>
          <HpBar current={currentHp} max={maxHp} color={tribe.primary} compact={compact} />
          <span style={{ fontSize: 7, color: '#5a4a36', whiteSpace: 'nowrap' }}>{currentHp}/{maxHp}</span>
        </div>
      )}
      {/* Art */}
      {!compact && (
        <div style={{ textAlign: 'center', fontSize: 30, padding: '4px 0', background: `linear-gradient(180deg, transparent, ${tribe.primary}22, transparent)` }}>
          {tribe.icon}
        </div>
      )}
      {/* Divider */}
      <div style={{ height: 1, background: tribe.primary + '44', margin: compact ? '1px 4px' : '2px 6px' }} />
      {/* Attacks */}
      <div style={{ padding: compact ? '2px 5px' : '3px 8px' }}>
        {card.attacks.map((atk, i) => (
          <div key={i} style={{ marginBottom: compact ? 1 : 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                {atk.cost.map((t, ci) => <EnergyDot key={ci} type={t === 'any' ? 'rainbow' : t} size={compact ? 6 : 8} />)}
                <span style={{ fontSize: compact ? 6 : 8, color: '#8a7a60', marginLeft: 2 }}>{atk.name}</span>
              </div>
              <span style={{ fontSize: compact ? 9 : 11, fontWeight: 'bold', color: '#F5A623' }}>{atk.damage}</span>
            </div>
            {!compact && atk.desc && <div style={{ fontSize: 7, color: '#5a4a36', marginTop: 1, fontStyle: 'italic' }}>{atk.desc}</div>}
          </div>
        ))}
        {/* Attached energy */}
        {attached.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
            {attached.map((e, i) => {
              const et = CARDS[e]?.energyType;
              return <EnergyDot key={i} type={et || 'rainbow'} size={compact ? 6 : 8} />;
            })}
          </div>
        )}
      </div>
      {/* Footer */}
      <div style={{ padding: compact ? '1px 5px 3px' : '2px 8px 4px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${tribe.primary}22` }}>
        <span style={{ fontSize: compact ? 6 : 7, color: '#3a2a10' }}>
          {card.weakness ? `Weak: ${TRIBE[card.weakness]?.name || card.weakness}` : ''}
          {card.retreatCost ? ` · R:${card.retreatCost}` : ''}
        </span>
        <span style={{ fontSize: compact ? 6 : 7, color: rColor }}>{RARITY_STARS[card.rarity]}</span>
      </div>
    </div>
  );
}

export { EnergyDot, HpBar, TRIBE as TRIBE_DATA };
