function checkWinner(board) {
  var lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (var i = 0; i < lines.length; i++) {
    var a = lines[i][0], b = lines[i][1], c = lines[i][2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function matchInit(ctx, logger, nk, params) {
  return {
    state: {
      board: ["","","","","","","","",""],
      turn: 1,
      winner: null,
      draw: false,
      presences: {},
      started: false
    },
    tickRate: 1,
    label: "tictactoe"
  };
}

function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence) {
  var count = Object.keys(state.presences).length;
  return { state: state, accept: count < 2 };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
  for (var i = 0; i < presences.length; i++) {
    state.presences[presences[i].user_id] = presences[i];
  }

  var payload = nk.stringToBinary(JSON.stringify({
    board: state.board,
    turn: state.turn,
    winner: state.winner,
    draw: state.draw
  }));

  dispatcher.broadcastMessage(1, payload, presences);

  return { state: state };
}

function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
  for (var i = 0; i < presences.length; i++) {
    delete state.presences[presences[i].user_id];
  }
  return { state: state };
}

function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {

  var playerCount = Object.keys(state.presences).length;

  if (!state.started && playerCount === 2) {
    state.started = true;

    dispatcher.broadcastMessage(
      1,
      nk.stringToBinary(JSON.stringify({
        board: state.board,
        turn: state.turn,
        winner: null,
        draw: false
      }))
    );
  }

  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];

    if (msg.op_code === 1) {

      var data = JSON.parse(nk.binaryToString(msg.data));
      var pos = data.index;

      if (state.board[pos] !== "" || state.winner) continue;

      var presenceList = Object.values(state.presences).sort(function(a, b) {
        return a.session_id.localeCompare(b.session_id);
      });

      var playerIndex = -1;
      for (var j = 0; j < presenceList.length; j++) {
        if (presenceList[j].session_id === msg.sender.session_id) {
          playerIndex = j;
          break;
        }
      }

      if (playerIndex + 1 !== state.turn) continue;

      state.board[pos] = state.turn === 1 ? "X" : "O";

      var winnerSymbol = checkWinner(state.board);

      if (winnerSymbol) {
        state.winner = msg.sender.user_id;
      }

      state.draw = !winnerSymbol && state.board.every(function(c) {
        return c !== "";
      });

      state.turn = state.turn === 1 ? 2 : 1;

      dispatcher.broadcastMessage(
        1,
        nk.stringToBinary(JSON.stringify({
          board: state.board,
          turn: state.turn,
          winner: state.winner,
          draw: state.draw
        }))
      );
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
    result.push({
      matchId: matches[i].matchId,
      size: matches[i].size
    });
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