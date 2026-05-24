import { useState } from 'react';
import { PACKS, PACK_SIZE, CARDS, RARITY_DATA, TRIBE_DATA } from '../gameData';
import { sampleCards } from '../utils';
import CardDisplay from '../components/CardDisplay';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a' };

const SET_LORE = {
  perim_starter: "Journey to the world of Perim! Starter packs contain creatures from all 5 tribes and basic Battlegear.",
  zenith: "The Zenith of Chaotic set expands on the base game with powerful rare and epic cards.",
  silent_sands: "Deep in the Mipedian desert, new creatures emerge. Speed and agility rule the Silent Sands.",
  marrillian: "The M'arrillian invasion begins! Aquatic creatures with unmatched wisdom flood the battlefield.",
  dawn: "At the Dawn of Perim, the most powerful creatures reveal themselves. Epic and legendary cards await.",
  secrets: "The Secrets of the Lost City lie within. Only legendary warriors dare open these packs.",
};

export default function Shop({ coins, onBuyPack, onClose }) {
  const [openedCards, setOpenedCards] = useState(null);
  const [opening, setOpening] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  function buyPack(pack) {
    if (coins < pack.cost || opening) return;
    setOpening(true);
    setRevealedCount(0);

    const cardIds = sampleCards(pack.tierFilter || [pack.tier || 1], pack.rarityWeights, PACK_SIZE);
    const cards = cardIds.map(id => CARDS[id]).filter(Boolean);

    // Add location cards sometimes (10% per slot)
    const finalIds = cardIds;
    setOpenedCards({ packId: pack.id, packName: pack.name, packColor: pack.color, cardIds: finalIds });
    onBuyPack(pack.id, finalIds, pack.cost);

    // Reveal animation
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= finalIds.length) { clearInterval(interval); setOpening(false); }
    }, 300);
  }

  if (openedCards) {
    return (
      <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text }}>
        <div style={{ borderBottom:`2px solid ${openedCards.packColor}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0c0a10' }}>
          <div>
            <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>Pack Opened!</div>
            <div style={{ fontSize:18, fontWeight:'bold', color:openedCards.packColor, textTransform:'uppercase', letterSpacing:3 }}>{openedCards.packName}</div>
          </div>
          <button onClick={()=>setOpenedCards(null)} style={{ background:C.orange, color:'#000', border:'none', borderRadius:6, padding:'8px 20px', cursor:'pointer', fontSize:11, fontWeight:'bold', textTransform:'uppercase' }}>Scan More →</button>
        </div>
        <div style={{ padding:20 }}>
          <div style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:16 }}>Scanned {openedCards.cardIds.length} cards:</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'center' }}>
            {openedCards.cardIds.map((id, i) => {
              const card = CARDS[id];
              if (!card) return null;
              const revealed = i < revealedCount;
              const isNew = card.rarity === 'epic' || card.rarity === 'legendary';
              return (
                <div key={i} style={{ transition:'all 0.3s', opacity:revealed?1:0, transform:revealed?'scale(1)':'scale(0.8)', position:'relative' }}>
                  <CardDisplay cardId={id} />
                  {revealed && isNew && (
                    <div style={{ position:'absolute', top:-4, left:-4, right:-4, bottom:-4, borderRadius:10, border:`2px solid ${RARITY_DATA[card.rarity]?.color}`, boxShadow:`0 0 20px ${RARITY_DATA[card.rarity]?.color}88`, pointerEvents:'none' }}>
                      <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', background:RARITY_DATA[card.rarity]?.color, color:'#000', fontSize:8, fontWeight:'bold', padding:'2px 6px', borderRadius:3, whiteSpace:'nowrap', textTransform:'uppercase' }}>
                        {RARITY_DATA[card.rarity]?.label}!
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text }}>
      <div style={{ borderBottom:`2px solid ${C.orange}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0c0a10' }}>
        <div>
          <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>Scan Station</div>
          <div style={{ fontSize:18, fontWeight:'bold', color:C.orange, textTransform:'uppercase', letterSpacing:3 }}>Scanner Shop</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>Scan packs to discover creatures, battlegear, mugic, and locations</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:18, fontWeight:'bold', color:C.amber }}>💰 {coins}</div>
          <button onClick={onClose} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'5px 12px', cursor:'pointer', fontSize:9, textTransform:'uppercase', marginTop:4 }}>← Hub</button>
        </div>
      </div>

      <div style={{ padding:'20px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {PACKS.map(pack => {
            const canAfford = coins >= pack.cost;
            return (
              <div key={pack.id} style={{ background:C.panel, border:`1px solid ${canAfford?pack.color+'55':'#1a1020'}`, borderRadius:12, overflow:'hidden', opacity:canAfford?1:0.6 }}>
                {/* Pack header */}
                <div style={{ background:`linear-gradient(90deg,#0d0d12,${pack.color}66,#0d0d12)`, padding:'14px 16px', borderBottom:`1px solid ${pack.color}44` }}>
                  <div style={{ fontSize:28, marginBottom:4 }}>{pack.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:'bold', color:pack.color, textTransform:'uppercase', letterSpacing:1 }}>{pack.name}</div>
                  <div style={{ fontSize:8.5, color:C.muted, marginTop:2, lineHeight:1.4 }}>{SET_LORE[pack.id]}</div>
                </div>

                {/* Rarity weights */}
                <div style={{ padding:'10px 16px' }}>
                  <div style={{ fontSize:7.5, color:C.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Card rates ({PACK_SIZE} cards per pack):</div>
                  {Object.entries(pack.rarityWeights).filter(([,w])=>w>0).map(([rarity, weight]) => {
                    const rd = RARITY_DATA[rarity];
                    return (
                      <div key={rarity} style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          <span style={{ fontSize:8, color:rd?.color }}>{rd?.stars}</span>
                          <span style={{ fontSize:8, color:rd?.color, textTransform:'capitalize' }}>{rd?.label}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                          <div style={{ width:60, height:4, background:'#1a1020', borderRadius:2, overflow:'hidden' }}>
                            <div style={{ width:`${weight}%`, height:'100%', background:rd?.color, borderRadius:2 }} />
                          </div>
                          <span style={{ fontSize:8, color:'#555', width:28, textAlign:'right' }}>{weight}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Buy button */}
                <div style={{ padding:'10px 16px', borderTop:`1px solid ${pack.color}22` }}>
                  <button onClick={()=>buyPack(pack)} disabled={!canAfford||opening} style={{ width:'100%', background:canAfford?pack.color:'#1a1020', color:canAfford?'#000':'#333', border:'none', borderRadius:8, padding:'10px', fontSize:12, fontWeight:'bold', cursor:canAfford?'pointer':'not-allowed', textTransform:'uppercase', letterSpacing:1 }}>
                    {canAfford ? `⚡ Scan — 💰 ${pack.cost}` : `💰 ${pack.cost} (Need ${pack.cost - coins} more)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
