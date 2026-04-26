import { ref, onUnmounted } from 'vue'

export function useCountUp (target: number, duration = 1500) {
  const current = ref(0)
  let   start: number | null = null
  let   raf: number

  function step (timestamp: number) {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    const ease     = 1 - Math.pow(1 - progress, 3)
    current.value  = Math.round(ease * target)
    if (progress < 1) raf = requestAnimationFrame(step)
  }

  function animate () {
    current.value = 0
    start         = null
    raf           = requestAnimationFrame(step)
  }

  onUnmounted(() => cancelAnimationFrame(raf))

  return { current, animate }
}
