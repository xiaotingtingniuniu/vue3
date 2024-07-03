import vue from "@vitejs/plugin-vue";
import { pathResolve } from "./utils";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import type { PluginOption } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { configCompressPlugin } from "./compress";
import { visualizer } from "rollup-plugin-visualizer";
import { themePreprocessorPlugin } from "@pureadmin/theme";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { genScssMultipleScopeVars } from "../src/layout/theme";
import commonjs from "@rollup/plugin-commonjs";

export function getPluginsList(
  VITE_COMPRESSION: ViteCompression
): PluginOption[] {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    commonjs() as any,
    vue(),
    // jsx、tsx语法支持
    vueJsx(),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [pathResolve("../locales/**")]
    }),
    viteBuildInfo(),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    // svg组件化支持
    svgLoader(),
    configCompressPlugin(VITE_COMPRESSION),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : (null as any)
  ];
}
