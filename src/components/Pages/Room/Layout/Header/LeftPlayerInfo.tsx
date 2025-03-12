import {ImageWithSkeleton} from "@/components/UI";
import {PlayerInfo} from "@/helpers/shared/interfaces/commonInterface";

interface Props {
    playerInfo: PlayerInfo;
    isPlayerTurn: boolean;
}

export default function LeftPlayerInfo(props: Props) {
    const {playerInfo, isPlayerTurn} = props;
    const {score} = playerInfo;

    const bgColor = isPlayerTurn ? "bg-slate-100 shadow-lg shadow-slate-500" : "bg-gray-500 grayscale";

    return (
        <div className="absolute left-0 top-0 w-[42.5%] md:w-[45%] h-full">
            <div className={`max-w-full h-full flex items-stretch gap-2 rounded-e-full p-2 mr-1 ${bgColor}`}>
                <div className="flex-1 overflow-hidden">
                    <div className="w-full h-full text-neutral">
                        <div className="text-base xl:text-xl font-semibold w-full truncate text-end">
                            {playerInfo.name}
                        </div>
                        <div className="text-sm xl:text-lg text-end font-semibold">{score}</div>
                    </div>
                </div>
                <div className="shrink-0 aspect-square">
                    <div className="aspect-square relative rounded-full overflow-hidden">
                        <ImageWithSkeleton src={playerInfo.avatarUrl} fill />
                    </div>
                </div>
            </div>
        </div>
    );
}
