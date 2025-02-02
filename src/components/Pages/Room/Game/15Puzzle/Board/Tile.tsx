import {Pacifico} from "next/font/google";

interface Props {
    number: number;
    correctNumber: number;
    tileColor: string;
}

const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export default function Tile(props: Props) {
    const {number, correctNumber, tileColor} = props;

    if (number === 0) return null;

    const correctBgColor = correctNumber === number ? "bg-yellow-400" : "";

    return (
        <div
            className={`absolute left-0 top-0 right-0 bottom-0 rounded-lg flex items-center justify-center transition-transform duration-150 ${tileColor} ${correctBgColor} ${pacifico.className}`}
        >
            <div className="text-2xl lg:text-4xl font-semibold text-neutral">{number}</div>
        </div>
    );
}
