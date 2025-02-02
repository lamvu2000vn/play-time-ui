import {baseMatchInfoState, memoryMatchInfoState} from "@/libs/recoil/atom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import Card from "./Card";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    MemoryCard,
    MemoryCardState,
    MemoryFlipCardUpPayload,
    MemoryMatchResultsPayload,
} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {GameContext, MemoryGameContext} from "@/helpers/contexts";
import WebSocketService from "@/services/WebSocketService";
import {MemoryMatchInfo, PlayerTurn, WSCallbackFunc} from "@/helpers/shared/types";
import socket from "@/libs/socket.io/socket";
import {finishTheMatch} from "@/helpers/utils/games/baseMatchInfoUtils";

export default function CardBoard() {
    const {myInfo, roomId} = useRecoilValue(baseMatchInfoState)!;
    const setBaseMatchInfo = useSetRecoilState(baseMatchInfoState);
    const [myMatchInfo, setMyMatchInfo] = useRecoilState(memoryMatchInfoState);
    const {playFlipCardSound, playCollectCardSound} = useContext(MemoryGameContext);
    const {onSetMyMatchStatistics} = useContext(GameContext);

    const {game} = myMatchInfo!;
    const {gameSetup, specialData} = game;
    // console.log("🚀 ~ CardBoard ~ specialData:", specialData);
    const numOfCols = Math.sqrt(gameSetup.numOfCards);

    const [cardStates, setCardStates] = useState<MemoryCardState[]>(structuredClone(specialData.cardStates));
    // console.log("🚀 ~ CardBoard ~ cardStates:", cardStates);
    const [openedCardStates, setOpenedCardStates] = useState<MemoryCardState[]>([]);
    const [shouldFinishTheMatch, setShouldFinishTheMatch] = useState<boolean>(false);

    const changeCurrentTurn = useCallback((prevState: MemoryMatchInfo, nextTurn: PlayerTurn): MemoryMatchInfo => {
        return {
            ...prevState,
            game: {
                ...prevState.game,
                specialData: {
                    ...prevState.game.specialData,
                    currentTurn: nextTurn,
                },
            },
        };
    }, []);

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

    const increaseNumOfCardsOwned = useCallback(
        (playerTurn: PlayerTurn) => {
            setMyMatchInfo((prevState) => ({
                ...prevState!,
                game: {
                    ...prevState!.game,
                    specialData: {
                        ...prevState!.game.specialData,
                        numOfMyCards: prevState!.game.specialData.numOfMyCards + (playerTurn === "me" ? 1 : 0),
                        numOfOpponentCards:
                            prevState!.game.specialData.numOfOpponentCards + (playerTurn === "opponent" ? 1 : 0),
                    },
                },
            }));
        },
        [setMyMatchInfo]
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
            const myMatchStatistics = matchStatistics[myInfo._id];

            setBaseMatchInfo((prevState) => finishTheMatch(prevState!, winnerId));
            onSetMyMatchStatistics(myMatchStatistics);
        };

        socket.on("memoryFlipCardUp", handleFlipCardUp);
        socket.on("memoryMatchResults", handleMatchResults);

        return () => {
            socket.off("memoryFlipCardUp", handleFlipCardUp);
            socket.off("memoryMatchResults", handleMatchResults);
        };
    }, [
        cardStates,
        flipCardUp,
        myInfo._id,
        onSetMyMatchStatistics,
        openedCardStates.length,
        playFlipCardSound,
        setBaseMatchInfo,
    ]);

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
                    increaseNumOfCardsOwned(specialData.currentTurn);
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
                    setMyMatchInfo((prevState) =>
                        changeCurrentTurn(
                            prevState!,
                            prevState!.game.specialData.currentTurn === "me" ? "opponent" : "me"
                        )
                    );
                }

                setOpenedCardStates([]);
            }
        }
    }, [
        changeCurrentTurn,
        flipCardDown,
        getCardsAvailable,
        hideCard,
        increaseNumOfCardsOwned,
        isFlipped,
        isSameCard,
        openedCardStates,
        playCollectCardSound,
        setMyMatchInfo,
        specialData.currentTurn,
    ]);

    // Handle finish the match
    useEffect(() => {
        if (shouldFinishTheMatch && specialData.currentTurn === "me") {
            WebSocketService.memoryFinishTheMatch({
                roomId,
                playerId: myInfo._id,
                numOfMyCards: specialData.numOfMyCards,
                numOfOpponentCards: specialData.numOfOpponentCards,
            });
        }
    }, [
        myInfo._id,
        roomId,
        shouldFinishTheMatch,
        specialData.currentTurn,
        specialData.numOfMyCards,
        specialData.numOfOpponentCards,
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
