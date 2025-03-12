import {ElementAvailable, selectElementVisibility, setVisibility} from "@/libs/redux/features/ui/uiSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {useCallback} from "react";

export default function useVisibility() {
    const visibility = useAppSelector(selectElementVisibility);
    const dispatch = useAppDispatch();

    // Hàm để mở một component
    const show = useCallback(
        (key: ElementAvailable) => {
            dispatch(setVisibility({element: key, showState: true}));
        },
        [dispatch]
    );

    // Hàm để đóng một component
    const hide = useCallback(
        (key: ElementAvailable) => {
            dispatch(setVisibility({element: key, showState: false}));
        },
        [dispatch]
    );

    // Hàm để toggle trạng thái
    const toggle = useCallback(
        (key: ElementAvailable) => {
            dispatch(setVisibility({element: key, showState: !visibility[key]}));
        },
        [dispatch, visibility]
    );

    return {visibility, show, hide, toggle};
}
