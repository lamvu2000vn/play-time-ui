import {CardImage, Price} from "@/components/UI";
import {useAuth} from "@/helpers/hooks/useAuth";
import {Item} from "@/helpers/shared/interfaces/commonInterface";

interface Props {
    item: Item;
    showPrice?: boolean;
    onClick?: (item: Item) => void;
}

export default function StickerItem(props: Props) {
    const {item, showPrice, onClick} = props;
    const {auth} = useAuth();

    return (
        <div className="pb-6">
            <CardImage onClick={() => onClick && onClick(item)}>
                <CardImage.GIFImage src={item.imageUrl} />
                <CardImage.Content>
                    {showPrice && (
                        <div className="flex items-center justify-center">
                            <Price price={item.price} userCoin={auth.user!.coin} />
                        </div>
                    )}
                </CardImage.Content>
            </CardImage>
        </div>
    );
}
