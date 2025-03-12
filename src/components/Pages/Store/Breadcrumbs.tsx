"use client";

import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useMemo, useState} from "react";
import {MdKeyboardArrowRight} from "react-icons/md";

type ChangeCrumbFunc = (crumbIndex: number) => void;

interface Crumb {
    href: string;
    displayName: string;
}

export default function Breadcrumbs() {
    const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);
    const pathname = usePathname();
    const page = useTranslations("page.store");

    const storeBreadcrumbs: {
        store: Crumb;
        sticker: Crumb;
        avatar: Crumb;
    } = useMemo(
        () => ({
            store: {
                href: "/store",
                displayName: page("breadcrumb.root"),
            },
            sticker: {
                href: "/store/sticker",
                displayName: "Sticker",
            },
            avatar: {
                href: "/store/avatar",
                displayName: "Avatar",
            },
        }),
        [page]
    );

    const lastIndex = breadcrumbs.length - 1;

    const handleChangeCrumb: ChangeCrumbFunc = (crumbIndex: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, crumbIndex + 1);
        setBreadcrumbs(newBreadcrumbs);
    };

    useEffect(() => {
        if (pathname.includes("store/sticker")) {
            setBreadcrumbs([storeBreadcrumbs.store, storeBreadcrumbs.sticker]);
        } else if (pathname.includes("store/avatar")) {
            setBreadcrumbs([storeBreadcrumbs.store, storeBreadcrumbs.avatar]);
        } else {
            setBreadcrumbs([storeBreadcrumbs.store]);
        }
    }, [pathname, storeBreadcrumbs.avatar, storeBreadcrumbs.sticker, storeBreadcrumbs.store]);

    return (
        <div className="px-3 h-12 rounded-lg bg-base-100 w-max max-w-full">
            <div className="overflow-auto h-full flex items-stretch">
                <ul className="flex items-center list-none">
                    {breadcrumbs.map((crumb, index) => (
                        <Fragment key={index}>
                            <li
                                className={`shrink-0 flex items-center gap-2 text-sm cursor-pointer hover:underline ${
                                    index === lastIndex ? "text-primary font-semibold" : ""
                                }`}
                                onClick={() => handleChangeCrumb(index)}
                            >
                                <Link href={crumb.href}>{crumb.displayName}</Link>
                            </li>
                            <li className="mx-2 text-gray-400 flex items-center w-5 h-5 last:hidden">
                                <MdKeyboardArrowRight />
                            </li>
                        </Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
}
