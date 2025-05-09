export type IdleEffect = () => void

export const runWhenIdle = (effect?: IdleEffect) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback((deadline) => {
      if (deadline.timeRemaining() > 0) {
        effect && effect()
      }
    })
  } else {
    setTimeout(() => {
      effect && effect()
    }, 0)
  }
}
