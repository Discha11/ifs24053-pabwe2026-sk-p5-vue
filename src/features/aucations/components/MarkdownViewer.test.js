import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownViewer from './MarkdownViewer.vue'
import Editor from '@toast-ui/editor'

const mockSetMarkdown = vi.fn()
const mockDestroy = vi.fn()

vi.mock('@toast-ui/editor', () => {
  return {
    default: {
      factory: vi.fn().mockImplementation((options) => {
        return {
          setMarkdown: mockSetMarkdown,
          destroy: mockDestroy
        }
      })
    }
  }
})

describe('MarkdownViewer.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes Editor factory on mount and destroys on unmount', async () => {
    const wrapper = mount(MarkdownViewer, {
      props: {
        content: '# Test Viewer'
      }
    })

    expect(Editor.factory).toHaveBeenCalledWith(
      expect.objectContaining({
        viewer: true,
        initialValue: '# Test Viewer'
      })
    )

    await wrapper.setProps({ content: '# Updated Content' })
    expect(mockSetMarkdown).toHaveBeenCalledWith('# Updated Content')

    wrapper.unmount()
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('handles empty initial content and watcher update with falsy value', async () => {
    const wrapper = mount(MarkdownViewer, {
      props: {
        content: ''
      }
    })

    expect(Editor.factory).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: ''
      })
    )

    await wrapper.setProps({ content: null })
    expect(mockSetMarkdown).toHaveBeenCalledWith('')
  })
})
