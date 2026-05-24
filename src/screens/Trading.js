import { useState } from 'react';
import { CARDS, TRIBE_DATA, RARITY_DATA, NPC_TRADERS } from '../gameData';
import CardDisplay from '../components/CardDisplay';

const C={bg:'#07070a',panel:'#0d0d12',orange:'#F26522',amber:'#F5A623',text:'#EDE0CC',muted:'#4a3f5a',green:'#4ade80',red:'#f87171',blue:'#60a5fa',purple:'#c084fc'};

function rarityColor(r) {
  return {common:'#8a9ab0',uncommon:'#4ade80',rare:'#3b82f6',super_rare:'#a855f7',ultra_rare:'#f59e0b'}[r]||'#888';
}

export default function Trading({collection,coins,onTrade,onClose}) {
  const [activeTrader,setActiveTrader]=useState(null);
  const [selectedOffer,setSelectedOffer]=useState(null);
  const [msg,setMsg]=useState(null);
  const [tab,setTab]=useState('npc'); // 'npc' | 'player'
  const [playerOfferCard,setPlayerOfferCard]=useState(null);
  const [playerWantCard,setPlayerWantCard]=useState(null);
  const [searchGive,setSearchGive]=useState('');
  const [searchWant,setSearchWant]=useState('');
  const [tradeHistory,setTradeHistory]=useState([]);

  function showMsg(text,color=C.green) {
    setMsg({text,color});
    setTimeout(()=>setMsg(null),3000);
  }

  function doNPCTrade(trader,offer) {
    // Check player has the "want" cards
    for(const [id,n] of Object.entries(offer.want||{})) {
      if((collection[id]||0)<n) {showMsg(`Missing: ${CARDS[id]?.name}`,C.red);return;}
    }
    // Build delta
    const delta={};
    for(const [id,n] of Object.entries(offer.give||{})) delta[id]=(delta[id]||0)+n;
    for(const [id,n] of Object.entries(offer.want||{})) delta[id]=(delta[id]||0)-n;
    const coinDelta=offer.coinAdjust||0;
    if(coinDelta<0&&coins+coinDelta<0){showMsg('Not enough coins!',C.red);return;}
    onTrade(delta,coinDelta);
    setTradeHistory(h=>[{trader:trader.name,give:offer.give,want:offer.want,coins:coinDelta,timestamp:new Date().toLocaleTimeString()},...h].slice(0,20));
    showMsg(`✅ Trade complete with ${trader.name}!`);
    setSelectedOffer(null);
    setActiveTrader(null);
  }

  // Player-to-player style trade builder
  const ownedCreatures=Object.keys(collection||{}).filter(id=>{
    const c=CARDS[id]; return c&&c.cardType==='creature'&&collection[id]>0;
  });
  const allCreatures=Object.values(CARDS).filter(c=>c.cardType==='creature');

  function submitPlayerTrade() {
    if(!playerOfferCard||!playerWantCard){showMsg('Select cards to offer and want',C.red);return;}
    if(!(collection[playerOfferCard]>0)){showMsg('You don\'t own that card',C.red);return;}
    const wantCard=CARDS[playerWantCard];
    const offerCard=CARDS[playerOfferCard];
    if(!wantCard||!offerCard) return;

    // Simulate: NPC "accepts" if the rarity roughly matches or want is worse
    const rarityRank={common:0,uncommon:1,rare:2,super_rare:3,ultra_rare:4};
    const offerRank=rarityRank[offerCard.rarity]||0;
    const wantRank=rarityRank[wantCard.rarity]||0;
    const diff=offerRank-wantRank;
    const acceptChance=diff>=0?0.85:diff===-1?0.55:0.20;
    const accepted=Math.random()<acceptChance;

    if(accepted) {
      onTrade({[playerOfferCard]:-1,[playerWantCard]:1},0);
      setTradeHistory(h=>[{trader:'Player Market',give:{[playerWantCard]:1},want:{[playerOfferCard]:1},coins:0,timestamp:new Date().toLocaleTimeString()},...h].slice(0,20));
      showMsg(`✅ Trade accepted! Got ${wantCard.name}`);
    } else {
      showMsg(`❌ Trade rejected — offer something better!`,C.red);
    }
    setPlayerOfferCard(null);
    setPlayerWantCard(null);
  }

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      {/* Header */}
      <div style={{borderBottom:`2px solid ${C.orange}`,padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0806',flexShrink:0}}>
        <div>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Chaotic Hub</div>
          <div style={{fontSize:18,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>Card Market</div>
          <div style={{fontSize:9,color:C.muted,marginTop:1}}>Trade with NPC players or the open market</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{fontSize:14,fontWeight:'bold',color:C.amber}}>💰 {coins}</div>
          <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase',letterSpacing:1}}>← Hub</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,padding:'0 18px',background:'#0a0806',borderBottom:'1px solid #1a1020',flexShrink:0}}>
        {['npc','player'].map(t=>(
          <button key={t} onClick={()=>{setTab(t);setActiveTrader(null);setSelectedOffer(null);}} style={{padding:'8px 18px',background:tab===t?C.panel:'transparent',border:'none',borderBottom:tab===t?`2px solid ${C.orange}`:'2px solid transparent',color:tab===t?C.orange:C.muted,fontSize:10,cursor:'pointer',fontWeight:tab===t?'bold':'normal',textTransform:'uppercase',letterSpacing:1}}>
            {t==='npc'?'🤝 NPC Traders':'🌐 Open Market'}
          </button>
        ))}
      </div>

      {msg&&(
        <div style={{position:'fixed',top:80,left:'50%',transform:'translateX(-50%)',background:'#0a0a14',border:`1px solid ${msg.color}`,color:msg.color,padding:'10px 24px',borderRadius:8,zIndex:1000,fontSize:11,fontWeight:'bold',boxShadow:'0 4px 20px rgba(0,0,0,0.5)'}}>
          {msg.text}
        </div>
      )}

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {tab==='npc'&&(
          <>
            {/* Trader list */}
            <div style={{width:200,borderRight:'1px solid #1a1020',overflowY:'auto',flexShrink:0}}>
              <div style={{padding:'10px 14px'}}>
                <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:8}}>Traders Available</div>
                {NPC_TRADERS.map(trader=>{
                  const td=TRIBE_DATA[trader.tribe]||{};
                  const active=activeTrader?.id===trader.id;
                  return (
                    <div key={trader.id} onClick={()=>{setActiveTrader(trader);setSelectedOffer(null);}} style={{padding:'10px',borderRadius:8,background:active?`${td.color||C.orange}22`:'transparent',border:`1px solid ${active?td.color||C.orange:'transparent'}`,cursor:'pointer',marginBottom:6,transition:'all 0.15s'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{fontSize:24}}>{trader.avatar}</div>
                        <div>
                          <div style={{fontSize:10,fontWeight:'bold',color:active?td.color||C.orange:C.text}}>{trader.name}</div>
                          <div style={{fontSize:8,color:td.color||C.muted,textTransform:'uppercase'}}>{td.name}</div>
                        </div>
                      </div>
                      <div style={{fontSize:8,color:C.muted,marginTop:4,lineHeight:1.4}}>{trader.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trader offers */}
            <div style={{flex:1,overflowY:'auto',padding:16}}>
              {!activeTrader?(
                <div style={{textAlign:'center',padding:60,color:C.muted}}>
                  <div style={{fontSize:40,marginBottom:12}}>🤝</div>
                  <div style={{fontSize:13}}>Select a trader from the left</div>
                  <div style={{fontSize:10,marginTop:6}}>They each have special cards they're looking for</div>
                </div>
              ):(
                <>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
                    <div style={{fontSize:40}}>{activeTrader.avatar}</div>
                    <div>
                      <div style={{fontSize:16,fontWeight:'bold',color:C.text}}>{activeTrader.name}</div>
                      <div style={{fontSize:10,color:C.muted}}>{activeTrader.description}</div>
                    </div>
                  </div>

                  <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:12}}>Trade Offers ({activeTrader.offers.length})</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:12}}>
                    {activeTrader.offers.map((offer,i)=>{
                      const isSelected=selectedOffer===i;
                      const canTrade=Object.entries(offer.want||{}).every(([id,n])=>(collection[id]||0)>=n);
                      const giveCards=Object.entries(offer.give||{});
                      const wantCards=Object.entries(offer.want||{});
                      const coinAdj=offer.coinAdjust||0;
                      return (
                        <div key={i} onClick={()=>setSelectedOffer(isSelected?null:i)} style={{background:C.panel,border:`1px solid ${isSelected?C.orange:canTrade?'#1a2a1a':'#1a1020'}`,borderRadius:10,overflow:'hidden',cursor:'pointer',transition:'all 0.15s'}}>
                          <div style={{padding:'10px 14px',display:'flex',gap:10}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:8,color:C.green,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>You Get</div>
                              {giveCards.map(([id,n])=>{
                                const card=CARDS[id]; if(!card) return null;
                                const td=TRIBE_DATA[card.tribe]||{};
                                return (
                                  <div key={id} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,padding:'4px 6px',background:'#0a140a',borderRadius:5,border:'1px solid #1a3a1a'}}>
                                    <span style={{color:td.color||'#888',fontSize:12}}>{td.icon||'⚡'}</span>
                                    <span style={{fontSize:9,color:C.text,fontWeight:'bold'}}>{card.name}</span>
                                    {n>1&&<span style={{fontSize:8,color:C.muted}}>×{n}</span>}
                                    <span style={{marginLeft:'auto',fontSize:7,color:rarityColor(card.rarity)}}>{RARITY_DATA[card.rarity]?.label}</span>
                                  </div>
                                );
                              })}
                              {coinAdj>0&&<div style={{fontSize:9,color:C.amber}}>+ 💰 {coinAdj}</div>}
                            </div>

                            <div style={{fontSize:20,color:C.muted,alignSelf:'center'}}>⇄</div>

                            <div style={{flex:1}}>
                              <div style={{fontSize:8,color:C.red,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>You Give</div>
                              {wantCards.map(([id,n])=>{
                                const card=CARDS[id]; if(!card) return null;
                                const td=TRIBE_DATA[card.tribe]||{};
                                const have=collection[id]||0;
                                const ok=have>=n;
                                return (
                                  <div key={id} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,padding:'4px 6px',background:ok?'#140a0a':'#0a0a0a',borderRadius:5,border:`1px solid ${ok?'#3a1a1a':'#333'}`}}>
                                    <span style={{color:td.color||'#888',fontSize:12}}>{td.icon||'⚡'}</span>
                                    <span style={{fontSize:9,color:ok?C.text:'#555',fontWeight:'bold'}}>{card.name}</span>
                                    {n>1&&<span style={{fontSize:8,color:C.muted}}>×{n}</span>}
                                    <span style={{marginLeft:'auto',fontSize:8,color:ok?C.green:C.red}}>{have}/{n}</span>
                                  </div>
                                );
                              })}
                              {coinAdj<0&&<div style={{fontSize:9,color:C.amber}}>+ 💰 {Math.abs(coinAdj)}</div>}
                            </div>
                          </div>

                          {isSelected&&(
                            <div style={{padding:'0 14px 12px'}}>
                              <button onClick={(e)=>{e.stopPropagation();doNPCTrade(activeTrader,offer);}} disabled={!canTrade} style={{width:'100%',background:canTrade?C.orange:'#1a1020',color:canTrade?'#000':'#444',border:'none',borderRadius:8,padding:'10px',fontSize:11,fontWeight:'bold',cursor:canTrade?'pointer':'not-allowed',textTransform:'uppercase',letterSpacing:1}}>
                                {canTrade?'✅ Confirm Trade':'❌ Missing Cards'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {tab==='player'&&(
          <div style={{flex:1,overflowY:'auto',padding:20}}>
            <div style={{maxWidth:800,margin:'0 auto'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:20,alignItems:'start',marginBottom:24}}>
                {/* Your offer */}
                <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1020',padding:16}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>You Offer</div>
                  <input value={searchGive} onChange={e=>setSearchGive(e.target.value)} placeholder="Search your cards…" style={{width:'100%',background:'#111',border:'1px solid #333',borderRadius:6,padding:'6px 10px',color:C.text,fontSize:9,outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
                  <div style={{maxHeight:340,overflowY:'auto',display:'flex',flexWrap:'wrap',gap:6}}>
                    {ownedCreatures.filter(id=>!searchGive||CARDS[id]?.name?.toLowerCase().includes(searchGive.toLowerCase())).map(id=>{
                      const card=CARDS[id]; if(!card) return null;
                      const td=TRIBE_DATA[card.tribe]||{};
                      const sel=playerOfferCard===id;
                      return (
                        <div key={id} onClick={()=>setPlayerOfferCard(sel?null:id)} style={{padding:'5px 10px',borderRadius:6,background:sel?`${td.color||C.orange}22`:'#0a0a0a',border:`1px solid ${sel?td.color||C.orange:'#333'}`,cursor:'pointer',fontSize:9,color:sel?td.color||C.orange:C.text,display:'flex',alignItems:'center',gap:5,transition:'all 0.15s'}}>
                          <span>{td.icon||'⚡'}</span><span>{card.name}</span><span style={{color:C.muted}}>×{collection[id]}</span>
                        </div>
                      );
                    })}
                  </div>
                  {playerOfferCard&&(
                    <div style={{marginTop:10}}>
                      <CardDisplay cardId={playerOfferCard} small/>
                    </div>
                  )}
                </div>

                <div style={{textAlign:'center',color:C.muted,paddingTop:80}}>
                  <div style={{fontSize:28}}>⇄</div>
                  <div style={{fontSize:9,color:C.muted,marginTop:6}}>for</div>
                </div>

                {/* You want */}
                <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1020',padding:16}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>You Want</div>
                  <input value={searchWant} onChange={e=>setSearchWant(e.target.value)} placeholder="Search all cards…" style={{width:'100%',background:'#111',border:'1px solid #333',borderRadius:6,padding:'6px 10px',color:C.text,fontSize:9,outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
                  <div style={{maxHeight:340,overflowY:'auto',display:'flex',flexWrap:'wrap',gap:6}}>
                    {allCreatures.filter(c=>!searchWant||c.name.toLowerCase().includes(searchWant.toLowerCase())).map(card=>{
                      const td=TRIBE_DATA[card.tribe]||{};
                      const sel=playerWantCard===card.id;
                      return (
                        <div key={card.id} onClick={()=>setPlayerWantCard(sel?null:card.id)} style={{padding:'5px 10px',borderRadius:6,background:sel?`${td.color||C.blue}22`:'#0a0a0a',border:`1px solid ${sel?td.color||C.blue:'#333'}`,cursor:'pointer',fontSize:9,color:sel?td.color||C.blue:C.text,display:'flex',alignItems:'center',gap:5,transition:'all 0.15s'}}>
                          <span>{td.icon||'⚡'}</span><span>{card.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  {playerWantCard&&(
                    <div style={{marginTop:10}}>
                      <CardDisplay cardId={playerWantCard} small/>
                    </div>
                  )}
                </div>
              </div>

              <div style={{textAlign:'center',marginBottom:24}}>
                <div style={{fontSize:9,color:C.muted,marginBottom:8}}>Higher rarity offers are more likely to be accepted by other players</div>
                <button onClick={submitPlayerTrade} disabled={!playerOfferCard||!playerWantCard} style={{background:playerOfferCard&&playerWantCard?C.orange:'#1a1020',color:playerOfferCard&&playerWantCard?'#000':'#444',border:'none',borderRadius:10,padding:'12px 40px',fontSize:13,fontWeight:'bold',cursor:playerOfferCard&&playerWantCard?'pointer':'not-allowed',textTransform:'uppercase',letterSpacing:2}}>
                  📤 Submit Trade
                </button>
              </div>

              {tradeHistory.length>0&&(
                <div style={{background:C.panel,borderRadius:10,border:'1px solid #1a1020',padding:14}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>Recent Trades</div>
                  {tradeHistory.map((t,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #111',fontSize:9,color:C.muted}}>
                      <span style={{color:C.text}}>{t.trader}</span>
                      <span>{Object.entries(t.give).map(([id])=>CARDS[id]?.name).join(', ')} ⇄ {Object.entries(t.want).map(([id])=>CARDS[id]?.name).join(', ')}</span>
                      <span style={{color:'#555'}}>{t.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
