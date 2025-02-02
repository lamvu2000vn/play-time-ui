"use client";

import {Container, ImageWithSkeleton, ItemSound} from "@/components/UI";
import {gameListState} from "@/libs/recoil/atom";
import {useRecoilValue} from "recoil";
import GameListSkeleton from "./GameListSkeleton";
import Link from "next/link";

export default function GameList() {
    const gameList = useRecoilValue(gameListState);

    if (gameList.length === 0) return <GameListSkeleton />;

    return (
        <Container>
            <div className="flex justify-center">
                <div className="w-full max-w-2xl grid gap-4 grid-cols-2 sm:grid-cols-3">
                    {gameList.map((gameInfo) => (
                        <Link
                            key={gameInfo._id}
                            href={`/game/${gameInfo.alternativeName}`}
                            className="cursor-pointer bg-base-100 shadow-custom-1 rounded-box p-4 transition-all duration-300 hover:scale-105"
                        >
                            <ItemSound>
                                <div className="flex flex-col gap-4">
                                    <div className="relative aspect-square">
                                        <ImageWithSkeleton src={gameInfo.imageUrl} fill />
                                    </div>
                                    <span className="text-2xl font-bold text-center w-full truncate">
                                        {gameInfo.name}
                                    </span>
                                </div>
                            </ItemSound>
                        </Link>
                    ))}
                </div>
            </div>
        </Container>
    );
}
