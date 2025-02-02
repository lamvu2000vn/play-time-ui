import {moneyFormat} from "@/helpers/utils/moneyFormat";
import {MdAttachMoney} from "react-icons/md";

interface Props {
    price: number;
    userCoin: number;
    className?: string;
}

export default function Price(props: Props) {
    const textColor = props.userCoin >= props.price ? "text-green-400" : "text-red-400";

    return (
        <div className={`flex items-center text-xl font-semibold ${textColor} ${props.className || ""}`}>
            <span>{moneyFormat(props.price)}</span>
            <MdAttachMoney />
        </div>
    );
}
