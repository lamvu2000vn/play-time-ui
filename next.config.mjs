import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Xss-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Access-Control-Allow-Credentials",
                        value: "true",
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, DELETE, PATCH, POST, PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "*",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "same-origin",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: process.env.REMOTE_PATTERN_PROTOCOL,
                hostname: process.env.REMOTE_PATTERN_HOSTNAME,
                port: process.env.NODE_ENV === "development" ? process.env.REMOTE_PATTERN_PORT : undefined,
                pathname: process.env.REMOTE_PATTERN_PATHNAME,
            },
        ],
    },
    poweredByHeader: false,
};

export default withNextIntl(nextConfig);
