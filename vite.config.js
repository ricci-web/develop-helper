import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 启用运行时编译
          runtimeCompilerBuild: true,
        },
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/Users/shinxiao/前端/2-自建项目/layout-helper/src",
      // 使用包含编译器的 Vue 构建版本
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
});
