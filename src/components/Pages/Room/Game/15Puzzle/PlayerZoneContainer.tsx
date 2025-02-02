interface Props {
    children: React.ReactNode;
}

export default function PlayerZoneContainer(props: Props) {
    const {children} = props;

    return (
        <div className="relative w-full h-full">
            <div className="w-full h-full flex justify-center items-stretch">
                <div className="w-full h-full flex flex-col max-w-[25rem] mx-8">{children}</div>
            </div>
        </div>
    );
}
