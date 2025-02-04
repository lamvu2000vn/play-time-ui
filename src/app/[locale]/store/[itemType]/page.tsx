"use client";

import AvatarSection from "@/components/Pages/Store/AvatarSection";
import StickerSection from "@/components/Pages/Store/StickerSection";
import Layout, {EmptyStore} from "@/components/Pages/Store/Layout";
import {useAuth} from "@/helpers/hooks/useAuth";
import {Item, PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import {ItemType} from "@/helpers/shared/types";
import {itemTypeListState} from "@/libs/recoil/atom";
import ItemTypeService from "@/services/ItemTypeService";
import UserService from "@/services/UserService";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {useTranslations} from "next-intl";

interface Props {
    params: {
        itemType: ItemType;
    };
}

export default function Page(props: Props) {
    const {params} = props;
    const searchParams = useSearchParams();
    const itemSection = searchParams.get("section");
    const pageTranslation = useTranslations("page.store");

    const itemTypeList = useRecoilValue(itemTypeListState);
    const {auth} = useAuth();
    const [itemList, setItemList] = useState<Item[]>([]);
    const [paidItems, setPaidItems] = useState<PaidItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const typeId = itemTypeList.find((itemType) => itemType.alternativeName === props.params.itemType)?._id;

        if (!typeId) {
            setError(pageTranslation("error.itemNotFound"));
            setLoading(false);
            return;
        }

        (async () => {
            const [allItemsResponse, paidItemsResponse] = await Promise.all([
                ItemTypeService.getAllItems(typeId),
                UserService.getPaidItems(auth.user!._id, typeId),
            ]);

            if (
                !allItemsResponse ||
                allItemsResponse.status !== 200 ||
                allItemsResponse.data.length === 0 ||
                !paidItemsResponse ||
                paidItemsResponse.status !== 200 ||
                paidItemsResponse.data.length === 0
            ) {
                setError(pageTranslation("error.cannotGetItemList"));
                setLoading(false);
                return;
            }

            const allItems = allItemsResponse.data;
            const paidItems = paidItemsResponse.data;
            const allItemsFiltered = allItems.filter(
                (item) => paidItems.findIndex((paidItem) => paidItem.itemId._id === item._id) === -1
            );

            setPaidItems(paidItemsResponse.data);
            setItemList(allItemsFiltered);
            setLoading(false);
        })();
    }, [auth, itemTypeList, pageTranslation, props.params.itemType]);

    if (loading) {
        return (
            <Layout>
                <Skeleton />
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <EmptyStore message={error} />
            </Layout>
        );
    }

    return (
        <Layout>
            {params.itemType === "avatar" ? (
                <AvatarSection itemList={itemList} paidItems={paidItems} itemSection={itemSection} />
            ) : params.itemType === "sticker" ? (
                <StickerSection itemList={itemList} paidItems={paidItems} itemSection={itemSection} />
            ) : (
                <EmptyStore message="Không có vật phẩm" />
            )}
        </Layout>
    );
}

const Skeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="skeleton aspect-square"></div>
                <div className="skeleton h-8"></div>
            </div>
        </div>
    );
};
