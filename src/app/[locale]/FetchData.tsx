"use client";

import MyError from "@/components/Pages/MyError";
import {LoadingScreen} from "@/components/UI";
import {gameListState, itemTypeListState} from "@/libs/recoil/atom";
import GameService from "@/services/GameService";
import ItemTypeService from "@/services/ItemTypeService";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function FetchData(props: Props) {
    const {children} = props;

    const [gameList, setGameList] = useRecoilState(gameListState);
    const [itemTypeList, setItemTypeList] = useRecoilState(itemTypeListState);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [gameListRes, itemTypeListRes] = await Promise.all([GameService.getAll(), ItemTypeService.getAll()]);

            if (gameListRes?.status === 200 && itemTypeListRes?.status === 200) {
                setGameList(gameListRes.data);
                setItemTypeList(itemTypeListRes.data);
                setLoading(false);
            } else {
                setError(new Error("Failed to fetch data"));
            }
        };

        if (gameList.length === 0 || itemTypeList.length === 0) {
            fetchData();
        }
    }, [gameList.length, itemTypeList.length, setGameList, setItemTypeList]);

    if (loading) return <LoadingScreen />;

    if (error) return <MyError error={error} />;

    return children;
}
