interface Props {
    children: React.ReactNode;
}

export default function Container(props: Props) {
    const {children} = props;

    return (
        <div className="w-full h-full p-6">
            <div className="w-full h-full flex items-stretch flex-row flex-wrap border-4 rounded-box">{children}</div>
        </div>
    );
}
