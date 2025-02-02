"use client"; // Error components must be Client Components

import MyError from "@/components/Pages/MyError";

export default function Error({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
    return <MyError error={error} reset={reset} />;
}
