"use client";

import Image from "next/image";
import {useState} from "react";

export interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
    unoptimized?: boolean;
}

export default function ImageWithSkeleton(props: ImageWithSkeletonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <div className={`overflow-hidden ${props.className || ""}`} style={{width: props.width, height: props.height}}>
            {isLoading && <div className="skeleton w-full h-full"></div>}
            <Image
                src={props.src}
                width={props.width}
                height={props.height}
                fill={props.fill}
                sizes={props.fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw" : undefined}
                alt="image"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                unoptimized={props.unoptimized}
                quality={100}
            />
        </div>
    );
}
