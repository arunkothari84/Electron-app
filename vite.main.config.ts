import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/main/assets/lucid-icon.png",
          dest: "assets",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
