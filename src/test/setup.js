import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Component tests exercise application state; Lenis geometry needs a real viewport.
vi.mock('lenis/react', () => ({ ReactLenis: ({ children }) => children }))
vi.mock('../useLenisContainer', async () => {
  const { useRef } = await import('react')
  return { default: () => useRef(null) }
})
vi.mock('../lib/attachments', () => ({ storeAttachment: async file => ({ name: file.name, key: 'test-file', size: file.size }), downloadAttachment: vi.fn() }))
window.matchMedia = vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
afterEach(() => {
  cleanup()
  localStorage.clear()
  window.history.replaceState({}, '', '/')
  vi.restoreAllMocks()
})
