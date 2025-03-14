import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import AuthMiddleware from "@/components/Middlewares/AuthMiddleware";
import {Toastify} from "@/components/UI";
import AppSetup from "./AppSetup";
import Audio from "@/components/Audio";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {Locales} from "@/helpers/shared/types";
import FetchData from "./FetchData";
import ReduxStoreProvider from "./ReduxStoreProvider";

const roboto = Roboto({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "PlayTime | Time to play & relax",
    description: "An online gaming application",
};

interface Props {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
}

export default async function RootLayout(props: Props) {
    const {children, params} = props;
    const {locale} = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as Locales)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html data-theme="light" lang={locale}>
            <body className={`${roboto.className} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <ReduxStoreProvider>
                        <AppSetup>
                            <Toastify />
                            <Audio />
                            <AuthMiddleware>
                                <FetchData>
                                    <App>{children}</App>
                                </FetchData>
                            </AuthMiddleware>
                        </AppSetup>
                    </ReduxStoreProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
