import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="fixed left-0 top-0 z-[200] w-full h-full bg-base-100">
            <div className="w-full h-full flex items-center justify-center">
                <div className="relative aspect-square w-[16rem] md:w-[18rem] lg:w-[20rem] xl:w-[22rem]">
                    <Image src="/assets/images/GIFs/loading.webp" fill priority alt="loading" unoptimized />
                </div>
            </div>
        </div>
    );
}
