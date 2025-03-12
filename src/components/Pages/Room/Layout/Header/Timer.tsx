import {countdownFormatter} from "@/helpers/utils/countdownFormatter";

interface Props {
    seconds: number;
}

export default function Timer(props: Props) {
    const {seconds} = props;

    return (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[15%] md:w-[10%] h-full flex justify-center">
            <div className="relative aspect-square h-full w-auto shrink-0 p-1">
                {/* <div className="w-full h-full flex items-center justify-center">
                    <CountdownCircleTimer
                        key={id}
                        isPlaying={isPlaying}
                        duration={duration}
                        initialRemainingTime={duration}
                        size={48}
                        strokeWidth={6}
                        colors={["#2dd4bf", "#4ade80", "#facc15", "#f87171", "#dc2626"]}
                        colorsTime={[duration, duration * 0.75, duration * 0.5, duration * 0.25, 0]}
                        onComplete={() => {
                            onTimeout();

                            return {
                                shouldRepeat,
                            };
                        }}
                    >
                        {({remainingTime}) => remainingTime}
                    </CountdownCircleTimer>
                </div> */}

                <div className="w-full h-full border-4 xl:border-[.5rem] border-yellow-400 rounded-full bg-neutral-50 flex items-center justify-center">
                    <h1 className="text-base xl:text-lg font-semibold text-neutral">{countdownFormatter(seconds)}</h1>
                </div>
            </div>
        </div>
    );
}
