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
            className={`select w-full disabled:brightness-80
                ${invalidClass}
                ${props.className || ""}`}
        >
            {props.children}
        </select>
    );
}
