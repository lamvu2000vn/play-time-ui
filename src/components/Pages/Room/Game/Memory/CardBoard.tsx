import Card from "./Card";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    MemoryCard,
    MemoryCardState,
    MemoryFlipCardUpPayload,
    MemoryMatchResultsPayload,
} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {MemoryGameContext} from "@/helpers/contexts";
import WebSocketService from "@/services/WebSocketService";
import {WSCallbackFunc} from "@/helpers/shared/types";
import socket from "@/libs/socket.io/socket";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {
    changeCurrentTurn,
    increaseNumOfCardsOwned,
    selectMemoryMatchInfo,
} from "@/libs/redux/features/memoryMatchInfo/memoryMatchInfoSlice";
import {finishTheMatch, selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";

export default function CardBoard() {
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const myMatchInfo = useAppSelector(selectMemoryMatchInfo)!;
    const dispatch = useAppDispatch();
    const {playFlipCardSound, playCollectCardSound} = useContext(MemoryGameContext);

    const {myInfo, roomId} = baseMatchInfo;
    const {gameSetup, gameSpecialData} = myMatchInfo;
    const numOfCols = Math.sqrt(gameSetup.numOfCards);

    const [cardStates, setCardStates] = useState<MemoryCardState[]>(structuredClone(gameSpecialData.cardStates));
    const [openedCardStates, setOpenedCardStates] = useState<MemoryCardState[]>([]);
    const [shouldFinishTheMatch, setShouldFinishTheMatch] = useState<boolean>(false);

    const flipCardUp = useCallback(async (cardIndex: number) => {
        setCardStates((prevState) =>
            prevState.map((cardState, index) =>
                index === cardIndex
                    ? {
                          ...cardState,
                          flipStatus: "flipping",
                      }
                    : cardState
            )
        );

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setCardStates((prevState) =>
                    prevState.map((cardState, index) =>
                        index === cardIndex
                            ? {
                                  ...cardState,
                                  flipStatus: "flipped",
                              }
                            : cardState
                    )
                );

                resolve();
            }, 500);
        });
    }, []);

    const wsFlipCardUp = useCallback(
        async (cardIndex: number) => {
            WebSocketService.memoryFlipCardUp({
                roomId,
                playerId: myInfo._id,
                cardStateIndex: cardIndex,
            });
        },
        [myInfo._id, roomId]
    );

    const isFlipped = useCallback((cardState: MemoryCardState): boolean => {
        return cardState.flipStatus === "flipped";
    }, []);

    const flipCardDown = useCallback((cardId: string) => {
        setCardStates((prevState) =>
            prevState.map((cardState) =>
                cardState.card.id === cardId
                    ? {
                          ...cardState,
                          flipStatus: "none",
                      }
                    : cardState
            )
        );
    }, []);

    const hideCard = useCallback((cardId: string) => {
        setCardStates((prevState) =>
            prevState.map((cardState) =>
                cardState.card.id === cardId
                    ? {
                          ...cardState,
                          hidden: true,
                      }
                    : cardState
            )
        );
    }, []);

    const isSameCard = useCallback((card1: MemoryCard, card2: MemoryCard): boolean => {
        return card1.id === card2.id;
    }, []);

    const getCardsAvailable = useCallback(
        (): number => cardStates.filter((cardState) => !cardState.hidden).length,
        [cardStates]
    );

    const handleCardClick = useCallback(
        (index: number) => {
            if (openedCardStates.length === 2) return;

            const cardStateClone = structuredClone(cardStates[index]);

            setOpenedCardStates((prevState) => [...prevState, cardStateClone]);
            wsFlipCardUp(index);
        },
        [cardStates, openedCardStates.length, wsFlipCardUp]
    );

    // Listen to ws events
    useEffect(() => {
        const handleFlipCardUp = async (payload: MemoryFlipCardUpPayload, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "success", data: {}});

            const {cardStateIndex, playerId} = payload;
            const cardStateClone = structuredClone(cardStates[cardStateIndex]);

            if (playerId !== myInfo._id) {
                setOpenedCardStates((prevState) => [...prevState, cardStateClone]);
            }

            playFlipCardSound();
            flipCardUp(cardStateIndex).finally(() => {
                setOpenedCardStates((prevState) =>
                    prevState.map((cardState) =>
                        cardState.card.id === cardStateClone.card.id ? {...cardState, flipStatus: "flipped"} : cardState
                    )
                );
            });
        };

        const handleMatchResults = async (payload: MemoryMatchResultsPayload, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "success", data: {}});

            const {winnerId, matchStatistics} = payload;
            const myMatchStatistics = matchStatistics && matchStatistics[myInfo._id];

            dispatch(finishTheMatch({winnerId, myMatchStatistics}));
        };

        socket.on("memoryFlipCardUp", handleFlipCardUp);
        socket.on("memoryMatchResults", handleMatchResults);

        return () => {
            socket.off("memoryFlipCardUp", handleFlipCardUp);
            socket.off("memoryMatchResults", handleMatchResults);
        };
    }, [cardStates, dispatch, flipCardUp, myInfo._id, playFlipCardSound]);

    // Check two cards are the same and then finish the match
    useEffect(() => {
        if (openedCardStates.length === 2) {
            const [cardState1, cardState2] = openedCardStates;

            if (isFlipped(cardState1) && isFlipped(cardState2)) {
                const {card: card1} = cardState1;
                const {card: card2} = cardState2;
                const cardsAvailable = getCardsAvailable();
                let shouldFinishTheMatch = false;

                if (isSameCard(card1, card2)) {
                    dispatch(increaseNumOfCardsOwned());
                    hideCard(card1.id);
                    playCollectCardSound();
                    shouldFinishTheMatch = cardsAvailable - 2 === 0;
                } else {
                    flipCardDown(card1.id);
                    flipCardDown(card2.id);
                }

                if (shouldFinishTheMatch) {
                    setShouldFinishTheMatch(true);
                } else {
                    dispatch(changeCurrentTurn());
                }

                setOpenedCardStates([]);
            }
        }
    }, [
        dispatch,
        flipCardDown,
        getCardsAvailable,
        hideCard,
        isFlipped,
        isSameCard,
        openedCardStates,
        playCollectCardSound,
    ]);

    // Handle finish the match
    useEffect(() => {
        if (shouldFinishTheMatch && gameSpecialData.currentTurn === "me") {
            WebSocketService.memoryFinishTheMatch({
                roomId,
                playerId: myInfo._id,
                numOfMyCards: gameSpecialData.numOfMyCards,
                numOfOpponentCards: gameSpecialData.numOfOpponentCards,
            });
        }
    }, [
        myInfo._id,
        roomId,
        shouldFinishTheMatch,
        gameSpecialData.currentTurn,
        gameSpecialData.numOfMyCards,
        gameSpecialData.numOfOpponentCards,
    ]);

    return (
        <div
            className="
                portrait:basis-full
                portrait:order-1
                landscape:basis-3/5
                landscape:order-2
                2xl:landscape:basis-4/6"
        >
            <div className="w-full h-full flex items-center justify-center">
                <div className="aspect-square w-[80%] max-w-[42rem]">
                    <div
                        className="w-full h-full grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${numOfCols}, 1fr)`,
                            gridTemplateRows: `repeat(${numOfCols}, 1fr)`,
                        }}
                    >
                        {cardStates.map((cardState, index) => (
                            <Card key={index} index={index} cardState={cardState} onCardClick={handleCardClick} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
