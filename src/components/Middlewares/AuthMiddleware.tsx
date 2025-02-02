"use client";

import {useAuth} from "@/helpers/hooks/useAuth";
import AuthPage from "../Pages/Auth/AuthPage";
import {useEffect, useState} from "react";
import {usePathname} from "@/i18n/routing";
import AuthService from "@/services/AuthService";
import {UserInfo} from "@/helpers/shared/interfaces/commonInterface";

interface Props {
    children: React.ReactNode;
}

export default function AuthMiddleware(props: Props) {
    const {auth, logout, setAuth} = useAuth();
    const [component, setComponent] = useState<React.ReactNode | null>(null);
    const pathname = usePathname();

    const getUserInfo = async (): Promise<UserInfo | null> => {
        const response = await AuthService.getUserInfo();

        if (response?.status !== 200) return null;

        return response.data.user;
    };

    useEffect(() => {
        const fetchAndAuthenticateUser = async () => {
            if (!auth.isAuthenticated) {
                const user = await getUserInfo();

                if (user) {
                    setAuth({isAuthenticated: true, user});
                    setComponent(props.children);
                } else {
                    logout();
                    const openSection =
                        pathname === "/auth/login" ? "login" : pathname === "/auth/register" ? "register" : "login";

                    setComponent(<AuthPage openSection={openSection} />);
                }
            } else {
                setComponent(props.children);
            }
        };

        fetchAndAuthenticateUser();
    }, [auth.isAuthenticated, logout, pathname, props.children, setAuth]);

    return component;
}
