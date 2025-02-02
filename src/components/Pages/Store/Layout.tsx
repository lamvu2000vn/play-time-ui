"use client";

import Breadcrumbs from "./Breadcrumbs";
import {FaStoreSlash} from "react-icons/fa";
import {Container, UserCoin} from "@/components/UI";

interface Props {
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    return (
        <Container>
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex-1 overflow-auto">
                    <Breadcrumbs />
                </div>
                <UserCoin size="md" />
            </div>
            {props.children}
        </Container>
    );
}

export const EmptyStore = ({message}: {message: string}) => {
    return (
        <div className="flex items-center justify-center w-full h-56 bg-base-100 rounded-2xl">
            <div className="flex flex-col items-center gap-3 text-gray-500">
                <FaStoreSlash className="w-14 h-14" />
                <span>{message}</span>
            </div>
        </div>
    );
};
