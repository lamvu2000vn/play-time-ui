import MyTransition from "@/components/MyTransition";
import {PlayerTurn} from "@/helpers/shared/types";
import {useTranslations} from "next-intl";

interface Props {
    show: boolean;
    firstTurn: PlayerTurn;
}

export default function FirstTurnToast(props: Props) {
    const {firstTurn, show} = props;
    const translation = useTranslations("page.room");

    return (
        <MyTransition
            in={show}
            timeout={300}
            className="absolute left-1/2 top-12 -translate-x-1/2 z-[1000]"
            defaultStyles={{
                opacity: 0,
                transition: "opacity 300ms ease-in-out",
            }}
            transitionStyles={{
                entering: {opacity: 1},
                entered: {opacity: 1},
                exiting: {opacity: 0},
                exited: {opacity: 0},
                unmounted: {opacity: 0},
            }}
        >
            <h1 className="text-3xl font-black text-orange-500 animate__animated animate__pulse animate__infinite">
                {translation(firstTurn === "me" ? "youAreFirstTurn" : "opponentIsFirstTurn")}
            </h1>
        </MyTransition>
    );
}
