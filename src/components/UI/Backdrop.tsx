import MyTransition from "../MyTransition";

interface Props {
    show: boolean;
    className?: string;
    onClick?: () => void;
}

export default function Backdrop(props: Props) {
    return (
        <MyTransition
            in={props.show}
            timeout={300}
            className={`fixed z-[100] left-0 top-0 w-full h-full bg-neutral/80 ${props.className || ""}`}
            defaultStyles={{
                opacity: 0,
                transition: "all 300ms ease-in-out",
            }}
            transitionStyles={{
                entering: {opacity: 1},
                entered: {opacity: 1},
                exiting: {opacity: 0},
                exited: {opacity: 0},
                unmounted: {opacity: 0},
            }}
            onClick={props.onClick}
        />
    );
}
