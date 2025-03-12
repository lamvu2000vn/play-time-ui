import {Textarea} from "@/components/UI";
import {ChatContent, PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import WebSocketService from "@/services/WebSocketService";
import {Formik, FormikProps} from "formik";
import {useState} from "react";
import {IoSend} from "react-icons/io5";
import {LuSticker} from "react-icons/lu";
import * as Yup from "yup";
import StickerPopup from "./StickerPopup";
import {useTranslations} from "next-intl";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectUser} from "@/libs/redux/features/auth/authSlice";

interface Props {
    stickers: PaidItem[];
}

export default function ChatForm(props: Props) {
    const {stickers} = props;

    const user = useAppSelector(selectUser);
    const matchInfo = useAppSelector((state) => state.matchInfo)!;
    const [showStickerPopup, setShowStickerPopup] = useState<boolean>(false);
    const translation = useTranslations("common");

    const formValues: ChatContent = {
        sender: user,
        type: "message",
        content: "",
    };

    const handleToggleStickerPopup = () => setShowStickerPopup((prevState) => !prevState);
    const handleCloseStickerPopup = () => setShowStickerPopup(false);

    const handleSendMessage = async (values: ChatContent) => {
        await WebSocketService.sendMessageInGame(matchInfo.roomId, values);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = "auto"; // Reset chiều cao để đo lại
        textarea.style.height = `${textarea.scrollHeight}px`; // Điều chỉnh chiều cao
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, formik: FormikProps<ChatContent>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const value = e.currentTarget.value.trim();
            console.log("🚀 ~ handleKeyDown ~ value:", value);

            if (value) {
                formik.handleSubmit();
            }
        }
    };

    return (
        <Formik
            initialValues={formValues}
            validationSchema={Yup.object({
                content: Yup.string().max(100, translation("error.maxLength", {max: 100})),
            })}
            onSubmit={(values, {setSubmitting, resetForm}) => {
                (async () => {
                    setSubmitting(true);
                    await handleSendMessage(values);
                    resetForm();
                    setSubmitting(false);
                })();
            }}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                    <div className="relative min-h-16 h-max py-2 box-border flex items-center">
                        <div className="flex-1 flex items-end pl-4">
                            <Textarea
                                name="content"
                                onInput={handleInput}
                                onKeyDown={(e) => handleKeyDown(e, formik)}
                                onChange={formik.handleChange}
                                value={formik.values.content}
                                placeholder="Nhập tin nhắn..."
                                rows={1}
                                maxLength={100}
                                className="w-full min-h-5 bg-base-100"
                                invalid="false"
                            />
                            {formik.touched.content && formik.errors.content && (
                                <small className="text-sm text-red-400">*{formik.errors.content}</small>
                            )}
                        </div>
                        <div
                            className="basis-12 h-10 shrink-0 flex items-center justify-center cursor-pointer"
                            onClick={handleToggleStickerPopup}
                        >
                            <LuSticker className="w-6 h-6" />
                        </div>
                        <button
                            type="submit"
                            className="basis-12 h-10 shrink-0 flex items-center justify-center cursor-pointer"
                        >
                            <IoSend className="w-6 h-6 text-primary" />
                        </button>
                        <StickerPopup show={showStickerPopup} onClose={handleCloseStickerPopup} stickers={stickers} />
                    </div>
                </form>
            )}
        </Formik>
    );
}
