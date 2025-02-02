import useElementShowState, {ElementAvailable} from "@/helpers/hooks/useElementShowState";
import {useCallback, useEffect, useState} from "react";
import Item from "../Item";
import {FaBell} from "react-icons/fa";
import Card from "../Card";
import {HiDotsHorizontal} from "react-icons/hi";
import MyTransition from "@/components/MyTransition";
import {IoIosDoneAll} from "react-icons/io";
import {MdDeleteForever} from "react-icons/md";
import {useTranslations} from "next-intl";

interface Props {
    id: string;
    width: number;
    height: number;
}

export default function HeaderNotificationItem(props: Props) {
    const {id, width, height} = props;
    const {showState, addElement} = useElementShowState();
    const [showNotifyOptions, setShowNotifyOptions] = useState<boolean>(false);
    const translation = useTranslations("common.notification");

    const handleToggleNotifyOptions = useCallback(() => {
        setShowNotifyOptions((prevState) => !prevState);
    }, []);

    useEffect(() => {
        addElement(ElementAvailable.Notification, id, {show: false});
    }, [addElement, id]);

    return (
        <div className="relative">
            <Item
                id={id}
                data-trigger-popup={ElementAvailable.Notification}
                className="relative flex items-center justify-center"
                style={{width: width, height: height}}
            >
                <div className="w-6 h-6">
                    <FaBell className="w-full h-full" />
                    <div className="absolute -right-1 -top-1 z-10">
                        <div className="badge badge-primary badge-sm text-base-100">9</div>
                    </div>
                </div>
            </Item>
            <MyTransition
                in={showState.notification[id]?.show}
                timeout={300}
                className="absolute top-full -right-full z-10 mt-1 w-max max-w-[18rem]"
                defaultStyles={{
                    opacity: 0,
                    transform: "translateY(-1rem)",
                    transition: "all 250ms ease-in-out",
                }}
                transitionStyles={{
                    entering: {opacity: 1, transform: "translateY(0)"},
                    entered: {opacity: 1, transform: "translateY(0)"},
                    exiting: {opacity: 0, transform: "translateY(-1rem)"},
                    exited: {opacity: 0, transform: "translateY(-1rem)"},
                    unmounted: {opacity: 0, transform: "translateY(-1rem)"},
                }}
            >
                <div data-popup-id={id} data-popup-element={ElementAvailable.Notification}>
                    <div className="w-full py-4 h-max overflow-hidden bg-base-100 border-2 border-primary rounded-box">
                        <div className="flex items-center justify-between mb-4 px-4">
                            <h3 className="text-xl font-bold">{translation("title")}</h3>
                            <div className="relative">
                                <Item
                                    className="relative w-8 h-8 flex items-center justify-center border border-base-200 !rounded-full"
                                    onClick={handleToggleNotifyOptions}
                                >
                                    <HiDotsHorizontal className="w-5 h-5" />
                                </Item>
                                {showNotifyOptions && (
                                    <div className="absolute top-full right-0 mt-1">
                                        <Card className=" bg-base-100 w-52 h-22 shadow-custom-1">
                                            <Item className="p-2 flex items-center gap-2">
                                                <IoIosDoneAll className="w-5 h-5" />
                                                <span>{translation("options.readAll")}</span>
                                            </Item>
                                            <Item className="p-2 flex items-center gap-2">
                                                <MdDeleteForever className="w-5 h-5" />
                                                <span>{translation("options.deleteAll")}</span>
                                            </Item>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-full px-4 max-h-[20rem] overflow-auto">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur animi nihil ea possimus
                            fugiat ratione recusandae voluptatibus explicabo tempora, laudantium vel praesentium quos
                            architecto hic, doloremque eius tempore ab odio. Lorem ipsum dolor sit, amet consectetur
                            adipisicing elit. Tenetur animi nihil ea possimus fugiat ratione recusandae voluptatibus
                            explicabo tempora, laudantium vel praesentium quos architecto hic, doloremque eius tempore
                            ab odio. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur animi nihil ea
                            possimus fugiat ratione recusandae voluptatibus Lorem ipsum dolor sit, amet consectetur
                            adipisicing elit. Tenetur animi nihil ea possimus fugiat ratione recusandae voluptatibus
                            explicabo tempora, laudantium vel praesentium quos architecto hic, doloremque eius tempore
                            ab odio. explicabo tempora, laudantium vel praesentium quos architecto hic, Lorem ipsum
                            dolor sit, amet consectetur adipisicing elit. Tenetur animi nihil ea possimus fugiat ratione
                            recusandae voluptatibus explicabo tempora, laudantium vel praesentium quos architecto hic,
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur animi nihil ea possimus
                            fugiat ratione recusandae voluptatibus explicabo tempora, laudantium vel praesentium quos
                            architecto hic, Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur animi
                            nihil ea possimus fugiat ratione recusandae voluptatibus explicabo tempora, laudantium vel
                            praesentium quos architecto hic, doloremque eius tempore ab odio. doloremque eius tempore ab
                            odio. doloremque eius tempore ab odio. doloremque eius tempore ab odio.
                        </div>
                    </div>
                </div>
            </MyTransition>
        </div>
    );
}
