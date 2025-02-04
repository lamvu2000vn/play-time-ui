import {Card, Container} from "@/components/UI";
import {useTranslations} from "next-intl";
import Image from "next/image";

export default function PreparingRoomSection() {
    const translation = useTranslations("page.room");

    return (
        <Container className="h-full flex items-center justify-center">
            <Card className="w-[25rem]">
                <div className="w-full flex flex-col gap-6">
                    <div className="flex justify-center">
                        <div className="w-[8rem]">
                            <div className="relative aspect-square">
                                <Image src="/assets/images/GIFs/players-2.gif" alt="image" fill />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 justify-center font-semibold text-xl my-6">
                        <span>{translation("PreparingRoomTitle")}</span>
                        <span className="loading loading-dots loading-sm"></span>
                    </div>
                </div>
            </Card>
        </Container>
    );
}
