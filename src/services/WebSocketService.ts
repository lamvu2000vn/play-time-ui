import {ChatContent, CreateNewRoom} from "@/helpers/shared/interfaces/commonInterface";
import {FifteenPuzzlePlayerMovePayload} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {MemoryFinishTheMatchPayload, MemoryFlipCardUpPayload} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {
    CreateRoomData,
    JoinRoomPayload,
    TicTacToePlayerMovePayload,
    WSResponse,
    LeaveRoomPayload,
    RequestPlayAgainPayload,
    AcceptPlayAgainRequestPayload,
    RejectPlayAgainRequestPayload,
    MatchStatistics,
} from "@/helpers/shared/interfaces/wsInterface";
import socket from "@/libs/socket.io/socket";

export default class WebSocketService {
    static async createNewRoom<G>(gameSetups: CreateNewRoom<G>) {
        return (await socket.emitWithAck("createNewRoom", gameSetups)) as Promise<WSResponse<CreateRoomData>>;
    }

    static async cancelLookingForQuickMatch(roomId: string, userId: string) {
        return (await socket.emitWithAck("cancelLookingForQuickMatch", {
            roomId,
            userId,
        })) as Promise<WSResponse<object>>;
    }

    static async joinRoom(roomId: string, userId: string, availWidth: number) {
        const payload = {
            roomId,
            userId,
            availWidth,
        } as JoinRoomPayload;

        return (await socket.emitWithAck("joinRoom", payload)) as Promise<WSResponse<object>>;
    }

    static async readyForQuickMatch(roomId: string) {
        return (await socket.emitWithAck("readyForQuickMatch", {roomId})) as Promise<WSResponse<object>>;
    }

    static async leaveRoom(payload: LeaveRoomPayload) {
        return (await socket.emitWithAck("leaveRoom", payload)) as Promise<WSResponse<object>>;
    }

    static async requestPlayAgain(payload: RequestPlayAgainPayload) {
        return (await socket.emitWithAck("requestPlayAgain", payload)) as Promise<WSResponse<object>>;
    }

    static async acceptPlayAgainRequest(payload: AcceptPlayAgainRequestPayload) {
        return (await socket.emitWithAck("acceptPlayAgainRequest", payload)) as Promise<WSResponse<object>>;
    }

    static async rejectPlayAgainRequest(payload: RejectPlayAgainRequestPayload) {
        return (await socket.emitWithAck("rejectPlayAgainRequest", payload)) as Promise<WSResponse<object>>;
    }

    static async sendMessageInGame(roomId: string, message: ChatContent) {
        return (await socket.emitWithAck("sendMessageInGame", {
            roomId,
            message,
        })) as Promise<WSResponse<object>>;
    }

    static async ticTacToePlayerMove(payload: TicTacToePlayerMovePayload) {
        return (await socket.emitWithAck("ticTacToePlayerMove", payload)) as Promise<WSResponse<object>>;
    }

    static async matchDrawn(roomId: string, gameId: string) {
        return (await socket.emitWithAck("matchDrawn", {roomId, gameId})) as Promise<
            WSResponse<MatchStatistics | null>
        >;
    }

    // ======================== START 15 PUZZLE =============================

    static async fifteenPuzzlePlayerMove(payload: FifteenPuzzlePlayerMovePayload) {
        return (await socket.emitWithAck("fifteenPuzzlePlayerMove", payload)) as Promise<
            WSResponse<{isWin: boolean; matchStatistics: MatchStatistics | null}>
        >;
    }

    // ======================== END 15 PUZZLE =============================

    // ======================== START MEMORY =============================

    static async memoryFlipCardUp(payload: MemoryFlipCardUpPayload) {
        return (await socket.emitWithAck("memoryFlipCardUp", payload)) as Promise<WSResponse<object>>;
    }

    static async memoryFinishTheMatch(payload: MemoryFinishTheMatchPayload) {
        return (await socket.emitWithAck("memoryFinishTheMatch", payload)) as Promise<WSResponse<object>>;
    }

    // ======================== END MEMORY =============================
}
