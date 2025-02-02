interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    outlinebutton?: "true" | "false";
}

export default function Button(props: Props) {
    const outlineBtnClass =
        props.outlinebutton === "true"
            ? "border-2 border-primary bg-base-100 text-primary hover:bg-primary hover:text-base-100"
            : "bg-primary text-base-100";

    return (
        <button
            {...props}
            className={`px-5 py-3 rounded-full font-semibold hover:brightness-95
                active:scale-95 disabled:cursor-default disabled:opacity-80 disabled:hover:brightness-100
                disabled:active:scale-100 transition-transform relative ${outlineBtnClass} ${props.className || ""}`}
        >
            {props.children}
        </button>
    );
}
