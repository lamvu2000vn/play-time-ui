import type {Config} from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            width: {
                "6xl": "72rem",
                "7xl": "80rem",
            },
            boxShadow: {
                "custom-1": "var(--shadow-color) 0px 0px 16px 0px",
            },
            keyframes: {
                shine: {
                    "0%": {transform: "translateX(-100%)"},
                    "100%": {transform: "translateX(100%)"},
                },
                "custom-bounce": {
                    "0%": {transform: "translateY(0)"},
                    "50%": {transform: "translateY(.5rem)"},
                    "100%": {transform: "translateY(0)"},
                },
            },
            animation: {
                shine: "shine 3s linear infinite",
                "custom-bounce": "custom-bounce 1s linear infinite",
            },
            fontSize: {
                "2xs": ".5rem",
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                myLightTheme: {
                    primary: "#FF6B6B",
                    secondary: "#3D84FF",
                    accent: "#FFB320",
                    neutral: "#2b3440",
                    "neutral-content": "#d7dde4",
                    "base-100": "#FFFFFF",
                    "base-200": "#F2F2F2",
                    "base-300": "#E6E6E6",
                    "base-content": "#2E2E2E",
                },
                myDarkTheme: {
                    primary: "#FF6B6B",
                    secondary: "#3D84FF",
                    accent: "#FFB320",
                    neutral: "#2a323c",
                    "neutral-content": "#a6adbb",
                    "base-100": "#1d232a",
                    "base-200": "#191e24",
                    "base-300": "#15191e",
                    "base-content": "#a6adbb",
                },
            },
        ],
    },
};
export default config;
