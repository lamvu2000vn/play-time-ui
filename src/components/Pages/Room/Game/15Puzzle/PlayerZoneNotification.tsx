import MyTransition from "@/components/MyTransition";
import {PlayerTurn} from "@/helpers/shared/types";
import {useTranslations} from "next-intl";

interface Props {
    show: boolean;
    owner: PlayerTurn;
}

export default function PlayerZoneNotification(props: Props) {
    const {show, owner} = props;
    const translation = useTranslations("page.room");

    const content = owner === "me" ? translation("youHere") : translation("opponentHere");

    return (
        <MyTransition
            in={show}
            timeout={500}
            className="absolute left-0 top-0 w-full h-full z-10 bg-neutral/95"
            defaultStyles={{
                opacity: 0,
                transition: "all 500ms linear",
            }}
            transitionStyles={{
                entering: {opacity: 1},
                entered: {opacity: 1},
                exiting: {opacity: 0},
                exited: {opacity: 0},
                unmounted: {opacity: 0},
            }}
        >
            <div className="w-full h-full flex items-center justify-center">
                <div className="font-bold text-3xl lg:text-4xl text-neutral-content animate__animated animate__pulse animate__infinite">
                    {content}
                </div>
            </div>
        </MyTransition>
    );
}
