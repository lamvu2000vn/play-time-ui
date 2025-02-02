import {toast} from "react-toastify";
import {Theme} from "../shared/types";

export const showToast = (
    content: string | React.ReactNode,
    type: "info" | "success" | "warning" | "error" | "default" = "default"
) => {
    switch (type) {
        case "info":
            toast.info(content);
            break;
        case "success":
            toast.success(content);
            break;
        case "warning":
            toast.warning(content);
            break;
        case "error":
            toast.error(content);
            break;
        case "default":
            toast(content);
            break;
    }
};

export const changeTheme = (theme: Theme) => {
    document.querySelector("html")!.setAttribute("data-theme", theme);
};
