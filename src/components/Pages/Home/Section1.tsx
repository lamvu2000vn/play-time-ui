import {FaHeartCircleCheck} from "react-icons/fa6";
import {useTranslations} from "next-intl";

export default function Section1() {
    const page = useTranslations("page.home");

    return (
        <div className="py-12 px-8">
            <h1 className="text-3xl font-bold text-center mb-8">{page("introduceSection1.title")}</h1>
            <div className="flex items-center flex-wrap">
                <div className="w-full h-20 md:w-1/3 flex items-center justify-center gap-1">
                    <FaHeartCircleCheck className="w-8 h-8 text-primary" />
                    <span className="text-xl text-center break-words">{page("introduceSection1.text1")}</span>
                </div>
                <div className="w-full h-20 md:w-1/3 flex items-center justify-center gap-1">
                    <FaHeartCircleCheck className="w-8 h-8 text-primary" />
                    <span className="text-xl text-center break-words">{page("introduceSection1.text2")}</span>
                </div>
                <div className="w-full h-20 md:w-1/3 flex items-center justify-center gap-1">
                    <FaHeartCircleCheck className="w-8 h-8 text-primary" />
                    <span className="text-xl text-center break-words">{page("introduceSection1.text3")}</span>
                </div>
            </div>
        </div>
    );
}
