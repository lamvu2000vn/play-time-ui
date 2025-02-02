interface Props {
    children: React.ReactNode;
}

export default function Container(props: Props) {
    const {children} = props;

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full aspect-square">
                <div className="grid grid-cols-4 gap-2">{children}</div>
            </div>
        </div>
    );
}
