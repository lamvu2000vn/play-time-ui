import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="fixed left-0 top-0 z-[200] w-full h-full bg-base-100">
            <div className="w-full h-full flex items-center justify-center">
                <Image
                    src="/assets/images/GIFs/loading.webp"
                    width={256}
                    height={256}
                    priority
                    alt="loading"
                    unoptimized
                />
            </div>
        </div>
    );
}
