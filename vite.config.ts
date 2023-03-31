import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'

const renameIndexPlugin = () : PluginOption => {
  return {
    name: 'renameIndex',
    enforce: 'post',
    generateBundle(_, bundle) {
      const indexHtml = bundle['index.html']
      indexHtml.fileName = '404.html'
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    renameIndexPlugin(),
  ],
  build: {
    outDir: './docs',
    rollupOptions: {
      output: {
        dir: 'docs',
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'assets/[name].js',
      },
    }
  }
})
