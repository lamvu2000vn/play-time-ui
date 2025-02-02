import {Locales} from "@/helpers/shared/types";
import {Link, usePathname} from "@/i18n/routing";
import ImageWithSkeleton from "../../ImageWithSkeleton";
import {useLocale} from "next-intl";
import {FaCheck} from "react-icons/fa6";

export default function LanguageSetting() {
    const currentLocale = useLocale();

    return (
        <div className="w-full">
            <div className="flex gap-2 flex-wrap">
                <Button
                    locale="vi"
                    flagUrl="/assets/images/locales/vietnam-flag.png"
                    label="Tiếng Việt"
                    active={currentLocale === "vi"}
                />
                <Button
                    locale="en"
                    flagUrl="/assets/images/locales/united-states-flag.png"
                    label="English"
                    active={currentLocale === "en"}
                />
                <Button
                    locale="ar"
                    flagUrl="/assets/images/locales/arab-flag.png"
                    label="العربية"
                    active={currentLocale === "ar"}
                />
                <Button
                    locale="zh"
                    flagUrl="/assets/images/locales/chine-flag.png"
                    label="中文"
                    active={currentLocale === "zh"}
                />
                <Button
                    locale="fr"
                    flagUrl="/assets/images/locales/france-flag.png"
                    label="Français"
                    active={currentLocale === "fr"}
                />
                <Button
                    locale="hi"
                    flagUrl="/assets/images/locales/india-flag.png"
                    label="हिंदी"
                    active={currentLocale === "hi"}
                />
                <Button
                    locale="ja"
                    flagUrl="/assets/images/locales/japan-flag.png"
                    label="日本語"
                    active={currentLocale === "ja"}
                />
                <Button
                    locale="pt"
                    flagUrl="/assets/images/locales/portugal-flag.png"
                    label="Português"
                    active={currentLocale === "pt"}
                />
                <Button
                    locale="es"
                    flagUrl="/assets/images/locales/spain-flag.png"
                    label="Español"
                    active={currentLocale === "es"}
                />
                <Button
                    locale="ru"
                    flagUrl="/assets/images/locales/russia-flag.png"
                    label="Русский"
                    active={currentLocale === "ru"}
                />
            </div>
        </div>
    );
}

function Button({flagUrl, label, locale, active}: {flagUrl: string; label: string; locale: Locales; active?: boolean}) {
    const pathname = usePathname();
    const activeClasses = active ? "border-primary" : "";

    return (
        <Link
            href={pathname}
            locale={locale}
            className={`w-max h-9 rounded-full bg-base-100 box-border flex items-center justify-center border-2 border-gray-200 overflow-hidden ${activeClasses}`}
        >
            <div className="w-9 h-9 relative aspect-square">
                <ImageWithSkeleton src={flagUrl} fill fromClient />
            </div>
            <div className="w-max h-full px-3 flex items-center justify-center font-semibold text-sm">{label}</div>
            {active && (
                <div className="pr-3 text-success text-sm">
                    <FaCheck />
                </div>
            )}
        </Link>
    );
}
