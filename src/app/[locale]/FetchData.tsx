"use client";

import MyError from "@/components/Pages/MyError";
import {LoadingScreen} from "@/components/UI";
import {setGameList} from "@/libs/redux/features/gameList/gameListSlice";
import {setItemTypeList} from "@/libs/redux/features/itemTypeList/itemTypeListSlice";
import {useAppDispatch} from "@/libs/redux/hooks";
import GameService from "@/services/GameService";
import ItemTypeService from "@/services/ItemTypeService";
import {useEffect, useState} from "react";

interface Props {
    children: React.ReactNode;
}

export default function FetchData(props: Props) {
    const {children} = props;

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [gameListRes, itemTypeListRes] = await Promise.all([GameService.getAll(), ItemTypeService.getAll()]);

            if (gameListRes?.status === 200 && itemTypeListRes?.status === 200) {
                dispatch(setGameList(gameListRes.data));
                dispatch(setItemTypeList(itemTypeListRes.data));
                setLoading(false);
            } else {
                setError(new Error("Failed to fetch data"));
            }
        };

        fetchData();
    }, [dispatch]);

    if (loading) return <LoadingScreen />;

    if (error) return <MyError error={error} />;

    return children;
}
