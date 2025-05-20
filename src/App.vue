<script setup>
import { ref, computed } from 'vue'

// 响应式参数
const patternType = ref('dots') // 'grid' 或 'dots'
const gridSize = ref(24)
const lineColor = ref('rgba(0, 0, 0, 0.1)')

// 计算背景样式
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

// 如果需要暴露参数给父组件
defineExpose({
  patternType,
  gridSize,
  lineColor
})
</script>

<template>
  <div 
    class="background-pattern"
    :style="backgroundStyle"
  >
    <div class="content-layer">
      123
      <!-- 你的笔记内容 -->
    </div>
  </div>
</template>

<style>
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-image: 
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}

.content-layer {
  position: relative;
  z-index: 1;
  height: 100%;
}
</style>
