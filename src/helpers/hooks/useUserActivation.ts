import {useState, useEffect} from "react";

const useUserActivation = () => {
    const [isUserActive, setIsUserActive] = useState(false);

    useEffect(() => {
        const handleUserAction = () => {
            setIsUserActive(navigator.userActivation.hasBeenActive);
        };

        window.addEventListener("click", handleUserAction);
        window.addEventListener("keydown", handleUserAction);

        return () => {
            window.removeEventListener("click", handleUserAction);
            window.removeEventListener("keydown", handleUserAction);
        };
    }, []);

    return isUserActive;
};

export default useUserActivation;
