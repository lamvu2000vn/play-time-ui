import {useEffect, useState} from "react";

export enum ElementAvailable {
    Notification = "notification",
    UserInfoSidebar = "userInfoSidebar",
    ChatBox = "chatBox",
}

interface State {
    show: boolean;
}

type ShowState = Record<ElementAvailable, {[key: string]: State}>;

export default function useElementShowState() {
    const [showState, setShowState] = useState<ShowState>({
        notification: {},
        userInfoSidebar: {},
        chatBox: {},
    });

    const addElement = (element: ElementAvailable, id: string, state: State) => {
        if (!showState[element][id]) {
            setShowState((prevState) => ({
                ...prevState,
                [element]: {
                    ...prevState[element],
                    [id]: state,
                },
            }));
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const newState = {...showState};
            let isChanged = false;

            for (const [element, states] of Object.entries(showState)) {
                for (const [id, state] of Object.entries(states)) {
                    if (document.querySelector(`[id="${id}"][data-trigger-popup="${element}"]`)?.contains(target)) {
                        newState[element as ElementAvailable][id] = {
                            show: !state.show,
                        };

                        isChanged = true;
                        break;
                    }

                    if (
                        newState[element as ElementAvailable][id].show &&
                        !document
                            .querySelector(`[data-popup-id="${id}"][data-popup-element="${element}"]`)
                            ?.contains(target)
                    ) {
                        newState[element as ElementAvailable][id] = {
                            show: false,
                        };
                        isChanged = true;
                        break;
                    }
                }
            }

            if (isChanged) {
                setShowState(newState);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showState]);

    return {
        showState,
        addElement,
    };
}
