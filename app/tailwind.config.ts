import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        colors: {
            danger: "#ff0000",
            categoryCharity: "#ff0000",
            categoryFilm: "#e00000",
            categoryPlay: "#c00000",
            categoryExhibition: "#800000",
            categoryConcert: "#363183",
            categoryClubbing: "#300860",
            categoryForChildren: "#f57c1f",
            categorySport: "#499f1c",
            categoryFestival: "#ffd700",
            categoryInCity: "#587e60",
            categoryGastronomy: "#f6eee3",
            shade800: "#424242",
            shade200: "#c9c9c9",
            shade100: "#ececec",
            shade50: "#f5f5f5",
        },
    },
    plugins: [],
};
export default config;
