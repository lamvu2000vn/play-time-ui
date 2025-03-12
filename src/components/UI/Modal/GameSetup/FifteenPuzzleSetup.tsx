import {CreateNewRoom, GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {Formik} from "formik";
import Select from "../../Forms/Select";
import DividerBar from "../../DividerBar";
import SubmitButton from "../../Forms/SubmitButton";
import {FiLogIn} from "react-icons/fi";
import WebSocketService from "@/services/WebSocketService";
import {showToast} from "@/helpers/utils/utils";
import {useTranslations} from "next-intl";
import {fifteenPuzzleDefaultSetup} from "@/helpers/shared/data";
import {FifteenPuzzleGameSetup} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {setRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {selectUser} from "@/libs/redux/features/auth/authSlice";

interface Props {
    gameInfo: GameInfo;
}

export default function FifteenPuzzleSetup(props: Props) {
    const {gameInfo} = props;
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const translation = useTranslations("common.modal.gameSetup");

    const handleSubmitGameSetup = async (gameSetup: FifteenPuzzleGameSetup) => {
        try {
            const payload: CreateNewRoom<FifteenPuzzleGameSetup> = {
                hostId: user._id,
                gameId: gameInfo._id,
                gameSetup,
                type: "PlayWithFriend",
            };

            const {status, data} = await WebSocketService.createNewRoom(payload);

            if (status === "not ok" || Object.keys(data).length === 0) {
                return showToast(translation("error.createRoomFailure"), "error");
            }

            dispatch(
                setRoomInfo({
                    roomId: data._id,
                    hostId: data.hostId,
                    joinerId: data.joinerId,
                    gameId: data.gameId,
                    gameSetup: data.gameSetup,
                    matchStatus: data.matchStatus,
                    type: data.type,
                })
            );
        } catch (error) {
            console.log("🚀 ~ handleSubmitGameSetup ~ error:", error);
        }
    };

    return (
        <Formik
            initialValues={fifteenPuzzleDefaultSetup}
            onSubmit={async (values: FifteenPuzzleGameSetup, {setSubmitting}) => {
                setSubmitting(true);
                await handleSubmitGameSetup(values);
                setSubmitting(false);
            }}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit} className="p-4 sm:p-8">
                    <div className="flex justify-center mb-10">
                        <h1 className="font-semibold text-3xl">{translation("title")}</h1>
                    </div>
                    <div className="mb-4">
                        <label className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary">
                            {translation("gameName")}
                        </label>
                        <Select invalid="false" value={gameInfo.name} className="mt-1" disabled>
                            <option value={gameInfo.name}>{gameInfo.name}</option>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="matchTime"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("fifteenPuzzle.timeForMatch")}
                        </label>
                        <Select
                            name="matchTime"
                            id="matchTime"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.matchTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value={300}>{translation("fifteenPuzzle.minutes", {minutes: 5})}</option>
                            <option value={600}>{translation("fifteenPuzzle.minutes", {minutes: 10})}</option>
                            <option value={900}>{translation("fifteenPuzzle.minutes", {minutes: 15})}</option>
                        </Select>
                    </div>
                    <DividerBar />
                    <div className="flex justify-end">
                        <SubmitButton
                            icon={<FiLogIn className="w-5 h-5" />}
                            label={translation("createRoom")}
                            isSubmitting={formik.isSubmitting}
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
}
