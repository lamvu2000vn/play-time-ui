interface Props {
    children: React.ReactNode;
}

export default function SidebarIcon(props: Props) {
    return <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">{props.children}</div>;
}
