import {Button, Container, ImageWithSkeleton} from "@/components/UI";
import {useRouter} from "@/i18n/routing";
import {selectError} from "@/libs/redux/features/inMatchData/inMatchDataSlice";
import {clearRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {useTranslations} from "next-intl";
import {useCallback} from "react";

export default function ErrorSection() {
    const error = useAppSelector(selectError);
    const commonTranslation = useTranslations("common");
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleRedirectToHomePage = useCallback(() => {
        dispatch(clearRoomInfo());
        router.push("/");
    }, [dispatch, router]);

    return (
        <Container className="h-full flex items-center">
            <div className="flex-1 p-12 rounded-2xl shadow-custom-1 flex flex-col items-center justify-center gap-6 bg-base-100">
                <div className="flex justify-center">
                    <ImageWithSkeleton src="/assets/images/game-error.png" width={128} height={128} />
                </div>
                <h1 className="font-semibold text-xl text-center">{error}</h1>
                <Button type="button" outlinebutton="true" onClick={handleRedirectToHomePage}>
                    {commonTranslation("homePage")}
                </Button>
            </div>
        </Container>
    );
}
