import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default function LandingScrollAnimations() {
  useLayoutEffect(() => {
    const root = document.querySelector('.tpl-site')
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger, SplitText)
    const splits: ReturnType<typeof SplitText.create>[] = []
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.landing-card-heading').forEach((heading) => {
        const split = SplitText.create(heading, { type: 'chars' })
        splits.push(split)
        gsap.fromTo(
          split.chars,
          { autoAlpha: 0, yPercent: 70 },
          {
            autoAlpha: 1,
            yPercent: 0,
            ease: 'none',
            stagger: 0.018,
            scrollTrigger: {
              trigger: heading,
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.6,
            },
          },
        )
      })
    }, root)

    return () => {
      context.revert()
      splits.forEach((split) => split.revert())
    }
  }, [])

  return null
}
