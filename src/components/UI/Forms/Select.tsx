interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
    invalid: "true" | "false";
}

export default function Select(props: Props) {
    const invalidClass =
        props.invalid === "true" ? "border-red-400 focus:border-red-400 focus:outline-red-400 text-red-400" : "";

    return (
        <select
            {...props}
            className={`relative py-2 px-3 w-full border-2 outline-2 !outline-offset-0 self-center bg-transparent rounded-full
                focus:border-primary focus:outline focus:outline-primary disabled:brightness-80
                ${invalidClass}
                ${props.className || ""}`}
        >
            {props.children}
        </select>
    );
}
