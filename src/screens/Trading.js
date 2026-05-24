import { useState, useEffect } from 'react';
import { CARDS, TRIBE_DATA, RARITY_DATA } from '../gameData';
import CardDisplay from '../components/CardDisplay';

const C = { bg:'#07070a', panel:'#0d0d12', border:'#1a1625', orange:'#F26522', amber:'#F5A623', text:'#EDE0CC', muted:'#4a3f5a', green:'#4ade80', red:'#f87171', blue:'#60a5fa', purple:'#c084fc' };

// NPC traders with specific offer/want combos
const NPC_TRADERS = [
  { id:'trader_bodal', name:"Bodal's Archive", icon:'📚', tribe:'overworld', color:'#3A80C9',
    desc:'Bodal is obsessed with collecting rare tomes and ancient creatures. He trades fairly.',
    offers:[
      { give:{ id:'najarin', count:1 }, want:{ id:'maxxor', count:1 }, coins:0 },
      { give:{ id:'bodal_satchel', count:2 }, want:{ id:'perithane_shield', count:3 }, coins:10 },
      { give:{ id:'refrain_of_denial', count:1 }, want:{ id:'footstep_of_brave', count:2 }, coins:0 },
    ],
  },
  { id:'trader_ulmar', name:"Ulmar's Lab", icon:'🧪', tribe:'underworld', color:'#CC2200',
    desc:"Ulmar trades scientific oddities and Underworld artifacts. He doesn't care about fairness.",
    offers:[
      { give:{ id:'ulmar_projector', count:1 }, want:{ id:'chaor_charger', count:1 }, coins:-20 },
      { give:{ id:'chaor', count:1 }, want:{ id:'skartalas', count:2 }, coins:50 },
      { give:{ id:'cadence_of_malvadine', count:1 }, want:{ id:'dirge_of_deserter', count:2 }, coins:0 },
    ],
  },
  { id:'trader_vinta', name:"Vinta's Bazaar", icon:'🌪️', tribe:'mipedian', color:'#C8960C',
    desc:'Vinta travels the desert trading rare Mipedian artifacts and speedy creatures.',
    offers:[
      { give:{ id:'frafdo', count:1 }, want:{ id:'wagram', count:1 }, coins:30 },
      { give:{ id:'balladeer_flute', count:1 }, want:{ id:'velocity_boots', count:2 }, coins:20 },
      { give:{ id:'sands_of_silence', count:2 }, want:{ id:'melody_of_mirage', count:3 }, coins:0 },
    ],
  },
  { id:'trader_mudeenu', name:"Mudeenu's Tide", icon:'🌊', tribe:'marrillian', color:'#009999',
    desc:"Mudeenu trades M'arrillian relics from the deep ocean. His wisdom makes him a sharp trader.",
    offers:[
      { give:{ id:'phelphor', count:1 }, want:{ id:'mudeenu', count:2 }, coins:100 },
      { give:{ id:'mindlock_device', count:1 }, want:{ id:'coral_suit', count:2 }, coins:0 },
      { give:{ id:'tide_melody', count:1 }, want:{ id:'deep_hum', count:2 }, coins:0 },
    ],
  },
  { id:'trader_nimmei', name:"Nimmei's Mound", icon:'🐜', tribe:'danian', color:'#8B5A2B',
    desc:'The Danian queen values colony-strengthening cards. Trade wisely or not at all.',
    offers:[
      { give:{ id:'lore', count:1 }, want:{ id:'nimmei', count:1 }, coins:50 },
      { give:{ id:'hivesword', count:2 }, want:{ id:'queen_guard_mail', count:1 }, coins:-10 },
      { give:{ id:'colony_call', count:1 }, want:{ id:'antiphon_of_hive', count:2 }, coins:0 },
    ],
  },
];

function canDoTrade(collection, wantId, wantCount, myCoins, coinsAdjust) {
  const have = collection[wantId] || 0;
  const coinsNeeded = coinsAdjust < 0 ? -coinsAdjust : 0; // if coins is negative, NPC wants coins
  return have >= wantCount && myCoins >= coinsNeeded;
}

export default function Trading({ collection, coins, onTradeComplete, onClose, playerId, playerName }) {
  const [tab, setTab] = useState('npc'); // 'npc' | 'market'
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [marketTrades, setMarketTrades] = useState([]);
  const [myOffer, setMyOffer] = useState({ offerCardId:'', offerCount:1, wantCardId:'', wantCount:1, coinsAdjust:0 });
  const [marketLoading, setMarketLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => { if (tab === 'market') fetchMarket(); }, [tab]);

  async function fetchMarket() {
    setMarketLoading(true);
    try { const r = await fetch('/api/trades'); const d = await r.json(); setMarketTrades(Array.isArray(d)?d:[]); }
    catch { setMarketTrades([]); }
    setMarketLoading(false);
  }

  function notify(msg, color = C.green) { setNotification({ msg, color }); setTimeout(()=>setNotification(null),3000); }

  function doNpcTrade(trader, offer) {
    const { give, want, coins: coinAdj } = offer;
    if (!canDoTrade(collection, want.id, want.count, coins, coinAdj)) { notify('You don\'t have the required cards or coins!', C.red); return; }
    const newCollection = { ...collection };
    newCollection[want.id] = (newCollection[want.id] || 0) - want.count;
    if (newCollection[want.id] <= 0) delete newCollection[want.id];
    newCollection[give.id] = (newCollection[give.id] || 0) + give.count;
    const coinChange = coinAdj > 0 ? coinAdj : coinAdj < 0 ? coinAdj : 0;
    onTradeComplete(newCollection, coinChange);
    notify(`✓ Trade complete! Got ${give.count}× ${CARDS[give.id]?.name || give.id}`);
  }

  async function postMarketTrade() {
    if (!myOffer.offerCardId || !myOffer.wantCardId) { notify('Select cards to offer and want', C.red); return; }
    if ((collection[myOffer.offerCardId]||0) < myOffer.offerCount) { notify('Not enough cards to offer', C.red); return; }
    setPosting(true);
    try {
      const r = await fetch('/api/trades', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ fromPlayerId:playerId, fromName:playerName, offerCards:{ [myOffer.offerCardId]:myOffer.offerCount }, wantCards:{ [myOffer.wantCardId]:myOffer.wantCount }, coinsAdjust:myOffer.coinsAdjust }) });
      if (r.ok) { notify('Trade posted!'); fetchMarket(); setMyOffer({ offerCardId:'', offerCount:1, wantCardId:'', wantCount:1, coinsAdjust:0 }); }
      else notify('Failed to post trade', C.red);
    } catch { notify('Server not available', C.red); }
    setPosting(false);
  }

  async function acceptMarketTrade(trade) {
    const haveOffer = Object.entries(trade.wantCards||{}).every(([id,n])=>(collection[id]||0)>=n);
    if (!haveOffer) { notify("You don't have the cards they want", C.red); return; }
    try {
      const r = await fetch(`/api/trades/${trade.id}/accept`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ acceptPlayerId:playerId }) });
      if (r.ok) {
        const nc = { ...collection };
        for (const [id,n] of Object.entries(trade.wantCards||{})) { nc[id]=(nc[id]||0)-n; if(nc[id]<=0) delete nc[id]; }
        for (const [id,n] of Object.entries(trade.offerCards||{})) { nc[id]=(nc[id]||0)+n; }
        onTradeComplete(nc, trade.coinsAdjust||0);
        notify('Trade accepted!'); fetchMarket();
      } else notify('Trade failed', C.red);
    } catch { notify('Server not available', C.red); }
  }

  const myCards = Object.entries(collection).filter(([id,n])=>n>0&&CARDS[id]).map(([id,n])=>({id,n,card:CARDS[id]})).sort((a,b)=>b.card.rarity.localeCompare(a.card.rarity));

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:C.bg, minHeight:'100vh', color:C.text }}>
      {/* Notification */}
      {notification && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:C.panel, border:`2px solid ${notification.color}`, borderRadius:8, padding:'10px 20px', fontSize:11, color:notification.color, zIndex:100, boxShadow:`0 0 20px ${notification.color}44` }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom:`2px solid ${C.amber}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0c0a06' }}>
        <div>
          <div style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:2 }}>Perim Trading Post</div>
          <div style={{ fontSize:18, fontWeight:'bold', color:C.amber, textTransform:'uppercase', letterSpacing:3 }}>Trade Cards</div>
          <div style={{ fontSize:8.5, color:C.muted, marginTop:1 }}>💰 {coins} coins available</div>
        </div>
        <button onClick={onClose} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'7px 16px', cursor:'pointer', fontSize:10, textTransform:'uppercase' }}>← Hub</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid #1a1020' }}>
        {[{ id:'npc', label:'NPC Traders', icon:'🤝' },{ id:'market', label:'Player Market', icon:'🏪' }].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 20px', border:'none', borderBottom:tab===t.id?`2px solid ${C.amber}`:'2px solid transparent', background:tab===t.id?'#1a1408':'transparent', color:tab===t.id?C.amber:C.muted, fontSize:10, cursor:'pointer', textTransform:'uppercase', letterSpacing:0.5 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:900, margin:'0 auto' }}>
        {/* NPC Traders tab */}
        {tab === 'npc' && (
          <div>
            <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:14 }}>Trade with NPC merchants in Perim</div>
            {!selectedTrader ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                {NPC_TRADERS.map(trader => (
                  <div key={trader.id} onClick={()=>setSelectedTrader(trader)} style={{ background:C.panel, border:`1px solid ${trader.color}44`, borderRadius:10, padding:14, cursor:'pointer', transition:'border-color 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=trader.color}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=trader.color+'44'}>
                    <div style={{ fontSize:26, marginBottom:6 }}>{trader.icon}</div>
                    <div style={{ fontSize:12, fontWeight:'bold', color:trader.color, textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>{trader.name}</div>
                    <div style={{ fontSize:8.5, color:C.muted, lineHeight:1.4, marginBottom:8 }}>{trader.desc}</div>
                    <div style={{ fontSize:8, color:trader.color }}>{trader.offers.length} trade offers available →</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={()=>setSelectedTrader(null)} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:6, padding:'5px 12px', cursor:'pointer', fontSize:9, marginBottom:14, textTransform:'uppercase' }}>← Back</button>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                  <div style={{ fontSize:28 }}>{selectedTrader.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:'bold', color:selectedTrader.color, textTransform:'uppercase' }}>{selectedTrader.name}</div>
                    <div style={{ fontSize:9, color:C.muted }}>{selectedTrader.desc}</div>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {selectedTrader.offers.map((offer, i) => {
                    const giveCard = CARDS[offer.give.id]; const wantCard = CARDS[offer.want.id];
                    const canDo = canDoTrade(collection, offer.want.id, offer.want.count, coins, offer.coins);
                    return (
                      <div key={i} style={{ background:canDo?'#0a0f0a':'#0d0a0a', border:`1px solid ${canDo?C.green+'44':'#1a1020'}`, borderRadius:8, padding:14, display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:8, color:C.green, marginBottom:4, textTransform:'uppercase' }}>You receive</div>
                          <CardDisplay cardId={offer.give.id} small />
                          <div style={{ fontSize:9, color:C.green, marginTop:2 }}>×{offer.give.count} {giveCard?.name}</div>
                        </div>
                        <div style={{ flex:1, textAlign:'center' }}>
                          <div style={{ fontSize:18, color:C.muted }}>⇄</div>
                          {offer.coins !== 0 && <div style={{ fontSize:9, color:offer.coins>0?C.green:C.red }}>{offer.coins>0?'+':''}{offer.coins} 💰</div>}
                        </div>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:8, color:C.red, marginBottom:4, textTransform:'uppercase' }}>You give</div>
                          <CardDisplay cardId={offer.want.id} small />
                          <div style={{ fontSize:9, color:canDo?C.red:'#555', marginTop:2 }}>×{offer.want.count} {wantCard?.name}</div>
                          <div style={{ fontSize:8, color:canDo?C.muted:'#444' }}>Have: {collection[offer.want.id]||0}</div>
                        </div>
                        <button onClick={()=>doNpcTrade(selectedTrader, offer)} disabled={!canDo} style={{ background:canDo?selectedTrader.color:'#1a1020', color:canDo?'#000':'#333', border:'none', borderRadius:6, padding:'8px 14px', cursor:canDo?'pointer':'not-allowed', fontSize:10, fontWeight:'bold', textTransform:'uppercase', flexShrink:0 }}>
                          {canDo?'Trade!':'Can\'t'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Player market tab */}
        {tab === 'market' && (
          <div>
            {/* Post trade form */}
            <div style={{ background:C.panel, border:`1px solid ${C.purple}44`, borderRadius:10, padding:14, marginBottom:16 }}>
              <div style={{ fontSize:9, color:C.purple, textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>📤 Post a Trade Offer</div>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>I offer:</div>
                  <select value={myOffer.offerCardId} onChange={e=>setMyOffer(p=>({...p,offerCardId:e.target.value}))} style={{ background:'#0a0810', border:'1px solid #2a1a4a', borderRadius:4, padding:'5px 8px', color:C.text, fontSize:9, maxWidth:180 }}>
                    <option value="">Select card...</option>
                    {myCards.map(({id,n,card})=><option key={id} value={id}>{card.name} (×{n})</option>)}
                  </select>
                  <input type="number" min={1} max={4} value={myOffer.offerCount} onChange={e=>setMyOffer(p=>({...p,offerCount:+e.target.value}))} style={{ width:40, background:'#0a0810', border:'1px solid #2a1a4a', borderRadius:4, padding:'5px', color:C.text, fontSize:9, marginLeft:4 }} />
                </div>
                <div style={{ color:C.muted, fontSize:14 }}>⇄</div>
                <div>
                  <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>I want:</div>
                  <select value={myOffer.wantCardId} onChange={e=>setMyOffer(p=>({...p,wantCardId:e.target.value}))} style={{ background:'#0a0810', border:'1px solid #2a1a4a', borderRadius:4, padding:'5px 8px', color:C.text, fontSize:9, maxWidth:180 }}>
                    <option value="">Select card...</option>
                    {Object.values(CARDS).filter(c=>c.cardType!=='location').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input type="number" min={1} max={4} value={myOffer.wantCount} onChange={e=>setMyOffer(p=>({...p,wantCount:+e.target.value}))} style={{ width:40, background:'#0a0810', border:'1px solid #2a1a4a', borderRadius:4, padding:'5px', color:C.text, fontSize:9, marginLeft:4 }} />
                </div>
                <div>
                  <div style={{ fontSize:8, color:C.muted, marginBottom:4 }}>+/- coins:</div>
                  <input type="number" value={myOffer.coinsAdjust} onChange={e=>setMyOffer(p=>({...p,coinsAdjust:+e.target.value}))} style={{ width:60, background:'#0a0810', border:'1px solid #2a1a4a', borderRadius:4, padding:'5px', color:C.text, fontSize:9 }} />
                </div>
                <button onClick={postMarketTrade} disabled={posting} style={{ background:C.purple, color:'#000', border:'none', borderRadius:6, padding:'8px 16px', cursor:'pointer', fontSize:10, fontWeight:'bold', textTransform:'uppercase' }}>Post Trade</button>
              </div>
            </div>

            {/* Market listings */}
            <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>Open Trades ({marketTrades.length})</span>
              <button onClick={fetchMarket} style={{ background:'transparent', border:`1px solid ${C.muted}`, color:C.muted, borderRadius:4, padding:'3px 8px', cursor:'pointer', fontSize:8 }}>↻ Refresh</button>
            </div>
            {marketLoading && <div style={{ color:C.muted, fontSize:10, textAlign:'center', padding:20 }}>Loading market...</div>}
            {!marketLoading && marketTrades.length === 0 && <div style={{ color:C.muted, fontSize:10, textAlign:'center', padding:20 }}>No open trades. Post the first one!</div>}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {marketTrades.map(trade => {
                const offerEntries = Object.entries(trade.offerCards||{});
                const wantEntries = Object.entries(trade.wantCards||{});
                const canAccept = trade.fromPlayerId !== playerId && wantEntries.every(([id,n])=>(collection[id]||0)>=n);
                const isOwn = trade.fromPlayerId === playerId;
                return (
                  <div key={trade.id} style={{ background:C.panel, border:`1px solid ${isOwn?C.amber+'44':canAccept?C.green+'33':'#1a1020'}`, borderRadius:8, padding:12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                    <div style={{ fontSize:9, color:C.muted, minWidth:70 }}>{isOwn?'(Your offer)':trade.fromName||'Player'}</div>
                    <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      <div>
                        <div style={{ fontSize:7, color:C.green, marginBottom:2 }}>Offers:</div>
                        {offerEntries.map(([id,n])=><div key={id} style={{ fontSize:9, color:C.text }}>×{n} {CARDS[id]?.name||id}</div>)}
                      </div>
                      <span style={{ color:C.muted }}>⇄</span>
                      <div>
                        <div style={{ fontSize:7, color:C.red, marginBottom:2 }}>Wants:</div>
                        {wantEntries.map(([id,n])=><div key={id} style={{ fontSize:9, color:C.text }}>×{n} {CARDS[id]?.name||id}</div>)}
                      </div>
                      {trade.coinsAdjust !== 0 && <span style={{ fontSize:9, color:trade.coinsAdjust>0?C.green:C.red }}>{trade.coinsAdjust>0?'+':''}{trade.coinsAdjust} 💰</span>}
                    </div>
                    {!isOwn && (
                      <button onClick={()=>acceptMarketTrade(trade)} disabled={!canAccept} style={{ background:canAccept?C.green:'#1a1a1a', color:canAccept?'#000':'#333', border:'none', borderRadius:6, padding:'6px 14px', cursor:canAccept?'pointer':'not-allowed', fontSize:9.5, fontWeight:'bold', textTransform:'uppercase', flexShrink:0 }}>
                        {canAccept?'Accept':'Can\'t'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
