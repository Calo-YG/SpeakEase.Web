import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { resolve } from 'path'
import { createStyleImportPlugin } from 'vite-plugin-style-import'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    vueJsx(),
    VueSetupExtend(),
    createStyleImportPlugin({
      libs: [
          {
              libraryName: 'element-plus',
              esModule: true,
              resolveStyle: (name) => {
                  return `element-plus/lib/theme-chalk/${name}.css`;
              },
              ensureStyleFile: true // 忽略文件是否存在, 导入不存在的CSS文件时防止错误。
          }
      ]
  })],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  server: {
    port: 8080, //启动端口
    hmr: {
        host: '127.0.0.1',
        port: 8080
    },
    // 设置 https 代理
    proxy: {
        '/api': {
            target: 'your https address',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, '')
        }
    }
}
})
