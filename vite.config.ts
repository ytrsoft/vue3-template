import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      resolvers: [
        AntDesignVueResolver()
      ],
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'less'
        })
      ],
      dts: 'components.d.ts'
    })
  ]
})
