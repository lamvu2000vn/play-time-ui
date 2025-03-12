"use client";

import {Button, Container, DividerBar, ImageWithSkeleton} from "@/components/UI";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FaClipboardCheck, FaCopy, FaKey} from "react-icons/fa";

export default function Page() {
    const user = useAppSelector(selectUser);

    const [showSuccessCopy, setShowSuccessCopy] = useState<boolean>(false);
    const translation = useTranslations("page.account");

    const handleCopyUserId = () => {
        navigator.clipboard
            .writeText(user._id)
            .then(() => {
                setShowSuccessCopy(true);
            })
            .catch((error) => {
                console.log("🚀 ~ handleCopyUserId ~ error:", error);
            });
    };

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (showSuccessCopy) {
            timerId = setTimeout(() => {
                setShowSuccessCopy(false);
            }, 5000);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [showSuccessCopy]);

    return (
        <Container>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{translation("title")}</h1>
            </div>
            <div className="rounded-2xl border-4 border-base-300 bg-base-100 overflow-hidden">
                <div className="relative pt-12 bg-base-300">
                    <div className="relative flex justify-center">
                        <div className="basis-1/4">
                            <div className="w-full relative aspect-square rounded-full overflow-hidden group/avatar">
                                <div className="absolute z-10 left-0 top-0 w-full h-full bg-gradient-to-r from-primary to-accent"></div>
                                <div className="relative m-1 z-20 aspect-square rounded-full overflow-hidden">
                                    <ImageWithSkeleton src={user.avatarUrl} fill />
                                </div>
                                <div className="absolute z-30 left-0 top-0 w-full h-full scale-0 rounded-full transition-all duration-300 group-hover/avatar:scale-100 flex bg-primary items-center justify-center cursor-pointer">
                                    <Link
                                        href="/store/avatar?section=paidItems"
                                        className="font-semibold text-neutral text-base sm:text-xl"
                                    >
                                        {translation("changeProfileImageBtn")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-0 top-0 w-full h-1/2 bg-base-300"></div>
                        <div className="absolute left-0 bottom-0 w-full h-1/2 bg-base-100"></div>
                    </div>
                </div>
                <div className="p-8 sm:p-10 md:p-12 lg:px-20">
                    <div className="flex flex-col items-stretch gap-4">
                        <Item>
                            <Item.Label text={translation("displayName")} />
                            <Item.Content>
                                <div className="p-2">{user.name}</div>
                            </Item.Content>
                        </Item>
                        <Item>
                            <Item.Label text="ID" />
                            <Item.Content>
                                <div className="w-full flex items-center">
                                    <div className="p-2 flex-1 shrink truncate">{user._id}</div>
                                    <div className="basis-10 shrink-0">
                                        <Button
                                            type="button"
                                            className="!px-0 w-full rounded-lg rounded-tl-none rounded-bl-none flex items-center justify-center"
                                            onClick={handleCopyUserId}
                                        >
                                            {showSuccessCopy ? <FaClipboardCheck /> : <FaCopy />}
                                        </Button>
                                    </div>
                                </div>
                            </Item.Content>
                        </Item>
                        <Item>
                            <Item.Label text={translation("password")} />
                            <Item.Content>
                                <Button
                                    type="button"
                                    className="w-full !py-2 rounded-lg flex items-center justify-center gap-2"
                                    outlinebutton="true"
                                >
                                    <FaKey />
                                    {translation("changePasswordBtn")}
                                </Button>
                            </Item.Content>
                        </Item>
                        <DividerBar className="my-3" />
                        <div className="text-sm">
                            <h1 className="mb-2 font-semibold text-lg">{translation("deleteAccountTitle")}</h1>
                            <div className="mb-3 text-justify">{translation("deleteAccountDescription")}</div>
                            <Button type="button" className="rounded-lg !py-2 !px-2" outlinebutton="true">
                                {translation("deleteAccountBtn")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

function Item({children}: {children: React.ReactNode}) {
    return <div className="flex items-center gap-4">{children}</div>;
}

function Label({text}: {text: string}) {
    return <div className="font-semibold text-base basis-[7rem] shrink-0">{text}</div>;
}

function Content({children}: {children: React.ReactNode}) {
    return <div className="bg-base-200 rounded-lg flex-1 shrink overflow-hidden">{children}</div>;
}

Item.Label = Label;
Item.Content = Content;
