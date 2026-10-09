<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '300px'
  },
  placeholder: {
    type: String,
    default: 'Tulis deskripsi lelang di sini...'
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
let editorInstance = null

onMounted(() => {
  editorInstance = new Editor({
    el: editorRef.value,
    height: props.height,
    initialEditType: 'markdown',
    previewStyle: 'tab',
    initialValue: props.modelValue || '',
    placeholder: props.placeholder,
    events: {
      change: () => {
        emit('update:modelValue', editorInstance.getMarkdown())
      }
    }
  })
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== editorInstance.getMarkdown()) {
    editorInstance.setMarkdown(newVal || '')
  }
})

onBeforeUnmount(() => {
  editorInstance.destroy()
  editorInstance = null
})
</script>

<template>
  <div class="toast-ui-editor-container">
    <div ref="editorRef"></div>
  </div>
</template>
