import Link from "next/link";
import {Container} from "../UI";
import {GoHomeFill} from "react-icons/go";

export default function NotFoundPage() {
    return (
        <div className="fixed z-[100] left-0 top-0 w-full h-full bg-base-100">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
                <Container>
                    <div className="flex items-center gap-4 mb-16">
                        <h1 className="text-5xl font-bold">404</h1>
                        <div className="w-2 h-7 bg-base-content"></div>
                        <h1 className="text-3xl font-semibold">Page not found</h1>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-base">
                            <GoHomeFill />
                            Home
                        </Link>
                    </div>
                </Container>
            </div>
        </div>
    );
}
