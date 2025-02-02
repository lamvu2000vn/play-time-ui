"use client";

import {useCallback, useEffect, useState} from "react";
import LoginSection from "../../../components/Pages/Auth/LoginSection";
import RegisterSection from "../../../components/Pages/Auth/RegisterSection";
import {useRouter} from "next/navigation";

const duration = 500;

const defaultStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translate(-50%, calc(-50% - 4rem))",
    transition: "all 500ms ease-in-out",
};

const transitionStyles: {
    entering: React.CSSProperties;
    entered: React.CSSProperties;
    exiting: React.CSSProperties;
    exited: React.CSSProperties;
    unmounted: React.CSSProperties;
} = {
    entering: {
        opacity: 1,
        transform: "translate(-50%, -50%)",
    },
    entered: {
        opacity: 1,
        transform: "translate(-50%, -50%)",
    },
    exiting: {
        opacity: 0,
        transform: "translate(-50%, calc(-50% - 4rem))",
    },
    exited: {
        opacity: 0,
        transform: "translate(-50%, calc(-50% - 4rem))",
    },
    unmounted: {
        opacity: 0,
        transform: "translate(-50%, calc(-50% - 4rem))",
    },
};

interface Props {
    openSection: "login" | "register";
}

export default function AuthPage(props: Props) {
    const [showLoginSection, setShowLoginSection] = useState<boolean>(false);
    const [showRegisterSection, setShowRegisterSection] = useState<boolean>(false);
    const router = useRouter();

    const handleShowLogin = useCallback(() => {
        router.replace("/auth/login");
        setShowLoginSection(true);
        setShowRegisterSection(false);
    }, [router]);

    const handleShowRegister = useCallback(() => {
        router.replace("/auth/register");
        setShowLoginSection(false);
        setShowRegisterSection(true);
    }, [router]);

    useEffect(() => {
        if (props.openSection === "login") {
            handleShowLogin();
        } else {
            handleShowRegister();
        }
    }, [handleShowLogin, handleShowRegister, props.openSection]);

    return (
        <div className="fixed left-0 top-0 w-full h-full">
            <div className="w-full h-full bg-image bg-[url('/assets/images/backgrounds/auth-background.jpg')] bg-cover bg-no-repeat bg-left sm:bg-center" />
            <div className="absolute left-0 top-0 right-0 lg:right-1/2 h-full">
                <LoginSection
                    show={showLoginSection}
                    transition={{timeout: duration, defaultStyle, transitionStyles}}
                    onShowRegister={handleShowRegister}
                />
                <RegisterSection
                    show={showRegisterSection}
                    transition={{timeout: duration, defaultStyle, transitionStyles}}
                    onShowLogin={handleShowLogin}
                />
            </div>
        </div>
    );
}
