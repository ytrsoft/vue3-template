import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import compression from 'vite-plugin-compression'
import imagemin from 'vite-plugin-imagemin'
import inspect from 'vite-plugin-inspect'
import progress from 'vite-plugin-progress'
import legacy from '@vitejs/plugin-legacy'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  // 解决依赖重复问题，确保只有一个版本的 Vue 和 Ant Design Vue
  resolve: {
    dedupe: ['vue', 'vue-router', 'ant-design-vue'],
  },
  plugins: [
    // 配置mock
    viteMockServe({
      mockPath: 'mock',
      ignore: /^_/,
      watchFiles: true,
      enable: true,
      logger: true,
      cors: true
    }),
    // 支持 Vue 3 单文件组件
    vue(),
    // 支持 Vue 3 JSX 语法
    vueJsx(),
    // 集成 Tailwind CSS
    tailwindcss(),
    // 提供传统浏览器兼容性支持
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    // 自动导入 Vue、Vue Router 和 VueUse 的 API
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      resolvers: [AntDesignVueResolver()],
      eslintrc: {
        enabled: true
      }
    }),
    // 自动导入组件，主要针对 Ant Design Vue 组件
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'less',  // 使用 less 样式
          resolveIcons: true    // 解析 Ant Design Vue 图标
        }),
      ],
      dts: 'src/components.d.ts',
      dirs: ['src/components'],
      deep: true
    }),
    // 创建 SVG 图标集合，便于统一管理和使用
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    // 构建时生成 gzip 压缩文件
    compression({
      algorithm: 'gzip',
      threshold: 10240,  // 大于 10KB 的文件才进行压缩
    }),
    // 构建时生成 brotli 压缩文件
    compression({
      algorithm: 'brotliCompress',
      threshold: 10240,
    }),
    // 压缩图片资源，减小包体积
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
    // 调试 Vite 插件的工具
    inspect(),
    // 显示构建进度
    progress()
  ],
  server: {
    host: true,                // 监听所有地址
    port: 3000,                // 开发服务器端口
    open: true,                // 自动打开浏览器
    hmr: {
      overlay: true            // 显示 HMR 错误覆盖层
    },
    fs: {
      strict: true             // 严格模式，防止访问项目外文件
    },
    // API 请求代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true
      }
    }
  },
  build: {
    target: 'esnext',          // 构建目标为现代浏览器
    outDir: 'dist',            // 输出目录
    assetsDir: 'assets',       // 静态资源目录
    assetsInlineLimit: 4096,   // 小于 4KB 的资源内联为 base64
    cssCodeSplit: true,        // 启用 CSS 代码分割
    sourcemap: process.env.NODE_ENV === 'development', // 开发环境生成 sourcemap
    chunkSizeWarningLimit: 1000, // 分块大小警告阈值（KB）
    minify: 'terser',          // 使用 terser 进行代码压缩
    terserOptions: {
      compress: {
        drop_console: true,    // 移除 console 语句
        drop_debugger: true    // 移除 debugger 语句
      }
    },
    rollupOptions: {
      output: {
        // 手动控制模块分块策略
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const module = id.split('node_modules/')[1].split('/')[0]
            if (module.includes('ant-design-vue')) return 'ant-design'
            if (module.includes('vue') || module.includes('vue-router')) return 'vue'
            return `vendor-${module}`
          }
        },
        // 自定义输出文件名格式
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 启用 Less 中的 JavaScript 表达式
        modifyVars: {}           // 自定义主题变量
      }
    },
    transformer: 'lightningcss', // 使用 lightningcss 作为 CSS 转换工具
    lightningcss: {
      drafts: {
        customMedia: true       // 启用自定义媒体查询
      }
    }
  },
  // 定义全局变量，这里将应用版本号注入到应用中
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'ant-design-vue'],
    exclude: []
  }
})
