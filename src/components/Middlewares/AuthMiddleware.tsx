"use client";

import AuthPage from "../Pages/Auth/AuthPage";
import {useCallback, useEffect, useState} from "react";
import {usePathname} from "@/i18n/routing";
import AuthService from "@/services/AuthService";
import {UserInfo} from "@/helpers/shared/interfaces/commonInterface";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {login, selectAuthState} from "@/libs/redux/features/auth/authSlice";

interface Props {
    children: React.ReactNode;
}

export default function AuthMiddleware(props: Props) {
    const {children} = props;

    const isAuthenticated = useAppSelector(selectAuthState);

    const [component, setComponent] = useState<React.ReactNode | null>(null);
    const pathname = usePathname();

    const dispatch = useAppDispatch();

    const getUserInfo = useCallback(async (): Promise<UserInfo | null> => {
        const response = await AuthService.getUserInfo();

        if (response?.status !== 200) return null;

        return response.data.user;
    }, []);

    useEffect(() => {
        const authOpenSection = pathname.includes("login")
            ? "login"
            : pathname.includes("register")
            ? "register"
            : "login";

        const check = async () => {
            if (isAuthenticated) return setComponent(children);

            const user = await getUserInfo();

            if (!user) return setComponent(<AuthPage openSection={authOpenSection} />);

            dispatch(login({user}));
            setComponent(children);
        };

        check();
    }, [children, dispatch, getUserInfo, isAuthenticated, pathname]);

    return component;
}
