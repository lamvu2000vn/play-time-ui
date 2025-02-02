import {forwardRef} from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default forwardRef(function Card(props: Props, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className={`p-4 sm:p-5 md:p-6 rounded-box bg-base-100 cursor-default shadow-custom-1 ${
                props.className || ""
            }`}
            style={props.style}
        >
            {props.children}
        </div>
    );
});
