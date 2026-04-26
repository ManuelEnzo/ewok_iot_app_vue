import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver (threshold = 0.15) {
  const isVisible = ref(false)
  const target    = ref<Element | null>(null)
  let   observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      { threshold }
    )
    if (target.value) observer.observe(target.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { isVisible, target }
}
