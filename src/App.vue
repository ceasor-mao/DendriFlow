<template>
  <div 
    class="canvas-container overflow-hidden"
    @mousedown="onMouseDown"
  >
    <div 
      class="background-pattern"
      :style="[backgroundStyle, transformStyle]"
    >
      <div class="content-layer">
        123
        <!-- 你的笔记内容 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, transformVNodeArgs } from 'vue'

const patternType = ref('grid') // 'grid' or 'dots'
const gridSize = ref(24)
const lineColor = ref('rgba(0, 0, 0, 0.1)')

const offset = ref({ x:0, y:0 })
const startPos = ref({ x:0, y:0 })
const isDragging = ref(false)

const maxOffset = {
  x: 2000,   // 允许最大右移2000px
  y: 2000    // 允许最大下移2000px
}

const backgroundStyle = computed(() => {
  if (patternType.value === 'grid') {
    return {
      backgroundImage: `
        linear-gradient(${lineColor.value} 1px, transparent 1px),
        linear-gradient(90deg, ${lineColor.value} 1px, transparent 1px)
      `,
      backgroundSize: `${gridSize.value}px ${gridSize.value}px`
    }
  } else {
    return {
      backgroundImage: `radial-gradient(${lineColor.value} 1px, transparent 1px)`,
      backgroundSize: `${gridSize.value}px ${gridSize.value}px`,
      backgroundPosition: `-${gridSize.value / 2}px -${gridSize.value / 2}px`
    }
  }
})

const transformStyle = computed(() => ({
  transform: `translate(${offset.value.x}px, ${offset.value.y}px)`
}))

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const onMouseDown = (e) => {
  if (e.button === 1) {
    e.preventDefault()
    isDragging.value = true
    startPos.value = { x: e.clientX, y: e.clientY }
    document.body.style.cursor = 'grabbing'
  }
}

const onMouseMove = (e) => {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - startPos.value.x
  const deltaY = e.clientY - startPos.value.y
  
  const newOffset = {
    x: clamp(offset.value.x + deltaX, -maxOffset.x, maxOffset.x),
    y: clamp(offset.value.y + deltaY, -maxOffset.y, maxOffset.y)
  }
  offset.value = newOffset
  
  startPos.value = { x: e.clientX, y: e.clientY }
}

const onMouseUp = () => {
  isDragging.value = false
  document.body.style.cursor = 'default'
}

onMounted(() => {
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onMouseMove)
})

defineExpose({
  patternType,
  gridSize,
  lineColor
})
</script>

<style>
.background-pattern {
  position: absolute;
  width: calc(100% + 4000px);
  height: calc(100% + 4000px);
  z-index: 0;
  background-image: 
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}

.content-layer {
  position: relative;
  z-index: 1;
  transform: translate(-50%, -50%);
  left: 50%;
  height: 50%;
}

.overflow-hidden {
  overflow: hidden !important;
}
.canvas-container {
  position: fixed; /* 使用fixed定位防止页面空间计算 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overscroll-behavior: none; /* 阻止边缘回弹效果 */
}
/* Chrome/Safari */
::-webkit-scrollbar {
  display: none;
}
html {
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
</style>
