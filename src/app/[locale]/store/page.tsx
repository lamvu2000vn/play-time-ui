"use client";

import Layout from "@/components/Pages/Store/Layout";
import {CardImage} from "@/components/UI";
import {useAppSelector} from "@/libs/redux/hooks";
import Link from "next/link";

export default function Page() {
    const itemTypeList = useAppSelector((state) => state.itemTypeList);

    return (
        <Layout>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
