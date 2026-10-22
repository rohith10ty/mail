import { describe, expect, it, vi } from 'vitest'
import { createThemeTransition, waveFrames } from '../lib/themeTransition'

function harness({ native = true, reduced = false, fail = false } = {}) {
  const root = { dataset: { theme: 'light' }, style: {}, animate: vi.fn(() => ({ finished: Promise.resolve() })) }
  const commit = vi.fn(theme => expect(root.dataset.theme).toBe(theme))
  const skipTransition = vi.fn()
  const doc = { documentElement: root }
  if (native) doc.startViewTransition = vi.fn(update => {
    const ready = Promise.resolve().then(() => {
      update()
      expect(root.dataset.theme).toBe('dark')
      if (fail) throw new Error('Capture skipped')
    })
    return { ready, finished: ready, skipTransition }
  })
  const win = { innerWidth: 1440, innerHeight: 900, matchMedia: () => ({ matches: reduced }) }
  return { root, doc, commit, skipTransition, toggle: createThemeTransition({ document: doc, window: win, commit }) }
}

describe('theme wave', () => {
  it('commits resolved colors before capture and animates the new snapshot', async () => {
    const h = harness()
    await h.toggle()
    expect(h.commit).toHaveBeenCalledExactlyOnceWith('dark')
    expect(h.root.animate).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ duration: 820, pseudoElement: '::view-transition-new(root)' }))
    expect(h.root.dataset.themeTransition).toBeUndefined()
  })
  it('prevents overlapping toggles', async () => {
    const h = harness()
    const first = h.toggle()
    expect(h.toggle()).toBe(first)
    await first
    expect(h.doc.startViewTransition).toHaveBeenCalledTimes(1)
  })
  it.each([{ native: false }, { reduced: true }])('supports a direct fallback: %j', async options => {
    const h = harness(options)
    await h.toggle()
    expect(h.root.dataset.theme).toBe('dark')
    await h.toggle()
    expect(h.root.dataset.theme).toBe('light')
    expect(h.root.animate).not.toHaveBeenCalled()
  })
  it('leaves a usable theme when browser snapshot capture fails', async () => {
    const h = harness({ fail: true })
    await h.toggle()
    expect(h.commit).toHaveBeenCalledTimes(1)
    expect(h.skipTransition).toHaveBeenCalledOnce()
    expect(h.root.dataset.themeTransition).toBeUndefined()
  })
  it.each([[320, 568], [768, 1024], [1024, 768], [1440, 900]])('covers the full %sx%s viewport without a clipped final edge', (width, height) => {
    const frames = waveFrames(width, height)
    const xs = frame => [...frame.clipPath.matchAll(/(-?[\d.]+)px (-?[\d.]+)px/g)].slice(1, -1).map(match => Number(match[1]))
    expect(xs(frames[0]).every(x => x < 0)).toBe(true)
    expect(xs(frames.at(-1)).every(x => x > width)).toBe(true)
    expect(new Set(frames.map(frame => frame.clipPath.split(',').length)).size).toBe(1)
  })
})
