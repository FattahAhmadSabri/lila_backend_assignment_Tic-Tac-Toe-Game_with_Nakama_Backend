function createRoom(ctx, logger, nk, payload) {
  const matchId = nk.matchCreate("tictactoe");
  return JSON.stringify({ matchId });
}

function listRooms(ctx, logger, nk, payload) {
  const matches = nk.matchList(10, true, "tictactoe", null, 2);
  return JSON.stringify(matches.map(function(m) {
    return { matchId: m.matchId, size: m.size };
  }));
}

function findMatch(ctx, logger, nk, payload) {
  const matches = nk.matchList(10, true, "tictactoe", null, 2);
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].size === 1) {
      return JSON.stringify({ matchId: matches[i].matchId });
    }
  }
  const matchId = nk.matchCreate("tictactoe");
  return JSON.stringify({ matchId });
}

function InitModule(ctx, logger, nk, initializer) {
  logger.info("🔥 InitModule loaded");
  initializer.registerRpc("create_room", createRoom);
  initializer.registerRpc("list_rooms", listRooms);
  initializer.registerRpc("find_match", findMatch);
}