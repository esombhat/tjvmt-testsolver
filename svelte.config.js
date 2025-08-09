// svelte.config.js
import adapter from "@sveltejs/adapter-vercel"; // <-- CHANGE THIS
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter(), // <-- AND CHANGE THIS
  },
};

export default config;
