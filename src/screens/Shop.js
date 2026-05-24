import { useState } from 'react';
import { PACKS, PACK_SIZE, CARDS, RARITY_DATA, TRIBE_DATA } from '../gameData';
import { sampleCards } from '../utils';
import CardDisplay from '../components/CardDisplay';

const C={bg:'#07070a',panel:'#0d0d12',orange:'#F26522',amber:'#F5A623',text:'#EDE0CC',muted:'#4a3f5a'};

const TRIBE_ORDER=['overworld','underworld','mipedian','marrillian','danian',null];

export default function Shop({coins,onBuyPack,onClose}) {
  const [openedCards,setOpenedCards]=useState(null);
  const [opening,setOpening]=useState(false);
  const [revealedCount,setRevealedCount]=useState(0);
  const [filterTribe,setFilterTribe]=useState('all');

  function buyPack(pack) {
    if(coins<pack.cost||opening) return;
    setOpening(true); setRevealedCount(0);
    const cardIds=sampleCards(pack.tribeFilter,pack.rarityWeights,PACK_SIZE);
    setOpenedCards({packId:pack.id,packName:pack.name,packColor:pack.color,cardIds});
    onBuyPack(pack.id,cardIds,pack.cost);
    let count=0;
    const interval=setInterval(()=>{
      count++;setRevealedCount(count);
      if(count>=cardIds.length){clearInterval(interval);setOpening(false);}
    },280);
  }

  if(openedCards) {
    return (
      <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text}}>
        <div style={{borderBottom:`2px solid ${openedCards.packColor}`,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0806'}}>
          <div>
            <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Pack Opened!</div>
            <div style={{fontSize:20,fontWeight:'bold',color:openedCards.packColor,textTransform:'uppercase',letterSpacing:3}}>{openedCards.packName}</div>
          </div>
          <button onClick={()=>setOpenedCards(null)} style={{background:C.orange,color:'#000',border:'none',borderRadius:6,padding:'8px 22px',cursor:'pointer',fontSize:11,fontWeight:'bold',textTransform:'uppercase',letterSpacing:1}}>Scan More →</button>
        </div>
        <div style={{padding:20,maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:16}}>Cards Scanned ({openedCards.cardIds.length}):</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:14,justifyContent:'center'}}>
            {openedCards.cardIds.map((id,i)=>{
              const card=CARDS[id]; if(!card) return null;
              const revealed=i<revealedCount;
              const isShiny=card.rarity==='super_rare'||card.rarity==='ultra_rare';
              const rc=RARITY_DATA[card.rarity]?.color||'#888';
              return (
                <div key={i} style={{transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',opacity:revealed?1:0,transform:revealed?'scale(1) translateY(0)':'scale(0.7) translateY(20px)',position:'relative'}}>
                  <CardDisplay cardId={id}/>
                  {revealed&&isShiny&&(
                    <div style={{position:'absolute',top:-6,left:-6,right:-6,bottom:-6,borderRadius:14,border:`2px solid ${rc}`,boxShadow:`0 0 24px ${rc}88,0 0 48px ${rc}44`,pointerEvents:'none'}}>
                      <div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:rc,color:'#000',fontSize:8,fontWeight:'bold',padding:'2px 8px',borderRadius:3,whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:1}}>
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

  const tribeGroups={};
  for(const pack of PACKS) {
    const key=pack.tribe||'special';
    if(!tribeGroups[key]) tribeGroups[key]=[];
    tribeGroups[key].push(pack);
  }

  const TRIBE_FILTER_OPTIONS=[
    {id:'all',label:'All Packs',icon:'🌍'},
    {id:'overworld',label:'Overworld',icon:'⚔️'},
    {id:'underworld',label:'Underworld',icon:'🔥'},
    {id:'mipedian',label:'Mipedian',icon:'🌪️'},
    {id:'marrillian',label:"M'arrillian",icon:'🌊'},
    {id:'danian',label:'Danian',icon:'🐜'},
    {id:'special',label:'Special',icon:'💎'},
  ];

  const filteredPacks=filterTribe==='all'?PACKS:PACKS.filter(p=>(p.tribe||'special')===filterTribe);

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:C.bg,minHeight:'100vh',color:C.text}}>
      {/* Header */}
      <div style={{borderBottom:`2px solid ${C.orange}`,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0806'}}>
        <div>
          <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:2}}>Chaotic Scanner Station</div>
          <div style={{fontSize:20,fontWeight:'bold',color:C.orange,textTransform:'uppercase',letterSpacing:3}}>Scanner Shop</div>
          <div style={{fontSize:9,color:C.muted,marginTop:1}}>Scan card packs from all 5 tribes · 3 rarity tiers per tribe</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:20,fontWeight:'bold',color:C.amber}}>💰 {coins}</div>
          <button onClick={onClose} style={{background:'transparent',border:`1px solid ${C.muted}`,color:C.muted,borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:9,textTransform:'uppercase',marginTop:5,letterSpacing:1}}>← Hub</button>
        </div>
      </div>

      {/* Tribe filters */}
      <div style={{padding:'10px 20px',borderBottom:'1px solid #1a1020',display:'flex',gap:6,flexWrap:'wrap'}}>
        {TRIBE_FILTER_OPTIONS.map(opt=>{
          const td=TRIBE_DATA[opt.id]; const active=filterTribe===opt.id;
          const col=td?.color||C.orange;
          return (
            <button key={opt.id} onClick={()=>setFilterTribe(opt.id)} style={{background:active?col+'22':'transparent',border:`1px solid ${active?col:C.muted+'44'}`,color:active?col:C.muted,borderRadius:20,padding:'4px 12px',cursor:'pointer',fontSize:9,fontWeight:active?'bold':'normal',textTransform:'uppercase',letterSpacing:0.5,transition:'all 0.2s'}}>
              {opt.icon} {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{padding:'16px 20px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
          {filteredPacks.map(pack=>{
            const canAfford=coins>=pack.cost;
            const td=TRIBE_DATA[pack.tribe]||{};
            const tierLabel={common:'Tier I — Common',rare:'Tier II — Rare',legendary:'Tier III — Legendary'}[pack.tier]||pack.tier;
            return (
              <div key={pack.id} style={{background:C.panel,border:`1px solid ${canAfford?pack.color+'55':'#1a1020'}`,borderRadius:12,overflow:'hidden',opacity:canAfford?1:0.65,transition:'box-shadow 0.2s'}}>
                {/* Pack art header */}
                <div style={{background:`linear-gradient(135deg,#0d0d12,${pack.color}55,#0d0d12)`,padding:'16px',borderBottom:`1px solid ${pack.color}33`,position:'relative',minHeight:80}}>
                  <div style={{position:'absolute',top:8,right:10,fontSize:8,color:pack.color,textTransform:'uppercase',letterSpacing:1,opacity:0.8}}>{tierLabel}</div>
                  <div style={{fontSize:32,marginBottom:4,filter:`drop-shadow(0 0 8px ${pack.color}88)`}}>{pack.emoji}</div>
                  <div style={{fontSize:13,fontWeight:'bold',color:pack.color,textTransform:'uppercase',letterSpacing:1}}>{pack.name}</div>
                  <div style={{fontSize:8.5,color:C.muted,marginTop:3,lineHeight:1.4}}>{pack.description}</div>
                </div>

                {/* Rarity rates */}
                <div style={{padding:'10px 14px'}}>
                  <div style={{fontSize:7.5,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{PACK_SIZE} cards per pack:</div>
                  {Object.entries(pack.rarityWeights).filter(([,w])=>w>0).map(([rarity,weight])=>{
                    const rd=RARITY_DATA[rarity]; if(!rd) return null;
                    return (
                      <div key={rarity} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{fontSize:8,color:rd.color}}>{rd.stars}</span>
                          <span style={{fontSize:8,color:rd.color,textTransform:'capitalize'}}>{rd.label}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:5}}>
                          <div style={{width:55,height:4,background:'#1a1020',borderRadius:2,overflow:'hidden'}}>
                            <div style={{width:`${weight}%`,height:'100%',background:rd.color,borderRadius:2}}/>
                          </div>
                          <span style={{fontSize:8,color:'#555',width:26,textAlign:'right'}}>{weight}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Buy */}
                <div style={{padding:'8px 14px 12px',borderTop:`1px solid ${pack.color}22`}}>
                  <button onClick={()=>buyPack(pack)} disabled={!canAfford||opening} style={{width:'100%',background:canAfford?`linear-gradient(90deg,${pack.color}cc,${pack.color}88)`:'#1a1020',color:canAfford?'#000':'#444',border:'none',borderRadius:8,padding:'10px',fontSize:12,fontWeight:'bold',cursor:canAfford?'pointer':'not-allowed',textTransform:'uppercase',letterSpacing:1,transition:'opacity 0.2s'}}>
                    {canAfford?`⚡ Scan Pack — 💰 ${pack.cost}`:`💰 ${pack.cost} (Need ${pack.cost-coins} more)`}
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
