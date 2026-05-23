import { useEffect, useState, useRef } from "react";

const PLAYER_MAX_HP = 80;
const MAX_ENERGY = 3;
const LEVEL_UP_USES = 5;

const defaultCards = [
  { id: 1, name: "Shadow Warden",  power: 10, cost: 1, level: 1, uses: 0, cooldown: 0 },
  { id: 2, name: "Void Reaver",    power: 16, cost: 2, level: 1, uses: 0, cooldown: 0 },
  { id: 3, name: "Chaos Arcanist", power: 20, cost: 2, level: 1, uses: 0, cooldown: 0 },
  { id: 4, name: "Iron Specter",   power: 8,  cost: 1, level: 1, uses: 0, cooldown: 0 },
  { id: 5, name: "Blood Titan",    power: 26, cost: 3, level: 1, uses: 0, cooldown: 0 },
  { id: 6, name: "Night Siren",    power: 12, cost: 1, level: 1, uses: 0, cooldown: 0 },
];

function enemyForWave(wave) {
  return {
    name: wave <= 2 ? "Chaos Wraith" : wave <= 4 ? "Void Colossus" : "Null Devourer",
    hp: 40 + (wave - 1) * 25,
    maxHp: 40 + (wave - 1) * 25,
    attack: 8 + (wave - 1) * 4,
  };
}

function cardEffectivePower(card) {
  return Math.floor(card.power * (1 + (card.level - 1) * 0.3));
}

function buildInitialState() {
  return {
    playerHp: PLAYER_MAX_HP,
    energy: MAX_ENERGY,
    wave: 1,
    score: 0,
    cards: defaultCards,
    enemy: enemyForWave(1),
    log: ["Wave 1 begins. A Chaos Wraith emerges from the void."],
    gameOver: false,
    victory: false,
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem("echoes-v2");
    return saved ? JSON.parse(saved) : buildInitialState();
  } catch {
    return buildInitialState();
  }
}

const MAX_WAVES = 6;

export default function Game() {
  const [state, setState] = useState(loadState);
  const logRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("echoes-v2", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.log]);

  function addLog(msgs, base) {
    return { ...base, log: [...base.log, ...msgs].slice(-30) };
  }

  function useCard(index) {
    setState(prev => {
      if (prev.gameOver || prev.victory) return prev;
      const card = prev.cards[index];
      if (card.cooldown > 0 || card.cost > prev.energy) return prev;

      const damage = cardEffectivePower(card);
      const newEnemyHp = prev.enemy.hp - damage;
      const newUses = card.uses + 1;
      const leveledUp = newUses > 0 && newUses % LEVEL_UP_USES === 0;
      const newLevel = leveledUp ? card.level + 1 : card.level;

      const newCards = prev.cards.map((c, i) =>
        i === index
          ? { ...c, uses: newUses, level: newLevel, cooldown: 1 }
          : c
      );

      const logs = [];
      logs.push(`⚔ ${card.name} (Lv${card.level}) hits for ${damage} damage.`);
      if (leveledUp) logs.push(`✨ ${card.name} reached Level ${newLevel}!`);

      let next = { ...prev, energy: prev.energy - card.cost, cards: newCards };

      if (newEnemyHp <= 0) {
        const newWave = prev.wave + 1;
        const newScore = prev.score + prev.wave * 10;

        if (newWave > MAX_WAVES) {
          logs.push(`💀 ${prev.enemy.name} is destroyed!`);
          logs.push(`🏆 You have purged all chaos from the realm. Victory!`);
          next = addLog(logs, {
            ...next,
            enemy: { ...prev.enemy, hp: 0 },
            score: newScore,
            victory: true,
          });
        } else {
          const nextEnemy = enemyForWave(newWave);
          logs.push(`💀 ${prev.enemy.name} is destroyed! +${prev.wave * 10} score.`);
          logs.push(`🌊 Wave ${newWave}: ${nextEnemy.name} emerges!`);
          next = addLog(logs, {
            ...next,
            enemy: nextEnemy,
            wave: newWave,
            score: newScore,
            energy: MAX_ENERGY,
            cards: newCards.map(c => ({ ...c, cooldown: 0 })),
          });
        }
      } else {
        next = addLog(logs, {
          ...next,
          enemy: { ...prev.enemy, hp: newEnemyHp },
        });
      }

      return next;
    });
  }

  function endTurn() {
    setState(prev => {
      if (prev.gameOver || prev.victory) return prev;

      const incomingDamage = prev.enemy.attack;
      const newPlayerHp = prev.playerHp - incomingDamage;
      const logs = [];
      logs.push(`🔚 Turn ended.`);
      logs.push(`👹 ${prev.enemy.name} strikes for ${incomingDamage} damage!`);

      const refreshedCards = prev.cards.map(c => ({
        ...c,
        cooldown: Math.max(0, c.cooldown - 1),
      }));

      if (newPlayerHp <= 0) {
        logs.push(`💔 You have been defeated. The chaos wins...`);
        return addLog(logs, {
          ...prev,
          playerHp: 0,
          cards: refreshedCards,
          gameOver: true,
        });
      }

      logs.push(`🔋 Energy restored. Your turn.`);
      return addLog(logs, {
        ...prev,
        playerHp: newPlayerHp,
        energy: MAX_ENERGY,
        cards: refreshedCards,
      });
    });
  }

  function resetGame() {
    localStorage.removeItem("echoes-v2");
    setState(buildInitialState());
  }

  const { playerHp, energy, wave, score, cards, enemy, log, gameOver, victory } = state;

  const canEndTurn = !gameOver && !victory;

  const styles = {
    root: {
      fontFamily: "'Segoe UI', sans-serif",
      background: "#0d0d1a",
      color: "#e0e0f0",
      minHeight: "100vh",
      padding: "20px",
      boxSizing: "border-box",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#c084fc",
      margin: "0 0 4px 0",
    },
    wave: {
      color: "#94a3b8",
      fontSize: 14,
      margin: "0 0 16px 0",
    },
    row: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-start" },
    panel: {
      background: "#1a1a2e",
      border: "1px solid #2d2d4d",
      borderRadius: 10,
      padding: "14px 18px",
      flex: "1 1 200px",
    },
    panelTitle: { fontSize: 12, textTransform: "uppercase", color: "#6366f1", letterSpacing: 1, marginBottom: 8 },
    hpBar: (pct, color) => ({
      height: 10,
      borderRadius: 5,
      background: "#2d2d4d",
      overflow: "hidden",
      marginTop: 4,
      marginBottom: 2,
    }),
    hpFill: (pct, color) => ({
      height: "100%",
      width: `${Math.max(0, pct * 100)}%`,
      background: color,
      borderRadius: 5,
      transition: "width 0.3s ease",
    }),
    energyDot: (active) => ({
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: active ? "#6366f1" : "#2d2d4d",
      margin: "0 3px",
      verticalAlign: "middle",
      transition: "background 0.2s",
    }),
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: 10,
      marginBottom: 16,
    },
    card: (disabled, onCooldown) => ({
      background: disabled ? "#111120" : "#16163a",
      border: `1px solid ${onCooldown ? "#444" : disabled ? "#2a2a3a" : "#4f46e5"}`,
      borderRadius: 10,
      padding: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "transform 0.1s, box-shadow 0.1s",
      position: "relative",
    }),
    cardName: { fontWeight: "bold", fontSize: 13, marginBottom: 4, color: "#c4b5fd" },
    cardStat: { fontSize: 12, color: "#94a3b8", marginBottom: 2 },
    cardLevel: (level) => ({
      fontSize: 10,
      color: level >= 3 ? "#f59e0b" : level >= 2 ? "#a78bfa" : "#6366f1",
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: 4,
    }),
    cooldownBadge: {
      position: "absolute",
      top: 6,
      right: 8,
      fontSize: 10,
      color: "#f87171",
      fontWeight: "bold",
    },
    endTurnBtn: {
      background: "#6366f1",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 24px",
      fontSize: 14,
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: 10,
    },
    resetBtn: {
      background: "transparent",
      color: "#94a3b8",
      border: "1px solid #2d2d4d",
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      cursor: "pointer",
    },
    log: {
      background: "#0a0a18",
      border: "1px solid #1e1e3a",
      borderRadius: 8,
      padding: 12,
      height: 140,
      overflowY: "auto",
      fontSize: 12,
      lineHeight: 1.7,
      color: "#94a3b8",
    },
    overlay: {
      background: "rgba(0,0,0,0.85)",
      border: "2px solid",
      borderRadius: 12,
      padding: "28px 36px",
      textAlign: "center",
      marginBottom: 20,
    },
  };

  const playerHpPct = playerHp / PLAYER_MAX_HP;
  const enemyHpPct = enemy.hp / enemy.maxHp;

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>Echoes of Chaos</h1>
      <p style={styles.wave}>Wave {wave} of {MAX_WAVES} &nbsp;·&nbsp; Score: {score}</p>

      {(gameOver || victory) && (
        <div style={{ ...styles.overlay, borderColor: victory ? "#a78bfa" : "#ef4444" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{victory ? "🏆" : "💀"}</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: victory ? "#c084fc" : "#f87171", marginBottom: 8 }}>
            {victory ? "Victory!" : "Defeated"}
          </div>
          <div style={{ color: "#94a3b8", marginBottom: 16 }}>Final score: {score}</div>
          <button style={styles.endTurnBtn} onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div style={styles.row}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>You</div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>{playerHp} / {PLAYER_MAX_HP} HP</div>
          <div style={styles.hpBar()}>
            <div style={styles.hpFill(playerHpPct, playerHpPct > 0.5 ? "#22c55e" : playerHpPct > 0.25 ? "#f59e0b" : "#ef4444")} />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>Energy</div>
          <div style={{ marginTop: 4 }}>
            {Array.from({ length: MAX_ENERGY }, (_, i) => (
              <span key={i} style={styles.energyDot(i < energy)} />
            ))}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Enemy · Wave {wave}</div>
          <div style={{ fontWeight: "bold", fontSize: 15, color: "#f87171", marginBottom: 4 }}>{enemy.name}</div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>{enemy.hp} / {enemy.maxHp} HP</div>
          <div style={styles.hpBar()}>
            <div style={styles.hpFill(enemyHpPct, "#ef4444")} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
            Attacks for <strong style={{ color: "#fca5a5" }}>{enemy.attack}</strong> damage on your end turn
          </div>
        </div>
      </div>

      <div style={styles.cardGrid}>
        {cards.map((card, i) => {
          const canAfford = card.cost <= energy;
          const onCooldown = card.cooldown > 0;
          const disabled = onCooldown || !canAfford || gameOver || victory;
          const effPower = cardEffectivePower(card);
          const usesToNext = LEVEL_UP_USES - (card.uses % LEVEL_UP_USES);

          return (
            <div
              key={card.id}
              style={styles.card(disabled, onCooldown)}
              onClick={() => !disabled && useCard(i)}
            >
              {onCooldown && <span style={styles.cooldownBadge}>COOLDOWN</span>}
              <div style={styles.cardLevel(card.level)}>Lv {card.level}{card.level < 5 ? ` · ${usesToNext} to next` : " · MAX"}</div>
              <div style={styles.cardName}>{card.name}</div>
              <div style={styles.cardStat}>⚔ {effPower} damage</div>
              <div style={styles.cardStat}>
                {Array.from({ length: card.cost }, (_, ci) => (
                  <span key={ci} style={{ color: canAfford ? "#818cf8" : "#4b5563" }}>◆</span>
                ))}
                {" "}<span style={{ color: canAfford ? "#818cf8" : "#4b5563" }}>{card.cost} energy</span>
              </div>
            </div>
          );
        })}
      </div>

      {!gameOver && !victory && (
        <div style={{ marginBottom: 16 }}>
          <button style={styles.endTurnBtn} onClick={endTurn} disabled={!canEndTurn}>
            End Turn (enemy attacks)
          </button>
          <button style={styles.resetBtn} onClick={resetGame}>Reset</button>
        </div>
      )}

      <div>
        <div style={{ fontSize: 11, textTransform: "uppercase", color: "#6366f1", letterSpacing: 1, marginBottom: 6 }}>
          Battle Log
        </div>
        <div style={styles.log} ref={logRef}>
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
