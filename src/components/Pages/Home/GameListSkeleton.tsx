export default function GameListSkeleton() {
    return (
        <div className="py-12 lg:py-20 mx-8">
            <div className="flex justify-center mb-12">
                <div className="skeleton w-32 h-6"></div>
            </div>
            <div className="flex justify-center">
                <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="skeleton w-full h-36"></div>
                        <div className="skeleton w-full h-8"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="skeleton w-full h-36"></div>
                        <div className="skeleton w-full h-8"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="skeleton w-full h-36"></div>
                        <div className="skeleton w-full h-8"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="skeleton w-full h-36"></div>
                        <div className="skeleton w-full h-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
