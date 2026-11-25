import { useLayoutEffect, useState } from "react";

const dismissedBeforeRefreshKey = 'announcement-dismissed-before-refresh'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(dismissedBeforeRefreshKey) === 'true') {
      sessionStorage.removeItem(dismissedBeforeRefreshKey)

      if (window.location.hash) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`,
        )
      }

      const resetScroll = () =>
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      const resetAfterBrowserRestore = () => {
        resetScroll()
        window.history.scrollRestoration = 'auto'
      }

      window.addEventListener('pageshow', resetAfterBrowserRestore, { once: true })
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(resetScroll),
      )
    }
  }, [])

  if (!visible) return null;

  return (
    <div className="relative z-20 flex min-h-[26px] w-full items-center justify-center bg-[#08A9ED] px-10 py-2 text-white sm:px-12 sm:py-1">
      <div className="mx-auto flex w-fit max-w-full min-w-0 flex-nowrap items-center justify-center gap-2 sm:gap-2 lg:gap-3">
        <span className="flex h-6 w-12 shrink-0 items-center justify-center rounded-sm bg-white px-1 py-[2px] text-xs leading-none text-[#0A0A0A]">
          New
        </span>

        <p className="min-w-0 text-center text-base leading-4 tracking-normal text-[#FAFAFA]">
          The AI feature available on Yatzar Manage!
          <a
            href="#announcement"
            className="ml-1 whitespace-nowrap hover:underline sm:ml-2"
          >
            Learn more
          </a>
        </p>
      </div>

      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          sessionStorage.setItem(dismissedBeforeRefreshKey, 'true')
          window.history.scrollRestoration = 'manual'
          setVisible(false)
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:cursor-pointer hover:text-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3 w-3"
          fill="none"
        >
          <path
            d="m4 4 8 8m0-8-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
