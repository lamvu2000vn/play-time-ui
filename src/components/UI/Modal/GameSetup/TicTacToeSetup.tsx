"use client";

import {CreateNewRoom, GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {Formik} from "formik";
import Select from "../../Forms/Select";
import {useSetRecoilState} from "recoil";
import {roomInfoState} from "@/libs/recoil/atom";
import DividerBar from "../../DividerBar";
import SubmitButton from "../../Forms/SubmitButton";
import {FiLogIn} from "react-icons/fi";
import {useAuth} from "@/helpers/hooks/useAuth";
import WebSocketService from "@/services/WebSocketService";
import {showToast} from "@/helpers/utils/utils";
import {ticTacToeDefaultSetup} from "@/helpers/shared/data";
import {useTranslations} from "next-intl";
import {TicTacToeGameSetup} from "@/helpers/shared/interfaces/games/ticTacToeInterfaces";

interface Props {
    gameInfo: GameInfo;
}

export default function TicTacToeSetup(props: Props) {
    const {gameInfo} = props;
    const {auth} = useAuth();
    const user = auth.user!;
    const setRoomInfo = useSetRecoilState(roomInfoState);
    const translation = useTranslations("common.modal.gameSetup");

    const handleSubmitGameSetup = async (gameSetup: TicTacToeGameSetup) => {
        try {
            const payload: CreateNewRoom<TicTacToeGameSetup> = {
                hostId: user._id,
                gameId: gameInfo._id,
                gameSetup,
                type: "PlayWithFriend",
            };
            const {status, data} = await WebSocketService.createNewRoom(payload);

            if (status === "not ok" || Object.keys(data).length === 0) {
                return showToast(translation("error.createRoomFailure"), "error");
            }

            setRoomInfo({
                roomId: data._id,
                hostId: data.hostId,
                joinerId: data.joinerId,
                gameId: data.gameId,
                gameSetup: data.gameSetup,
                matchStatus: data.matchStatus,
                type: data.type,
            });
        } catch (error) {
            console.log("🚀 ~ handleSubmitGameSetup ~ error:", error);
        }
    };

    return (
        <Formik
            initialValues={ticTacToeDefaultSetup}
            onSubmit={(values: TicTacToeGameSetup, {setSubmitting}) => {
                (async () => {
                    setSubmitting(true);
                    await handleSubmitGameSetup(values);
                    setSubmitting(false);
                })();
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
                        <div className="w-full rounded-lg p-3 border mt-2">{gameInfo.name}</div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="boardSize"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("ticTacToe.boardSize")}
                        </label>
                        <Select
                            name="boardSize"
                            id="boardSize"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.boardSize}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="3x3">{translation("ticTacToe.size3x3Description")}</option>
                            <option value="5x5">{translation("ticTacToe.size5x5Description")}</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="turnTime"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("ticTacToe.timePerTurn")}
                        </label>
                        <Select
                            name="turnTime"
                            id="turnTime"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.turnTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value={10}>{translation("ticTacToe.seconds", {seconds: 10})}</option>
                            <option value={20}>{translation("ticTacToe.seconds", {seconds: 20})}</option>
                            <option value={30}>{translation("ticTacToe.seconds", {seconds: 30})}</option>
                            <option value={999}>{translation("ticTacToe.seconds", {seconds: 999})}</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="firstTurn"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("ticTacToe.playTurn")}
                        </label>
                        <Select
                            name="firstTurn"
                            id="firstTurn"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.firstTurn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="random">{translation("ticTacToe.firstTurn", {firstTurn: "random"})}</option>
                            <option value="me">{translation("ticTacToe.firstTurn", {firstTurn: "me"})}</option>
                            <option value="opponent">
                                {translation("ticTacToe.firstTurn", {firstTurn: "opponent"})}
                            </option>
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
