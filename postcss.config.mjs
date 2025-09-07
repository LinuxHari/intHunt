import cssnanoPlugin from "cssnano";

const config = {
  plugins: ["@tailwindcss/postcss", cssnanoPlugin({ preset: "default" })],
};

export default config;
