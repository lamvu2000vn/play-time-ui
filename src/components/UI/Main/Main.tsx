interface Props {
    children: React.ReactNode;
}

export default function Main(props: Props) {
    return <main className="flex-1 w-full h-full overflow-auto">{props.children}</main>;
}
