export default function WaitingMatchResults() {
    return (
        <div className="absolute left-0 top-0 w-full h-full z-50">
            <div className="w-full h-full flex items-center justify-center bg-neutral/90">
                <div className="p-8 w-full flex items-end justify-center gap-2 text-neutral-content">
                    <h1 className="text-base sm:text-xl md:text-3xl font-semibold">Đang xử lý kết quả</h1>
                    <span className="loading loading-dots loading-sm md:loading-md"></span>
                </div>
            </div>
        </div>
    );
}
