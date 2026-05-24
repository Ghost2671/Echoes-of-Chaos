const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
});

app.use(cors());
app.use(express.json());

// ── In-memory stores ─────────────────────────────────────────────────────────
const players = new Map();     // playerId → { name, socketId, collection, codex, coins }
const queue = [];              // [ { playerId, socketId, codex } ]
const battles = new Map();     // battleId → { id, p1, p2, state, lastMove }
const trades = new Map();      // tradeId → { id, from, to, offer, want, coins, status, createdAt }
const socketToPlayer = new Map(); // socketId → playerId

// ── Utility ──────────────────────────────────────────────────────────────────
function log(...args) { console.log('[server]', ...args); }
function now() { return Date.now(); }

// ── REST: Player registration ─────────────────────────────────────────────────
app.post('/api/player/register', (req, res) => {
  const { playerId, name } = req.body;
  if (!playerId) return res.status(400).json({ error: 'playerId required' });
  if (!players.has(playerId)) {
    players.set(playerId, { playerId, name: name || 'Anonymous', coins: 0, collection: {}, codex: {}, lastSeen: now() });
  } else {
    const p = players.get(playerId);
    if (name) p.name = name;
    p.lastSeen = now();
  }
  res.json({ ok: true, player: players.get(playerId) });
});

app.get('/api/player/:id', (req, res) => {
  const p = players.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

// ── REST: Trade marketplace ───────────────────────────────────────────────────
app.get('/api/trades', (req, res) => {
  const open = [...trades.values()].filter(t => t.status === 'open');
  res.json(open);
});

app.post('/api/trades', (req, res) => {
  const { fromPlayerId, fromName, offerCards, wantCards, coinsAdjust } = req.body;
  if (!fromPlayerId || !offerCards || !wantCards) return res.status(400).json({ error: 'Missing fields' });
  const id = uuidv4();
  const trade = { id, fromPlayerId, fromName: fromName || 'Anonymous', offerCards, wantCards, coinsAdjust: coinsAdjust || 0, status: 'open', createdAt: now() };
  trades.set(id, trade);
  io.emit('trade:new', trade);
  res.json(trade);
});

app.post('/api/trades/:id/accept', (req, res) => {
  const trade = trades.get(req.params.id);
  if (!trade || trade.status !== 'open') return res.status(404).json({ error: 'Trade not available' });
  const { acceptPlayerId } = req.body;
  if (!acceptPlayerId) return res.status(400).json({ error: 'acceptPlayerId required' });
  if (acceptPlayerId === trade.fromPlayerId) return res.status(400).json({ error: 'Cannot accept your own trade' });
  trade.status = 'accepted';
  trade.acceptedBy = acceptPlayerId;
  trade.acceptedAt = now();
  trades.set(trade.id, trade);
  io.emit('trade:accepted', trade);
  res.json(trade);
});

app.delete('/api/trades/:id', (req, res) => {
  const trade = trades.get(req.params.id);
  if (!trade) return res.status(404).json({ error: 'Not found' });
  trade.status = 'cancelled';
  trades.set(trade.id, trade);
  io.emit('trade:cancelled', { id: trade.id });
  res.json({ ok: true });
});

// ── REST: Online players ──────────────────────────────────────────────────────
app.get('/api/online', (req, res) => {
  const onlinePlayers = [...players.values()].filter(p => {
    const sid = p.socketId;
    return sid && io.sockets.sockets.has(sid);
  }).map(p => ({ playerId: p.playerId, name: p.name, inBattle: false }));
  res.json(onlinePlayers);
});

// ── REST: Leaderboard ─────────────────────────────────────────────────────────
const leaderboard = new Map(); // playerId → { wins, losses, streak }

app.get('/api/leaderboard', (req, res) => {
  const lb = [...leaderboard.entries()].map(([id, stats]) => {
    const p = players.get(id);
    return { playerId: id, name: p?.name || 'Anonymous', ...stats };
  }).sort((a, b) => b.wins - a.wins).slice(0, 20);
  res.json(lb);
});

// ── Socket.io: PvP Battle ─────────────────────────────────────────────────────
io.on('connection', (socket) => {
  log('Client connected:', socket.id);

  socket.on('player:hello', ({ playerId, name }) => {
    if (!playerId) return;
    socketToPlayer.set(socket.id, playerId);
    let p = players.get(playerId);
    if (!p) {
      p = { playerId, name: name || 'Anonymous', coins: 0, collection: {}, codex: {}, lastSeen: now() };
      players.set(playerId, p);
    }
    p.socketId = socket.id;
    p.name = name || p.name;
    p.lastSeen = now();
    socket.emit('player:welcomed', { playerId, name: p.name });
    log(`Player ${name} (${playerId}) connected`);
  });

  // ── Matchmaking ────────────────────────────────────────────────────────────
  socket.on('queue:join', ({ playerId, codexSnapshot }) => {
    // Remove if already queued
    const existing = queue.findIndex(q => q.playerId === playerId);
    if (existing !== -1) queue.splice(existing, 1);

    queue.push({ playerId, socketId: socket.id, codexSnapshot, joinedAt: now() });
    socket.emit('queue:joined', { position: queue.length });
    log(`${playerId} joined queue (size: ${queue.length})`);

    // Try to match
    if (queue.length >= 2) {
      const [p1entry, p2entry] = queue.splice(0, 2);
      const battleId = uuidv4();
      const battle = {
        id: battleId,
        p1: { playerId: p1entry.playerId, socketId: p1entry.socketId, codex: p1entry.codexSnapshot },
        p2: { playerId: p2entry.playerId, socketId: p2entry.socketId, codex: p2entry.codexSnapshot },
        state: null,
        turn: p1entry.playerId,
        log: [],
        createdAt: now(),
        lastAction: now(),
      };
      battles.set(battleId, battle);

      const p1socket = io.sockets.sockets.get(p1entry.socketId);
      const p2socket = io.sockets.sockets.get(p2entry.socketId);

      if (p1socket) { p1socket.join(battleId); p1socket.emit('battle:matched', { battleId, role: 'p1', opponent: { playerId: p2entry.playerId, name: players.get(p2entry.playerId)?.name || '?' } }); }
      if (p2socket) { p2socket.join(battleId); p2socket.emit('battle:matched', { battleId, role: 'p2', opponent: { playerId: p1entry.playerId, name: players.get(p1entry.playerId)?.name || '?' } }); }
      log(`Battle matched: ${battleId}`);
    }
  });

  socket.on('queue:leave', ({ playerId }) => {
    const idx = queue.findIndex(q => q.playerId === playerId);
    if (idx !== -1) queue.splice(idx, 1);
    socket.emit('queue:left', {});
  });

  // ── Battle actions ─────────────────────────────────────────────────────────
  socket.on('battle:action', ({ battleId, playerId, action }) => {
    const battle = battles.get(battleId);
    if (!battle) return socket.emit('battle:error', { msg: 'Battle not found' });
    battle.log.push({ playerId, action, at: now() });
    battle.lastAction = now();
    // Relay action to the other player
    socket.to(battleId).emit('battle:opponentAction', { playerId, action });
  });

  socket.on('battle:stateSync', ({ battleId, state }) => {
    const battle = battles.get(battleId);
    if (!battle) return;
    battle.state = state;
    socket.to(battleId).emit('battle:stateUpdate', { state });
  });

  socket.on('battle:end', ({ battleId, winner, loser }) => {
    const battle = battles.get(battleId);
    if (!battle) return;
    battle.ended = true;
    battle.winner = winner;
    io.to(battleId).emit('battle:finished', { winner, loser });
    // Update leaderboard
    [winner, loser].forEach((pid, i) => {
      if (!pid) return;
      const entry = leaderboard.get(pid) || { wins: 0, losses: 0, streak: 0 };
      if (i === 0) { entry.wins++; entry.streak++; }
      else { entry.losses++; entry.streak = 0; }
      leaderboard.set(pid, entry);
    });
    log(`Battle ${battleId} ended. Winner: ${winner}`);
  });

  socket.on('battle:chat', ({ battleId, playerId, msg }) => {
    const name = players.get(playerId)?.name || '?';
    io.to(battleId).emit('battle:chat', { from: name, msg, at: now() });
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const playerId = socketToPlayer.get(socket.id);
    socketToPlayer.delete(socket.id);
    // Remove from queue
    const qi = queue.findIndex(q => q.socketId === socket.id);
    if (qi !== -1) queue.splice(qi, 1);
    // Notify battle rooms
    for (const [bid, battle] of battles.entries()) {
      if (!battle.ended && (battle.p1?.socketId === socket.id || battle.p2?.socketId === socket.id)) {
        socket.to(bid).emit('battle:opponentDisconnected', { playerId });
      }
    }
    log('Client disconnected:', socket.id, playerId || '(unknown)');
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.SERVER_PORT || 3001;
server.listen(PORT, () => {
  log(`Backend running on port ${PORT}`);
});

module.exports = { app, io };
