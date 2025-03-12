import {CardImage, Price} from "@/components/UI";
import {Item} from "@/helpers/shared/interfaces/commonInterface";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {useAppSelector} from "@/libs/redux/hooks";

interface Props {
    item: Item;
    showPrice?: boolean;
    onClick?: (item: Item) => void;
}

export default function StickerItem(props: Props) {
    const {item, showPrice, onClick} = props;
    const user = useAppSelector(selectUser);

    return (
        <div className="pb-6">
            <CardImage onClick={() => onClick && onClick(item)}>
                <CardImage.GIFImage src={item.imageUrl} />
                <CardImage.Content>
                    {showPrice && (
                        <div className="flex items-center justify-center">
                            <Price price={item.price} userCoin={user.coin} />
                        </div>
                    )}
                </CardImage.Content>
            </CardImage>
        </div>
    );
}
