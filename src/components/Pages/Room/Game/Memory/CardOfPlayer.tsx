import {ImageWithSkeleton} from "@/components/UI";
import {PlayerInfo} from "@/helpers/shared/interfaces/commonInterface";
import {memoryMatchInfoState} from "@/libs/recoil/atom";
import {TbCardsFilled} from "react-icons/tb";
import {useRecoilValue} from "recoil";

interface Props {
    side: "left" | "right";
    playerInfo: PlayerInfo;
}

export default function CardOfPlayer(props: Props) {
    const {side, playerInfo} = props;

    const {game} = useRecoilValue(memoryMatchInfoState)!;
    const {specialData} = game;

    const bgColor = side === "left" ? "bg-secondary/80" : "bg-primary/80";
    const textColor = side === "left" ? "text-secondary" : "text-primary";
    const borderColor = side === "left" ? "border-secondary/80" : "border-primary/80";

    return (
        <Container side={side}>
            <div className="w-full h-full flex items-center">
                <div className={`w-full rounded-lg overflow-hidden border-4 ${borderColor}`}>
                    <div className={`w-full flex items-center gap-2 p-2 ${bgColor}`}>
                        <div className="basis-8 flex-shrink-0">
                            <div className="relative aspect-square w-8 rounded-full overflow-hidden">
                                <ImageWithSkeleton src={playerInfo.avatarUrl} fill />
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xl text-neutral font-semibold truncate">{playerInfo.name}</div>
                        </div>
                    </div>
                    <div className={`w-full flex items-center gap-4 bg-base-100 p-2 text-4xl ${textColor}`}>
                        <h1 className="font-bold">
                            {side === "left" ? specialData.numOfMyCards : specialData.numOfOpponentCards}
                        </h1>
                        <TbCardsFilled />
                    </div>
                </div>
            </div>
        </Container>
    );
}

function Container({side, children}: {side: "left" | "right"; children: React.ReactNode}) {
    const flexOrder = side === "left" ? "portrait:order-2 landscape:order-1" : "portrait:order-3 landscape:order-3";
    const border =
        side === "left"
            ? "portrait:border-t-4 portrait:border-r-2 landscape:border-r-4"
            : "portrait:border-t-4 portrait:border-l-2 landscape:border-l-4";

    return (
        <div
            className={`portrait:basis-1/2 ${flexOrder} landscape:basis-1/5 2xl:landscape:basis-1/6 p-4 overflow-hidden ${border}`}
        >
            {children}
        </div>
    );
}
