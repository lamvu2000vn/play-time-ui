import {useAuth} from "@/helpers/hooks/useAuth";
import ImageWithSkeleton from "../ImageWithSkeleton";
import UserCoin from "../UserCoin";
import Item from "../Item";
import useElementShowState, {ElementAvailable} from "@/helpers/hooks/useElementShowState";
import MyTransition from "@/components/MyTransition";
import Card from "../Card";
import {useEffect, useState} from "react";
import useFlexiblePopupPosition from "@/helpers/hooks/useFlexiblePopupPosition";
import {RiLogoutCircleRLine, RiUserFill} from "react-icons/ri";
import Link from "next/link";
import {ImProfile} from "react-icons/im";
import {BsStars} from "react-icons/bs";
import DividerBar from "../DividerBar";
import {useRouter} from "next/navigation";
import AuthService from "@/services/AuthService";
import {IoMdArrowDropdown} from "react-icons/io";
import {useTranslations} from "next-intl";
import useVisibility from "@/helpers/hooks/useVisibility";

interface Props {
    isExpand: boolean;
    id: string;
}

export default function UserInfo(props: Props) {
    const {id, isExpand} = props;
    const {auth, logout} = useAuth();
    const {showState, addElement} = useElementShowState();
    const {position, reCalculatePosition} = useFlexiblePopupPosition({elementId: id});
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const router = useRouter();
    const translation = useTranslations("common");
    const {show} = useVisibility();

    const ElementShow = showState.userInfoSidebar[id]?.show;

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            logout();
            router.push("/auth/login");
        } catch (err: unknown) {
            console.log("🚀 ~ handleLogout ~ err:", err);
        }
    };

    useEffect(() => {
        addElement(ElementAvailable.UserInfoSidebar, id, {show: false});
    }, [addElement, id]);

    useEffect(() => {
        if (ElementShow) {
            reCalculatePosition();
        }

        setShowMenu(ElementShow);
    }, [id, reCalculatePosition, ElementShow]);

    return (
        <>
            <div className="relative">
                <div id={id} data-trigger-popup={ElementAvailable.UserInfoSidebar}>
                    <Item className="relative h-12 flex items-center gap-2">
                        {isExpand && <IoMdArrowDropdown className="absolute top-0 right-1 w-4 h-4" />}
                        <div className="w-12 h-12 flex items-center justify-center">
                            <div className="relative aspect-square w-10 rounded-full overflow-hidden">
                                {auth && auth.user && <ImageWithSkeleton src={auth.user.avatarUrl} fill />}
                            </div>
                        </div>
                        {isExpand && (
                            <div className="flex flex-col py-1 pr-2">
                                <span className="text-base -mt-1 font-semibold">{auth?.user?.name}</span>
                                <UserCoin />
                            </div>
                        )}
                    </Item>
                </div>
                <MyTransition
                    in={showMenu}
                    timeout={300}
                    className={`fixed z-10 mt-1 w-max`}
                    defaultStyles={{
                        left: position?.left || "none",
                        top: position?.top || "none",
                        right: position?.right || "none",
                        bottom: position?.bottom || "none",
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
                    <Card
                        data-popup-id={id}
                        data-popup-element={ElementAvailable.UserInfoSidebar}
                        className="w-[18rem] h-max bg-base-100 py-4 px-2 shadow-custom-1"
                    >
                        <Link href="/user/info">
                            <Item className="p-3">
                                <div className="flex items-center gap-3">
                                    <RiUserFill className="w-5 h-5" />
                                    <span>{translation("sidebar.userInfo.accountManagerLink")}</span>
                                </div>
                            </Item>
                        </Link>
                        <Item className="p-3" onClick={() => show("statisticsModal")}>
                            <div className="flex items-center gap-3">
                                <ImProfile className="w-5 h-5" />
                                <span>{translation("sidebar.userInfo.myStatistics")}</span>
                            </div>
                        </Item>
                        <Link href="/store/avatar?section=paidItems">
                            <Item className="p-3">
                                <div className="flex items-center gap-3">
                                    <BsStars className="w-5 h-5" />
                                    <span>{translation("sidebar.userInfo.changeProfileImage")}</span>
                                </div>
                            </Item>
                        </Link>
                        <DividerBar className="my-1" />
                        <Item className="p-3" onClick={handleLogout}>
                            <div className="flex items-center gap-3">
                                <RiLogoutCircleRLine className="w-5 h-5" />
                                <span>{translation("logout")}</span>
                            </div>
                        </Item>
                    </Card>
                </MyTransition>
            </div>
        </>
    );
}
