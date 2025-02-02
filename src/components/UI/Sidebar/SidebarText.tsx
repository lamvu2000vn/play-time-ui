interface Props {
    children: React.ReactNode;
}

export default function SidebarText(props: Props) {
    return (
        <div className="flex-1 h-14 px-2 flex items-center overflow-hidden">
            <span className="text-base w-full truncate">{props.children}</span>
        </div>
    );
}
