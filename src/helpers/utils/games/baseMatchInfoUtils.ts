import {PlayerTurn} from "../../shared/types";
import {BaseMatchInfo, MatchInfo, UserInfo} from "../../shared/interfaces/commonInterface";

export const initializeData = (matchInfo: MatchInfo, user: UserInfo): BaseMatchInfo => {
    const {hostInfo, joinerInfo, roomId} = matchInfo;
    const hostId = hostInfo._id;
    const isHost = hostId === user._id;

    return {
        roomId: roomId,
        myInfo: isHost ? hostInfo : joinerInfo,
        opponentInfo: isHost ? joinerInfo : hostInfo,
        winner: null,
        isDraw: false,
        matchStatus: "progressing",
    };
};

export const finishTheMatch = (baseMatchInfo: BaseMatchInfo, winnerId?: string): BaseMatchInfo => {
    // const copy = structuredClone(baseMatchInfo);
    // if (winnerId) {
    //     const winner: PlayerTurn = winnerId === copy.myInfo._id ? "me" : "opponent";
    //     copy.winner = winner;
    // } else {
    //     copy.isDraw = true;
    // }
    // copy.matchStatus = "completed";
    // return copy;

    const copy = {...baseMatchInfo};

    if (winnerId) {
        const winner: PlayerTurn = winnerId === baseMatchInfo.myInfo._id ? "me" : "opponent";
        copy.winner = winner;
    } else {
        copy.isDraw = true;
    }

    return copy;
};
