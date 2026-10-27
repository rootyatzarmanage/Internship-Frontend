import { useState } from "react";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-20 flex h-[42px] w-full items-center justify-center bg-[#08A9ED] px-[32px] text-white">
      <div className="flex items-center gap-[34px]">
        <span className="flex h-[28px] w-[51px] items-center justify-center rounded-sm bg-white px-[8px] py-[2px] text-[16px] leading-none text-[#0A0A0A]">
          New
        </span>

        <p className="text-[20px] leading-[34px] tracking-[0%] text-[#FAFAFA]">
          The AI feature available on Yatzar Manage!
          <a
            href="#announcement"
            className="ml-[10px] hover:underline"
          >
            Learn more
          </a>
        </p>
      </div>

      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
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
