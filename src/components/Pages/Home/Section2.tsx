import {useTranslations} from "next-intl";
import {FaRankingStar} from "react-icons/fa6";
import {HiUserGroup, HiUsers} from "react-icons/hi";
import {IoStorefront} from "react-icons/io5";

export default function Section2() {
    const page = useTranslations("page.home");

    return (
        <div className="py-4 px-8 bg-base-300">
            <div className="flex items-stretch flex-wrap">
                <div className="w-full h-max md:w-1/4 flex flex-col items-center gap-2 px-4 py-8">
                    <FaRankingStar className="w-14 h-14 text-primary" />
                    <h1 className="text-2xl font-bold text-center">{page("introduceSection2.title1")}</h1>
                    <span className="text-base text-center break-words">{page("introduceSection2.content1")}</span>
                </div>
                <div className="w-full h-max md:w-1/4 flex flex-col items-center gap-2 px-4 py-8">
                    <HiUsers className="w-14 h-14 text-primary" />
                    <h1 className="text-2xl font-bold text-center">{page("introduceSection2.title2")}</h1>
                    <span className="text-base text-center break-words">{page("introduceSection2.content2")}</span>
                </div>
                <div className="w-full h-max md:w-1/4 flex flex-col items-center gap-2 px-4 py-8">
                    <IoStorefront className="w-14 h-14 text-primary" />
                    <h1 className="text-2xl font-bold text-center">{page("introduceSection2.title3")}</h1>
                    <span className="text-base text-center break-words">{page("introduceSection2.content3")}</span>
                </div>
                <div className="w-full h-max md:w-1/4 flex flex-col items-center gap-2 px-4 py-8">
                    <HiUserGroup className="w-14 h-14 text-primary" />
                    <h1 className="text-2xl font-bold text-center">{page("introduceSection2.title4")}</h1>
                    <span className="text-base text-center break-words">{page("introduceSection2.content4")}</span>
                </div>
            </div>
        </div>
    );
}
