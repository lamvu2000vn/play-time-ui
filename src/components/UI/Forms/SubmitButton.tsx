import {useTranslations} from "next-intl";
import Button from "../Buttons/Button";

interface Props {
    type?: "submit" | "reset" | "button";
    label?: string;
    icon?: React.ReactNode;
    className?: string;
    isSubmitting: boolean;
    onClick?: () => void;
}

export default function SubmitButton(props: Props) {
    const {type, label, icon, isSubmitting, onClick, className} = props;
    const translation = useTranslations("common");
    const labelTranslation = label ? label : translation("submit");

    return (
        <Button
            type={type || "submit"}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 ${className || ""}`}
            onClick={onClick}
        >
            {isSubmitting ? (
                <>
                    <span className="loading loading-spinner text-base-100 loading-sm" />
                    {labelTranslation}...
                </>
            ) : (
                <>
                    {icon}
                    {labelTranslation}
                </>
            )}
        </Button>
    );
}
