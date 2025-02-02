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
import {useTranslations} from "next-intl";
import {MemoryGameSetup} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {memoryDefaultSetup} from "@/helpers/shared/data";

interface Props {
    gameInfo: GameInfo;
}

export default function MemorySetup(props: Props) {
    const {gameInfo} = props;
    const {auth} = useAuth();
    const user = auth.user!;
    const setRoomInfo = useSetRecoilState(roomInfoState);
    const translation = useTranslations("common.modal.gameSetup");

    const handleSubmitGameSetup = async (gameSetup: MemoryGameSetup) => {
        try {
            const payload: CreateNewRoom<MemoryGameSetup> = {
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
            initialValues={memoryDefaultSetup}
            onSubmit={async (values: MemoryGameSetup, {setSubmitting}) => {
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
                        <div className="w-full rounded-lg p-3 border mt-2">{gameInfo.name}</div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="theme"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("memory.theme")}
                        </label>
                        <Select
                            name="theme"
                            id="theme"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.theme}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="fruit">{translation("memory.themeValue", {theme: "fruit"})}</option>
                            <option value="animal">{translation("memory.themeValue", {theme: "animal"})}</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="pairOfCard"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("memory.numOfCardsLabel")}
                        </label>
                        <Select
                            name="numOfCards"
                            id="numOfCards"
                            invalid="false"
                            className="rounded-lg mt-1"
                            value={formik.values.numOfCards}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value={16}>{translation("memory.numOfCards", {number: 16})}</option>
                            <option value={36}>{translation("memory.numOfCards", {number: 36})}</option>
                            <option value={64}>{translation("memory.numOfCards", {number: 64})}</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="matchTime"
                            className="relative font-semibold text-lg pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-primary"
                        >
                            {translation("memory.timeForMatch")}
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
                            <option value={300}>{translation("memory.minutes", {minutes: 5})}</option>
                            <option value={600}>{translation("memory.minutes", {minutes: 10})}</option>
                            <option value={900}>{translation("memory.minutes", {minutes: 15})}</option>
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
