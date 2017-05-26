import NewGame from './models/NewGame'
import MapInfo from './models/MapInfo'

const lobbyId   = 1;
let gameId      = 0;
let lobbySlots  = new NewGame();

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log("new user", socket.id);

    socket.on("onEnterLobby", () => {
      socket.join(lobbyId);
      io.sockets.in(lobbyId).emit("addSlots", lobbySlots);
    });
    socket.on("selectStage", (data) => {
      lobbySlots.state    = "joinable";
      lobbySlots.mapName  = data.mapName;
      broadcastSlotStateUpdate(lobbyId, lobbySlots.state);
    });
    socket.on("hostGame", (data) => {
      lobbySlots.state  = "settingup";
      gameId            = data.gameId;
      broadcastSlotStateUpdate(data.gameId, "settingup");
    });
    // socket.on("move player", onMovePlayer);
    // socket.on("disconnect", onClientDisconnect);
    // socket.on("place bomb", onPlaceBomb);
    socket.on("register map", (data) => {
      // games.map = new Map(data, TILE_SIZE);
    });
    socket.on("start game on server", () => {
      var game = new Game(gameId);
      games = game;
      var pendingGame = lobbySlots;
      lobbySlots.state = "inprogress";
      Lobby.broadcastSlotStateUpdate(gameId, "inprogress");
      var ids = pendingGame.getPlayerIds();
      for(var i = 0; i < ids.length; i++) {
        var playerId    = ids[i];
        var spawnPoint  = MapInfo['First'].spawnLocations[i];
        var newPlayer   = new Player(spawnPoint.x * TILE_SIZE, spawnPoint.y * TILE_SIZE, "down", playerId, pendingGame.players[playerId].color);
        newPlayer.spawnPoint = spawnPoint;
        games.players[playerId] = newPlayer;
      }
      games.numPlayersAlive = ids.length;
      io.sockets.in(gameId).emit("start game on client", {mapName: pendingGame.mapName, players: games.players});
    });
    // socket.on("ready for round", onReadyForRound);
    // socket.on("powerup overlap", onPowerupOverlap);
    socket.on("enter pending game", (data) => {
      var pendingGame = lobbySlots;
      socket.leave(lobbyId);
      socket.join(data.gameId);
      pendingGame.addPlayer(socket.id);
      gameId = data.gameId;
      socket.emit("show current players", {players: pendingGame.players});
      socket.broadcast.to(data.gameId).emit("player joined", {id: socket.id, color: pendingGame.players[socket.id].color});
      if (pendingGame.getNumPlayers() >= MapInfo['First'].spawnLocations.length) {
        pendingGame.state = "full";
        broadcastSlotStateUpdate(data.gameId, "full");
      }
    });
    socket.on("leave pending game", () => {
      var lobbySlot = lobbySlots;
      socket.leave(gameId);
      lobbySlot.removePlayer(socket.id);
      io.sockets.in(gameId).emit("player left", {players: lobbySlot.players});
      if (lobbySlot.getNumPlayers() == 0) {
          lobbySlot.state = "empty";
          io.sockets.in(lobbyId).emit("update slot", {gameId: gameId, newState: "empty"});
      }
      if (lobbySlot.state == "full") {
          lobbySlot.state = "joinable";
          io.sockets.in(lobbyId).emit("update slot", {gameId: gameId, newState: "joinable"});
      }
    });
    function broadcastSlotStateUpdate(gameId, newState) {
      io.sockets.in(lobbyId).emit("updateSlot", {gameId: gameId, newState: newState});
    }
  })
}
