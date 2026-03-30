const InitModule = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

    const matchInit = (ctx: any, params: any) => {
        return {
            state: {
                board: ["","","","","","","","",""],
                players: [],
                turn: 1
            },
            tickRate: 1,
            label: "tictactoe"
        };
    };

    const matchJoin = (ctx: any, dispatcher: any, tick: number, state: any, presence: any) => {
        if (state.players.length >= 2) return null;

        state.players.push(presence);
        return { state };
    };

    const checkWinner = (board: string[]) => {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        for (const [a,b,c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const matchLoop = (ctx: any, dispatcher: any, tick: number, state: any, messages: any[]) => {

        for (const msg of messages) {

            const data = JSON.parse(msg.data);
            const index = data.index;

            if (state.board[index] !== "") return { state };

            const symbol = state.turn === 1 ? "X" : "O";
            state.board[index] = symbol;

            const winner = checkWinner(state.board);

            if (winner) {
                dispatcher.broadcastMessage(1, JSON.stringify({
                    board: state.board,
                    winner
                }));
                return null;
            }

            state.turn = state.turn === 1 ? 2 : 1;

            dispatcher.broadcastMessage(1, JSON.stringify({
                board: state.board,
                turn: state.turn
            }));
        }

        return { state };
    };

    nk.matchCreate("tictactoe", {
        matchInit,
        matchJoin,
        matchLoop
    });
};

!InitModule;