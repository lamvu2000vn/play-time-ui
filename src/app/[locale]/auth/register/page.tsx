"use client";

import AuthPage from "@/components/Pages/Auth/AuthPage";
import {LoadingScreen} from "@/components/UI";
import {useRouter} from "@/i18n/routing";
import {selectAuthState} from "@/libs/redux/features/auth/authSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {useEffect, useState} from "react";

export default function Page() {
    const isAuthenticated = useAppSelector(selectAuthState);
    const router = useRouter();
    const [content, setContent] = useState<React.ReactNode>(<LoadingScreen />);

    useEffect(() => {
        if (!isAuthenticated) return setContent(<AuthPage openSection="register" />);

        if (document.referrer.includes("auth")) return router.push("/");

        return router.back();
    }, [isAuthenticated, router]);

    return content;
}
