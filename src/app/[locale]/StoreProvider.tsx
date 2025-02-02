"use client";

import {RecoilRoot} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function StoreProvider(props: Props) {
    return <RecoilRoot>{props.children}</RecoilRoot>;
}
