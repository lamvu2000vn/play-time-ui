import {useTranslations} from "next-intl";
import {Button, ImageWithSkeleton} from "../UI";
import {useEffect} from "react";

interface Props {
    error?: Error & {digest?: string};
    reset?: () => void;
}

export default function MyError({error, reset}: Props) {
    const translation = useTranslations("page.error");

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-base-100 z-[100]">
            <div className="w-full h-full flex items-center justify-center">
                <div className="p-8">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-[15rem] sm:w-[20rem] relative aspect-square rounded-full overflow-hidden">
                            <ImageWithSkeleton src="/assets/images/error-animated.gif" fill fromClient />
                        </div>
                        <h1 className="font-semibold text-xl sm:text-2xl text-center">{translation("title")}</h1>
                        <Button type="button" onClick={() => reset && reset()}>
                            {translation("tryAgain")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
