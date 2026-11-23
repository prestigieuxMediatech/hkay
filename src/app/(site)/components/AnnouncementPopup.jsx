
"use client";

import { useEffect, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

export default function AnnouncementPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const closeOnEscape = (e) => {
      if (e.key === "Escape") setVisible(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [visible]);

  if (!visible) return null;

  const closePopup = () => setVisible(false);

  return (
    <div
      onClick={closePopup}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/65 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-6 animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex max-h-[90dvh] w-full max-w-[620px] flex-col overflow-hidden bg-[#f1f0eb] text-[#171717] shadow-2xl animate-in zoom-in-95 duration-300 sm:max-h-[88dvh]"
      >
        {/* Top Accent */}
        <div className="h-1 shrink-0 bg-[#37A3E4]" />

        {/* Fixed Header / Close Button */}
        <div className="relative flex shrink-0 items-center justify-between border-b border-black/15 px-5 py-5 sm:px-10 sm:py-6">
          <div className="flex items-center gap-3 pr-12">
            <span className="h-2 w-2 shrink-0 bg-[#37A3E4]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.24em]">
              Your Brand / Studio
            </span>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-black/40 sm:block">
            Announcement 01
          </span>

          <button
            type="button"
            onClick={closePopup}
            aria-label="Close announcement"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white text-black shadow-sm transition-all duration-200 hover:rotate-90 hover:bg-black hover:text-white sm:right-8 sm:h-11 sm:w-11"
          >
            <X size={21} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain px-5 py-7 sm:px-10 sm:py-10 md:px-12 md:py-12">
          {/* Main Content */}
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#278BC5] sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
              A New Chapter Begins
            </p>

            <h2 className="max-w-[500px] text-[clamp(2.2rem,8vw,4rem)] font-bold uppercase leading-[0.98] tracking-[-0.055em]">
              New Projects.
              <br />
              New Possibilities.
            </h2>

            <div className="my-6 h-[2px] w-12 bg-[#37A3E4] sm:my-8 sm:w-14" />

            <p className="max-w-[420px] text-sm leading-6 text-black/60 sm:text-base sm:leading-7">
              We're opening our calendar for new projects.
              Let's turn your next big idea into something exceptional.
            </p>
          </div>

          {/* Booking Date */}
          <div className="mt-8 border-y border-black/20 py-5 sm:mt-12 sm:py-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/45 sm:text-[10px] sm:tracking-[0.22em]">
              Project Bookings Open From
            </p>

            <p className="mt-2 text-xl font-bold uppercase tracking-tight sm:mt-3 sm:text-3xl">
              01 December 2026
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col gap-5 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/45 sm:text-[10px] sm:tracking-[0.16em]">
              Let's Build Something Exceptional.
            </p>

            <button
              type="button"
              onClick={closePopup}
              className="group flex w-full items-center justify-center gap-2 bg-[#171717] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#278BC5] sm:w-auto sm:bg-transparent sm:px-0 sm:py-2 sm:text-black sm:hover:bg-transparent sm:hover:text-[#278BC5]"
            >
              Got it
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
