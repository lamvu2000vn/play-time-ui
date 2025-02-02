import {defineRouting} from "next-intl/routing";
import {createNavigation} from "next-intl/navigation";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["ar", "en", "es", "fr", "hi", "ja", "pt", "ru", "vi", "zh"],

    // Used when no locale matches
    defaultLocale: "vi",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
