interface Props {
    className?: string;
}

export default function DividerBar(props: Props) {
    return <div className={`divider ${props.className || ""}`}></div>;
}
