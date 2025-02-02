import {History, TransformedHistory} from "../shared/interfaces/commonInterface";

export const transformHistoryData = (history: History[], userId: string): TransformedHistory[] => {
    return history.map((value) => {
        const isPlayer1 = value.player1Id._id === userId;

        return {
            _id: value._id,
            gameId: value.gameId,
            roomId: value.roomId,
            myInfo: isPlayer1 ? value.player1Id : value.player2Id,
            opponentInfo: isPlayer1 ? value.player2Id : value.player1Id,
            myScore: isPlayer1 ? value.player1Score : value.player2Score,
            opponentScore: isPlayer1 ? value.player2Score : value.player1Score,
            drawCount: value.drawCount,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
        } as TransformedHistory;
    });
};
