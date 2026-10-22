import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function useLenisContainer() {
  const ref = useRef(null)

  useEffect(() => {
    const wrapper = ref.current
    const content = wrapper?.firstElementChild
    if (!wrapper || !content) return

    const lenis = new Lenis({
      wrapper,
      content,
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: true,
      overscroll: false,
    })

    return () => lenis.destroy()
  }, [])

  return ref
}
