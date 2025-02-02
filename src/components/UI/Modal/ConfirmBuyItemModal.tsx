import {memo} from "react";
import BaseModal from "./BaseModal";
import {Item} from "@/helpers/shared/interfaces/commonInterface";
import Button from "../Buttons/Button";
import {ItemType} from "@/helpers/shared/types";
import AvatarItem from "@/components/Pages/Store/AvatarItem";
import StickerItem from "@/components/Pages/Store/StickerItem";
import {useTranslations} from "next-intl";

interface Props {
    show: boolean;
    item: Item | null;
    type: ItemType;
    onClose: () => void;
}

export default memo(function ConfirmBuyItemModal(props: Props) {
    const {show, item, type, onClose} = props;
    const translation = useTranslations("common.modal.confirmBuyItemModal");
    const commonTranslation = useTranslations("common");

    if (!item) return null;

    return (
        <BaseModal show={show} onClose={onClose} closeButton={true} closeByBackdrop>
            <div className="sm:w-[20rem]">
                <div className="mb-4">
                    <div className="font-bold text-xl">{translation("title")}</div>
                </div>
                <div className="w-full flex items-center justify-center py-4">
                    <div className="w-48">
                        {type === "avatar" ? (
                            <AvatarItem item={item} showPrice />
                        ) : (
                            <StickerItem item={item} showPrice />
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-6">
                    <Button type="button" className="!bg-gray-400" onClick={onClose}>
                        {commonTranslation("cancel")}
                    </Button>
                    <Button type="button" className="">
                        {commonTranslation("submit")}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
});
