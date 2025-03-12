import {forwardRef} from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid: "true" | "false";
}

export default forwardRef(function TextArea(props: Props, ref: React.ForwardedRef<HTMLTextAreaElement>) {
    const invalidClass =
        props.invalid === "true"
            ? "border-red-400 focus:border-red-400 focus:outline-red-400 text-red-400 placeholder:text-red-400"
            : "";

    return (
        <textarea
            {...props}
            ref={ref}
            className={`w-full py-2 px-3 box-border outline-2 bg-transparent rounded-lg focus:outline
                focus:border-primary focus:outline-primary disabled:brightness-80 ${invalidClass} ${
                props.className || ""
            }`}
        />
    );
});
