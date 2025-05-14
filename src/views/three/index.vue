<template>
  <div class="relative w-full h-[500px]">
    <!-- 3D渲染容器 -->
    <div ref="container" class="w-full h-full bg-gray-100 rounded-lg shadow-inner overflow-hidden" />

    <!-- 加载状态指示器 -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
      <div class="text-center p-6 bg-white/90 rounded-xl shadow-xl transform transition-all">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p class="text-lg font-medium text-gray-800">加载模型中...</p>
        <p class="text-sm text-gray-500 mt-2" v-if="progress > 0">{{ progress.toFixed(1) }}%</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
      <div class="text-center p-6 bg-white/90 rounded-xl shadow-xl transform transition-all">
        <div class="text-4xl text-red-500 mb-4">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
        <p class="text-lg font-medium text-gray-800">加载失败</p>
        <p class="text-sm text-gray-600 mt-2">{{ error }}</p>
        <button
          @click="retryLoad"
          class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div v-if="!loading && !error" class="absolute top-4 right-4 z-10 flex space-x-2">
      <button
        @click="resetView"
        class="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all"
        title="重置视图"
      >
        <i class="fa fa-refresh"></i>
      </button>
      <button
        @click="toggleWireframe"
        class="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all"
        title="线框模式"
      >
        <i class="fa fa-cubes"></i>
      </button>
      <button
        @click="toggleFullscreen"
        class="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all"
        title="全屏显示"
      >
        <i class="fa fa-expand"></i>
      </button>
      <button
        @click="toggleModelType"
        class="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all"
        title="切换模型格式"
      >
        <i class="fa fa-exchange-alt"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

// 定义响应式状态
const container = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const progress = ref(0)
const wireframe = ref(false)
const isFullscreen = ref(false)

// 模型格式和路径
enum ModelType {
  FBX = 'fbx',
  OBJ = 'obj'
}

const modelType = ref(ModelType.FBX)
const modelPath = ref('/models/rose.fbx')
const modelPathObj = ref('/models/rose.obj')
const modelPathMtl = ref('/models/rose.mtl')

// Three.js对象
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let model: THREE.Group | null = null
let originalCameraPosition: THREE.Vector3 | null = null
let originalCameraLookAt: THREE.Vector3 | null = null
let wireframeMeshes: THREE.Mesh[] = []

// 初始化Three.js场景
const initThreeJS = () => {
  if (!container.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true // 支持透明背景
  })
  renderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true // 启用阴影

  // 添加到DOM
  container.value.appendChild(renderer.domElement)

  // 添加控制器
  if (camera && renderer.domElement) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.enableZoom = true
    controls.enablePan = true
  }

  // 添加光源
  addLights()

  // 加载模型
  loadModel()

  // 开始动画循环
  animate()
}

// 添加光源
const addLights = () => {
  if (!scene) return

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 主平行光（模拟太阳光）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 辅助光
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
  fillLight.position.set(-5, 5, -3)
  scene.add(fillLight)

  // 底部光（增强立体感）
  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3)
  bottomLight.position.set(0, -1, 0)
  scene.add(bottomLight)
}

// 加载3D模型
const loadModel = () => {
  if (!scene || !camera || !renderer) return

  loading.value = true
  error.value = null
  progress.value = 0

  // 移除现有模型
  if (model && scene) {
    scene.remove(model)
    model = null
  }

  // 清除线框
  removeWireframe()

  // 根据模型类型选择加载器
  if (modelType.value === ModelType.FBX) {
    const loader = new FBXLoader()

    loader.load(
      modelPath.value,
      (fbx) => {
        model = fbx

        // 启用阴影投射和接收
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true

            // 优化网格渲染
            child.geometry.attributes.position.needsUpdate = true
            child.geometry.attributes.normal.needsUpdate = true
          }
        })

        // 调整模型大小和位置
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // 计算缩放比例使模型适合视口
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = maxDim > 0 ? 5 / maxDim : 1

        model.scale.set(scale, scale, scale)
        model.position.sub(center) // 居中模型

        // 添加到场景
        scene.add(model)

        // 保存原始相机位置和目标点
        originalCameraPosition = camera.position.clone()
        originalCameraLookAt = new THREE.Vector3(0, 0, 0)

        // 自动调整相机位置以适应模型
        camera.position.set(0, 0, maxDim * 1.5)
        camera.lookAt(0, 0, 0)

        if (controls) {
          controls.target.set(0, 0, 0)
          controls.update()
        }

        loading.value = false
      },
      (progressEvent) => {
        if (progressEvent.total > 0) {
          progress.value = (progressEvent.loaded / progressEvent.total) * 100
        }
      },
      (err) => {
        console.error('加载失败:', err)
        error.value = err.message
        loading.value = false
      }
    )
  } else if (modelType.value === ModelType.OBJ) {
    const mtlLoader = new MTLLoader()

    // 加载材质文件
    mtlLoader.load(
      modelPathMtl.value,
      (materials) => {
        materials.preload()

        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)

        // 加载OBJ模型
        objLoader.load(
          modelPathObj.value,
          (obj) => {
            model = obj

            // 启用阴影投射和接收
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true

                // 优化网格渲染
                child.geometry.attributes.position.needsUpdate = true
                child.geometry.attributes.normal.needsUpdate = true
              }
            })

            // 调整模型大小和位置
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            // 计算缩放比例使模型适合视口
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = maxDim > 0 ? 5 / maxDim : 1

            model.scale.set(scale, scale, scale)
            model.position.sub(center) // 居中模型

            // 添加到场景
            scene.add(model)

            // 保存原始相机位置和目标点
            originalCameraPosition = camera.position.clone()
            originalCameraLookAt = new THREE.Vector3(0, 0, 0)

            // 自动调整相机位置以适应模型
            camera.position.set(0, 0, maxDim * 1.5)
            camera.lookAt(0, 0, 0)

            if (controls) {
              controls.target.set(0, 0, 0)
              controls.update()
            }

            loading.value = false
          },
          (progressEvent) => {
            if (progressEvent.total > 0) {
              progress.value = (progressEvent.loaded / progressEvent.total) * 100
            }
          },
          (err) => {
            console.error('加载失败:', err)
            error.value = err.message
            loading.value = false
          }
        )
      },
      (progressEvent) => {
        console.log(`加载材质: ${(progressEvent.loaded / progressEvent.total * 100)}%`)
      },
      (err) => {
        console.error('加载材质失败:', err)
        // 材质加载失败时尝试不使用材质加载模型
        const objLoader = new OBJLoader()

        objLoader.load(
          modelPathObj.value,
          (obj) => {
            // 后续处理与上面相同...
            model = obj
            // 后续代码与上面相同...
          },
          null,
          (err) => {
            console.error('加载OBJ失败:', err)
            error.value = err.message
            loading.value = false
          }
        )
      }
    )
  }
}

// 重试加载模型
const retryLoad = () => {
  loadModel()
}

// 重置视图
const resetView = () => {
  if (camera && controls && originalCameraPosition && originalCameraLookAt) {
    camera.position.copy(originalCameraPosition)
    controls.target.copy(originalCameraLookAt)
    controls.update()
  }
}

// 切换线框模式
const toggleWireframe = () => {
  wireframe.value = !wireframe.value

  if (!model || !scene) return

  if (wireframe.value) {
    // 创建线框
    model.traverse((child) => {
      if (child.isMesh) {
        const wireframeGeometry = new THREE.WireframeGeometry(child.geometry)
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.2
        })

        const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
        child.add(wireframeMesh)
        wireframeMeshes.push(wireframeMesh)
      }
    })
  } else {
    // 移除线框
    removeWireframe()
  }
}

// 移除线框
const removeWireframe = () => {
  if (!model) return

  wireframeMeshes.forEach((mesh) => {
    if (model) model.remove(mesh)
  })
  wireframeMeshes = []
}

// 切换全屏
const toggleFullscreen = () => {
  const element = container.value

  if (!element) return

  if (!isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) { /* Safari */
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) { /* IE11 */
      element.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen()
    }
  }

  isFullscreen.value = !isFullscreen.value
}

// 切换模型类型
const toggleModelType = () => {
  modelType.value = modelType.value === ModelType.FBX ? ModelType.OBJ : ModelType.FBX
  loadModel()
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)

  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}

// 响应窗口大小变化
const handleResize = () => {
  if (camera && renderer && container.value) {
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(
      container.value.clientWidth,
      container.value.clientHeight
    )
  }
}

// 生命周期钩子
onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
  // 清理资源防止内存泄漏
  if (controls) controls.dispose()
  if (renderer) {
    renderer.dispose()
  }
  if (model && scene) {
    scene.remove(model)
  }
  if (container.value && renderer) {
    container.value.removeChild(renderer.domElement)
  }
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  // 重置变量
  scene = null
  camera = null
  renderer = null
  controls = null
  model = null
  originalCameraPosition = null
  originalCameraLookAt = null
  wireframeMeshes = []
})

// 监听模型类型变化
watch(modelType, (newType) => {
  if (newType) {
    loadModel()
  }
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  width: 100%;
  height: 500px;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 加载动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>
