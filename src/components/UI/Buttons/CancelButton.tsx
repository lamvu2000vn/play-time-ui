import {useTranslations} from "next-intl";
import Button from "./Button";

interface Props {
    children?: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export default function CancelButton(props: Props) {
    const {children, onClick, className} = props;
    const translation = useTranslations("common");

    return (
        <Button type="button" className={`!bg-gray-400 ${className}`} onClick={onClick}>
            {children || translation("cancel")}
        </Button>
    );
}
