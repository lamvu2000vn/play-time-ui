interface Props {
    children: React.ReactNode;
}

export default function Container(props: Props) {
    const {children} = props;

    return (
        <div className="w-full h-full p-6">
            <div className="w-full h-full flex items-stretch flex-row flex-wrap border-4 border-gray-300 rounded-2xl">
                {children}
            </div>
        </div>
    );
}
