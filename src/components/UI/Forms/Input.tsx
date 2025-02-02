import {forwardRef} from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange?: React.ChangeEventHandler;
    onBlur?: React.ChangeEventHandler;
    icon?: React.ReactNode;
    invalid?: "true" | "false";
}

export default forwardRef(function Input(props: Props, ref: React.ForwardedRef<HTMLInputElement>) {
    const px = props.icon ? "pl-12 pr-5" : "px-3";
    const invalidClass =
        props.invalid === "true"
            ? "border-red-400 focus:border-red-400 focus:outline-red-400 text-red-400 placeholder:text-red-400"
            : "";

    return (
        <div className={`relative w-full ${props.invalid === "true" ? "text-red-400" : ""}`}>
            {props.icon && (
                <div className="absolute z-10 left-0 top-0 w-12 h-full">
                    <div className="w-full h-full flex items-center justify-center">{props.icon}</div>
                </div>
            )}

            <input
                ref={ref}
                {...props}
                className={`relative w-full py-2 ${px} box-border border-2 outline-2 bg-transparent rounded-full focus:outline focus:border-primary focus:outline-primary disabled:brightness-80 ${invalidClass} ${
                    props.className || ""
                }`}
            />
        </div>
    );
});
