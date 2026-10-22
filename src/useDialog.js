import { useEffect, useRef } from 'react'

export default function useDialog(close) {
  const ref = useRef(null)
  const onClose = useRef(close)
  onClose.current = close
  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current
    const controls = () => [...dialog.querySelectorAll('button:not(:disabled), input:not([type=hidden]):not([hidden]), select, textarea, [tabindex="0"]')]
    controls()[0]?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose.current() }
      if (event.key !== 'Tab') return
      const items = controls(), first = items[0], last = items.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    dialog.addEventListener('keydown', handleKey)
    return () => { dialog.removeEventListener('keydown', handleKey); previous?.focus() }
  }, [])
  return ref
}
