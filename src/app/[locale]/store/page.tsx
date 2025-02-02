"use client";

import Layout from "@/components/Pages/Store/Layout";
import {CardImage} from "@/components/UI";
import {itemTypeListState} from "@/libs/recoil/atom";
import Link from "next/link";
import {useRecoilValue} from "recoil";

export default function Page() {
    const itemTypeList = useRecoilValue(itemTypeListState);

    return (
        <Layout>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6">
                {itemTypeList.map((itemType) => (
                    <Link key={itemType._id} href={`/store/${itemType.alternativeName}`}>
                        <CardImage>
                            <CardImage.Image src={itemType.imageUrl} />
                            <CardImage.Content>
                                <div className="text-center text-xl font-bold truncate">{itemType.name}</div>
                            </CardImage.Content>
                        </CardImage>
                    </Link>
                ))}
            </div>
        </Layout>
    );
}
