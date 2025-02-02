interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Container(props: Props) {
    return (
        <div
            className={`px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 max-w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto over ${
                props.className || ""
            }`}
        >
            {props.children}
        </div>
    );
}
