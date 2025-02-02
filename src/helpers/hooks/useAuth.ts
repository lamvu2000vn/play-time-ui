"use client";

import {useRecoilState} from "recoil";
import {authState} from "@/libs/recoil/atom";
import {useCallback} from "react";
import LocalStorage from "../utils/LocalStorage";
import {UserInfo} from "../shared/interfaces/commonInterface";

export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState);

    const login = useCallback(
        (user: UserInfo, accessToken: string) => {
            setAuth({
                isAuthenticated: true,
                user,
            });
            LocalStorage.setAccessToken(accessToken);
        },
        [setAuth]
    );

    const logout = useCallback(() => {
        setAuth({
            isAuthenticated: false,
            user: null,
        });
        LocalStorage.removeAccessToken();
    }, [setAuth]);

    return {
        auth,
        setAuth,
        login,
        logout,
    };
};
