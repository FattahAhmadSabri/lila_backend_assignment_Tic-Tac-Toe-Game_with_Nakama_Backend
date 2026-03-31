function checkWinner(board) {
  var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (var i = 0; i < lines.length; i++) {
    var a = lines[i][0], b = lines[i][1], c = lines[i][2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function matchInit(ctx, logger, nk, params) {
  return {
    state: { board: ['','','','','','','','',''], turn: 1, winner: null, draw: false, presences: {} },
    tickRate: 1,
    label: "tictactoe"
  };
}

function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
  var count = Object.keys(state.presences).length;
  return { state: state, accept: count < 2 };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
  for (var i = 0; i < presences.length; i++) {
    state.presences[presences[i].user_id] = presences[i];
  }
  return { state: state };
}

function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
  for (var i = 0; i < presences.length; i++) {
    delete state.presences[presences[i].user_id];
  }
  return { state: state };
}

function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    if (msg.op_code === 2) {
      var data = JSON.parse(nk.binaryToString(msg.data));
      var pos = data.position;
      var presenceList = Object.values(state.presences);
      var playerIndex = -1;
      for (var j = 0; j < presenceList.length; j++) {
        if (presenceList[j].user_id === msg.sender.user_id) {
          playerIndex = j;
          break;
        }
      }
      if (playerIndex + 1 === state.turn && state.board[pos] === '') {
        state.board[pos] = state.turn === 1 ? 'X' : 'O';
        state.winner = checkWinner(state.board);
        state.draw = !state.winner && state.board.every(function(c) { return c !== ''; });
        state.turn = state.turn === 1 ? 2 : 1;
        var payload = nk.stringToBinary(JSON.stringify({
          board: state.board,
          turn: state.turn,
          winner: state.winner ? msg.sender.user_id : null,
          draw: state.draw
        }));
        dispatcher.broadcastMessage(1, payload, null, null, true);
      }
    }
  }
  return { state: state };
}

function matchTerminate(ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
  return { state: state };
}

function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
  return { state: state, data: data };
}

function createRoom(ctx, logger, nk, payload) {
  var matchId = nk.matchCreate("tictactoe");
  return JSON.stringify({ matchId: matchId });
}

function listRooms(ctx, logger, nk, payload) {
  var matches = nk.matchList(10, true, "tictactoe", null, 2);
  var result = [];
  for (var i = 0; i < matches.length; i++) {
    result.push({ matchId: matches[i].matchId, size: matches[i].size });
  }
  return JSON.stringify(result);
}

function findMatch(ctx, logger, nk, payload) {
  var matches = nk.matchList(10, true, "tictactoe", null, 2);
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].size === 1) {
      return JSON.stringify({ matchId: matches[i].matchId });
    }
  }
  var matchId = nk.matchCreate("tictactoe");
  return JSON.stringify({ matchId: matchId });
}

function InitModule(ctx, logger, nk, initializer) {
  logger.info("InitModule loaded");
  initializer.registerMatch("tictactoe", {
    matchInit: matchInit,
    matchJoinAttempt: matchJoinAttempt,
    matchJoin: matchJoin,
    matchLeave: matchLeave,
    matchLoop: matchLoop,
    matchTerminate: matchTerminate,
    matchSignal: matchSignal
  });
  initializer.registerRpc("create_room", createRoom);
  initializer.registerRpc("list_rooms", listRooms);
  initializer.registerRpc("find_match", findMatch);
}