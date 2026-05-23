import { useEffect, useState } from "react";

const defaultCards = [
  { id: 1, name: "Shadow Warden", power: 90 },
  { id: 2, name: "Void Reaver", power: 88 },
  { id: 3, name: "Chaos Arcanist", power: 85 },
  { id: 4, name: "Iron Specter", power: 82 },
  { id: 5, name: "Blood Titan", power: 95 },
  { id: 6, name: "Night Siren", power: 80 },
  { id: 7, name: "Ashen Knight", power: 83 },
  { id: 8, name: "Storm Revenant", power: 89 },
  { id: 9, name: "Eclipse Beast", power: 92 },
  { id: 10, name: "Null Prophet", power: 97 }
];

export default function Game() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("echoes-of-chaos-save");
    return saved ? JSON.parse(saved) : defaultCards;
  });

  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("echoes-of-chaos-score");
    return saved ? JSON.parse(saved) : 0;
  });

  // Autosave whenever state changes
  useEffect(() => {
    localStorage.setItem("echoes-of-chaos-save", JSON.stringify(cards));
    localStorage.setItem("echoes-of-chaos-score", JSON.stringify(score));
  }, [cards, score]);

  function battle(index) {
    const cardPower = cards[index].power;
    const gain = Math.floor(cardPower / 10);

    setScore(prev => prev + gain);
  }

  function resetGame() {
    setCards(defaultCards);
    setScore(0);
    localStorage.removeItem("echoes-of-chaos-save");
    localStorage.removeItem("echoes-of-chaos-score");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Echoes of Chaos</h1>
      <h2>Score: {score}</h2>

      <button onClick={resetGame}>Reset Game</button>

      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        {cards.map((card, i) => (
          <div key={card.id} style={{ border: "1px solid #444", padding: 10 }}>
            <h3>{card.name}</h3>
            <p>Power: {card.power}</p>
            <button onClick={() => battle(i)}>Use Card</button>
          </div>
        ))}
      </div>
    </div>
  );
}
