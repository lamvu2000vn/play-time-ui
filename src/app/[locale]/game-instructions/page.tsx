import {Container} from "@/components/UI";
import {useTranslations} from "next-intl";

export default function Page() {
    const translation = useTranslations("page.gameInstructions");

    return (
        <Container>
            <h1 className="text-3xl font-bold mb-4">{translation("title")}</h1>
            <Item
                title="Tic Tac Toe"
                content={
                    <div>
                        <div className="mb-1">
                            <b className="mr-1">{translation("ticTacToe.objectiveTitle")}</b>
                            {translation("ticTacToe.objectiveContent")}
                        </div>
                        <div>
                            <b className="mr-1">{translation("ticTacToe.instructionsTitle")}</b>
                            {translation("ticTacToe.instructionsContent")}
                        </div>
                    </div>
                }
            />
            <Item
                title="15 Puzzle"
                content={
                    <div>
                        <div className="mb-1">
                            <b className="mr-1">{translation("fifteenPuzzle.objectiveTitle")}</b>
                            {translation("fifteenPuzzle.objectiveContent")}
                        </div>
                        <div>
                            <b className="mr-1">{translation("fifteenPuzzle.instructionsTitle")}</b>
                            {translation("fifteenPuzzle.instructionsContent")}
                        </div>
                    </div>
                }
            />
            <Item
                title="Memory"
                content={
                    <div>
                        <div className="mb-1">
                            <b className="mr-1">{translation("memory.objectiveTitle")}</b>
                            {translation("memory.objectiveContent")}
                        </div>
                        <div>
                            <b className="mr-1">{translation("memory.instructionsTitle")}</b>
                            {translation("memory.instructionsContent")}
                        </div>
                    </div>
                }
            />
        </Container>
    );
}

export const Item = ({title, content}: {title: string; content: React.ReactNode}) => {
    return (
        <div className="collapse collapse-plus bg-base-100 mb-6 last:mb-0">
            <input type="checkbox" name="game-instruction" defaultChecked />
            <div className="collapse-title text-xl font-bold text-primary">{title}</div>
            <div className="collapse-content">
                <div className="text-justify">{content}</div>
            </div>
        </div>
    );
};
