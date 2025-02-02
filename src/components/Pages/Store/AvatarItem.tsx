import {CardImage, Price} from "@/components/UI";
import {useAuth} from "@/helpers/hooks/useAuth";
import {Item} from "@/helpers/shared/interfaces/commonInterface";

interface Props {
    item: Item;
    showPrice?: boolean;
    onClick?: (item: Item) => void;
}

export default function AvatarItem(props: Props) {
    const {item, showPrice, onClick} = props;
    const {auth} = useAuth();

    return (
        <CardImage key={item._id} onClick={() => onClick && onClick(item)}>
            <CardImage.Image src={item.imageUrl} />
            <CardImage.Content>
                <div className="tooltip tooltip-top tooltip-primary w-full" data-tip={item.name}>
                    <div className="text-center text-xl font-bold truncate">{item.name}</div>
                </div>
                {showPrice && (
                    <div className="flex items-center justify-center">
                        <Price price={item.price} userCoin={auth.user!.coin} />
                    </div>
                )}
            </CardImage.Content>
        </CardImage>
    );
}
