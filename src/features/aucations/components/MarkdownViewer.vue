<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const viewerRef = ref(null)
let viewerInstance = null

onMounted(() => {
  viewerInstance = Editor.factory({
    el: viewerRef.value,
    viewer: true,
    initialValue: props.content || ''
  })
})

watch(() => props.content, (newVal) => {
  viewerInstance.setMarkdown(newVal || '')
})

onBeforeUnmount(() => {
  viewerInstance.destroy()
  viewerInstance = null
})
</script>

<template>
  <div class="toast-ui-viewer-container">
    <div ref="viewerRef"></div>
  </div>
</template>
