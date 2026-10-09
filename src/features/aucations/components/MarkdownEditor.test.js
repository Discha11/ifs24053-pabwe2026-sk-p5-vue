import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from './MarkdownEditor.vue'
import Editor from '@toast-ui/editor'

let mockChangeCallback
const mockGetMarkdown = vi.fn(() => '# Hello World')
const mockSetMarkdown = vi.fn()
const mockDestroy = vi.fn()

vi.mock('@toast-ui/editor', () => {
  return {
    default: vi.fn().mockImplementation(function (options) {
      mockChangeCallback = options?.events?.change
      return {
        getMarkdown: mockGetMarkdown,
        setMarkdown: mockSetMarkdown,
        destroy: mockDestroy
      }
    })
  }
})

describe('MarkdownEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes Editor instance and handles change event', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Initial text',
        height: '400px'
      }
    })

    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        height: '400px',
        initialValue: 'Initial text'
      })
    )

    // Trigger change callback
    if (mockChangeCallback) {
      mockChangeCallback()
    }

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['# Hello World'])

    await wrapper.setProps({ modelValue: 'Updated external text' })
    expect(mockSetMarkdown).toHaveBeenCalledWith('Updated external text')

    // Test when newVal matches getMarkdown
    await wrapper.setProps({ modelValue: '# Hello World' })

    // Test when newVal is empty/null
    await wrapper.setProps({ modelValue: null })
    expect(mockSetMarkdown).toHaveBeenCalledWith('')

    wrapper.unmount()
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('initializes with default props when no props are provided', () => {
    const wrapper = mount(MarkdownEditor)
    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        height: '300px',
        initialValue: ''
      })
    )
  })
})
