import {visibilityState} from "@/libs/recoil/atom";
import {ElementAvailable} from "@/libs/recoil/atom/visibilityState";
import {useCallback} from "react";
import {useRecoilState} from "recoil";

const useVisibility = () => {
    const [visibility, setVisibility] = useRecoilState(visibilityState);

    // Hàm để mở một component
    const show = useCallback(
        (key: ElementAvailable) => {
            setVisibility((prev) => ({...prev, [key]: true}));
        },
        [setVisibility]
    );

    // Hàm để đóng một component
    const hide = useCallback(
        (key: ElementAvailable) => {
            setVisibility((prev) => ({...prev, [key]: false}));
        },
        [setVisibility]
    );

    // Hàm để toggle trạng thái
    const toggle = useCallback(
        (key: ElementAvailable) => {
            setVisibility((prev) => ({...prev, [key]: !prev[key]}));
        },
        [setVisibility]
    );

    return {visibility, show, hide, toggle};
};

export default useVisibility;
