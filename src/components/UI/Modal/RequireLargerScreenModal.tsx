import BaseModal from "./BaseModal";
import {useTranslations} from "next-intl";
import {PiMonitorArrowUp} from "react-icons/pi";

interface Props {
    show: boolean;
    onClose: () => void;
    requiredWidth: number;
}

export default function RequireLargerScreenModal(props: Props) {
    const {show, onClose, requiredWidth} = props;
    const translation = useTranslations("common.modal.RequireLargerScreenModal");

    return (
        <BaseModal show={show} onClose={onClose} closeButton closeByBackdrop>
            <div className="sm:w-[20rem]">
                <div className="w-full flex flex-col items-center gap-6">
                    <PiMonitorArrowUp className="w-20 h-20" />
                    <span className="text-center font-semibold">{translation("content", {width: requiredWidth})}</span>
                </div>
            </div>
        </BaseModal>
    );
}
