"use client";

import {RecoilRoot} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function RecoilStoreProvider(props: Props) {
    return <RecoilRoot>{props.children}</RecoilRoot>;
}
