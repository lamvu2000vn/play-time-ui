import Item from "../Item";

interface Props {
    children: React.ReactNode;
    title?: string;
    onClick?: () => void;
}

export default function SidebarItem(props: Props) {
    return (
        <Item
            title={props.title}
            className="w-full h-16 flex items-center cursor-pointer overflow-hidden rounded-none"
            onClick={props.onClick}
        >
            {props.children}
        </Item>
    );
}
