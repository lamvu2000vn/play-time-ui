"use client";

import {useRecoilState} from "recoil";
import {authState} from "@/libs/recoil/atom";
import {useCallback} from "react";
import {UserInfo} from "../shared/interfaces/commonInterface";

export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState);

    const login = useCallback(
        (user: UserInfo) => {
            setAuth({
                isAuthenticated: true,
                user,
            });
        },
        [setAuth]
    );

    const logout = useCallback(() => {
        setAuth({
            isAuthenticated: false,
            user: null,
        });
    }, [setAuth]);

    return {
        auth,
        setAuth,
        login,
        logout,
    };
};
