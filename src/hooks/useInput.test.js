import { describe, it, expect } from 'vitest'
import { useInput } from './useInput'

describe('useInput hook', () => {
  it('initializes with default value', () => {
    const { value } = useInput('initial')
    expect(value.value).toBe('initial')
  })

  it('updates value on change event', () => {
    const { value, onChange } = useInput('')
    
    const mockEvent = {
      target: { value: 'new value' }
    }
    
    onChange(mockEvent)
    expect(value.value).toBe('new value')

    onChange({})
    expect(value.value).toBe('new value')
  })

  it('resets value to default', () => {
    const { value, onChange, reset } = useInput('default')
    
    onChange({ target: { value: 'changed' } })
    expect(value.value).toBe('changed')

    reset()
    expect(value.value).toBe('default')
  })
})