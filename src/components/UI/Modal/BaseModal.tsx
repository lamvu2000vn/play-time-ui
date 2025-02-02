import MyTransition from "@/components/MyTransition";
import Backdrop from "../Backdrop";
import CloseButton from "../Buttons/CloseButton";

interface Props {
    children: React.ReactNode;
    show: boolean;
    closeButton?: boolean;
    closeByBackdrop?: boolean;
    width?: number;
    onClose: () => void;
}

export default function BaseModal(props: Props) {
    const handleClickOnBackdrop = () => {
        if (props.closeByBackdrop) {
            props.onClose();
        }
    };

    return (
        <>
            <Backdrop show={props.show} onClick={handleClickOnBackdrop} />
            <MyTransition
                in={props.show}
                timeout={300}
                className="fixed z-[1000] left-1/2 top-1/2 w-full max-w-[90%] h-max max-h-[90%] sm:max-h-[50rem] sm:w-max sm:max-w-full overflow-hidden bg-base-100 rounded-box flex"
                defaultStyles={{
                    width: props.width,
                    transform: "translate(-50%, -3rem)",
                    opacity: 0,
                    transition: "all 300ms ease-in-out",
                }}
                transitionStyles={{
                    entering: {transform: "translate(-50%, -50%)", opacity: 1},
                    entered: {transform: "translate(-50%, -50%)", opacity: 1},
                    exiting: {transform: "translate(-50%, calc(-50% - 3rem))", opacity: 0},
                    exited: {transform: "translate(-50%, calc(-50% - 3rem))", opacity: 0},
                    unmounted: {transform: "translate(-50%, calc(-50% - 3rem))", opacity: 0},
                }}
            >
                {props.closeButton && (
                    <div className="absolute right-1 top-1">
                        <CloseButton onClose={props.onClose} />
                    </div>
                )}
                <div className="flex-1 w-full">
                    <div className="pt-8 pb-6 w-full h-full">
                        <div className="px-8 w-full h-full overflow-auto">{props.children}</div>
                    </div>
                </div>
            </MyTransition>
        </>
    );
}
