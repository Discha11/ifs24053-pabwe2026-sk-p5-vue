import { ref } from 'vue'

export function useInput(defaultValue = '') {
  const value = ref(defaultValue)

  const onChange = (event) => {
    const target = event.target
    if (target) {
      value.value = target.value
    }
  }

  const reset = () => {
    value.value = defaultValue
  }

  return {
    value,
    onChange,
    reset
  }
}