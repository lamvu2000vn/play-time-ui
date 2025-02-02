"use client";

import AuthPage from "@/components/Pages/Auth/AuthPage";
import {useAuth} from "@/helpers/hooks/useAuth";
import {useRouter} from "next/navigation";

export default function Page() {
    const {auth} = useAuth();
    const router = useRouter();

    if (!auth.isAuthenticated) {
        return <AuthPage openSection="register" />;
    }

    return router.back();
}
