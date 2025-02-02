import Image from "next/image";
import ImageWithSkeleton from "./ImageWithSkeleton";
import ItemSound from "./ItemSound";

interface CardImageProps {
    children: React.ReactNode;
    onClick?: () => void;
}

interface ImageProps {
    src: string;
}

export default function CardImage(props: CardImageProps) {
    return (
        <ItemSound>
            <div
                className="cursor-pointer w-full h-max overflow-hidden flex flex-col items-stretch rounded-2xl bg-base-100 shadow-custom-1 transition-all duration-300 hover:scale-105"
                onClick={props.onClick}
            >
                {props.children}
            </div>
        </ItemSound>
    );
}

function ImageComponent(props: ImageProps) {
    return (
        <div className="relative aspect-square">
            <ImageWithSkeleton src={props.src} fill={true} />
        </div>
    );
}

function GIFImageComponent(props: ImageProps) {
    return (
        <div className="w-full p-3">
            <Image
                src={process.env.NEXT_PUBLIC_SERVER_URL + props.src}
                alt="GIF"
                width={0}
                height={0}
                className="w-full"
                loading="lazy"
                unoptimized={true}
            />
        </div>
    );
}

function ContentComponent(props: CardImageProps) {
    return <div className="p-2">{props.children}</div>;
}

CardImage.Image = ImageComponent;
CardImage.GIFImage = GIFImageComponent;
CardImage.Content = ContentComponent;
