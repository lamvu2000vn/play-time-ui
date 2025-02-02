import {Button, Container, ImageWithSkeleton} from "@/components/UI";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";

export default function ErrorSection({message}: {message: string}) {
    const commonTranslation = useTranslations("common");

    return (
        <Container className="h-full flex items-center">
            <div className="flex-1 p-12 rounded-box shadow-custom-1 flex flex-col items-center justify-center gap-6 bg-base-100">
                <div className="flex justify-center">
                    <ImageWithSkeleton src="/assets/images/game-error.png" fromClient width={128} height={128} />
                </div>
                <h1 className="font-semibold text-xl text-center">{message}</h1>
                <Link href="/">
                    <Button type="button" outlinebutton="true">
                        {commonTranslation("homePage")}
                    </Button>
                </Link>
            </div>
        </Container>
    );
}
