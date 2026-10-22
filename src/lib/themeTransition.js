// Circular ripple transition originating from the theme toggle coordinates, matching Dashboard V14.
export function waveFrames(width, height) {
  const amplitude = Math.min(width * 0.12, 190)
  return Array.from({ length: 41 }, (_, frame) => {
    const progress = frame / 40
    const front = -amplitude * 2 + progress * (width + amplitude * 4)
    const edge = Array.from({ length: 33 }, (_, point) => {
      const y = point / 32
      const bend = Math.cos(y * Math.PI * 1.8 - 0.7 + progress * 0.6)
      return `${(front + bend * amplitude).toFixed(2)}px ${(y * height).toFixed(2)}px`
    })
    return { clipPath: `polygon(-${amplitude * 3}px 0px, ${edge.join(', ')}, -${amplitude * 3}px ${height}px)`, offset: progress }
  })
}

export function circleFrames(x, y, maxRadius) {
  return [
    { clipPath: `circle(0px at ${x}px ${y}px)` },
    { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
  ]
}

export function createThemeTransition({ document: doc, window: win, commit }) {
  let pending = null
  async function run(event) {
    const root = doc.documentElement
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    let applied = false
    const apply = () => {
      if (applied) return
      // The snapshot must see the new CSS variables AND React state together.
      root.dataset.theme = theme
      root.style.colorScheme = theme
      commit(theme)
      applied = true
    }
    const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reducedMotion) {
      apply()
      return
    }
    let transition
    root.dataset.themeTransition = 'active'
    try {
      transition = doc.startViewTransition(apply)
      // Attach the rejection handler immediately (hidden tabs can skip capture).
      const finished = transition.finished.catch(() => {})
      await transition.ready

      const width = win.innerWidth || 1440
      const height = win.innerHeight || 900
      let x = 40
      let y = 60
      if (event && typeof event.clientX === 'number' && event.clientX > 0) {
        x = event.clientX
        y = event.clientY
      } else if (event?.target && typeof event.target.getBoundingClientRect === 'function') {
        const rect = event.target.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
      const maxRadius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
      const frames = circleFrames(x, y, maxRadius)

      const animation = root.animate(frames, {
        duration: 820,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-new(root)',
      })
      await animation.finished
      await finished
    } catch {
      transition?.skipTransition()
      apply()
    } finally {
      delete root.dataset.themeTransition
    }
  }
  return (event) => {
    // Repeated clicks cannot start overlapping snapshot animations.
    if (!pending) pending = run(event).finally(() => { pending = null })
    return pending
  }
}
