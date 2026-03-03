"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CanvasShimmer } from "./CanvasShimmer";

interface CurtainIntroProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "curtainPlayed";

export function CurtainIntro({ children }: CurtainIntroProps) {
  const [showCurtain, setShowCurtain] = useState(false);
  const [ready, setReady] = useState(false);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const playedBefore = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (playedBefore || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowCurtain(false);
      setReady(true);
      return;
    }

    setShowCurtain(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!showCurtain) return;

    const left = leftRef.current;
    const right = rightRef.current;
    const overlay = overlayRef.current;
    if (!left || !right || !overlay) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        try {
          window.localStorage.setItem(STORAGE_KEY, "true");
        } catch {
          // ignore
        }
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
          onComplete: () => setShowCurtain(false),
        });
      },
    });

    tl.fromTo(
      [left, right],
      { scaleY: 1.02, filter: "brightness(1.03)" },
      {
        scaleY: 1,
        filter: "brightness(1)",
        duration: 1.5,
      }
    ).to(
      left,
      {
        xPercent: -120,
        duration: 1.6,
      },
      "+=0.8"
    ).to(
      right,
      {
        xPercent: 120,
        duration: 1.6,
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [showCurtain]);

  const handleSkip = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setShowCurtain(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {ready && children}

      {showCurtain && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 flex items-stretch justify-center bg-[#090305]"
        >
          <CanvasShimmer active />

          <div
            ref={leftRef}
            className="relative h-full w-1/2 origin-left bg-[radial-gradient(circle_at_top,_#5a2c31,_#2a1115_45%,_#090305_90%)]"
          >
            <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-[rgba(247,231,206,0.5)] via-[rgba(247,231,206,0.12)] to-transparent" />
          </div>

          <div
            ref={rightRef}
            className="relative h-full w-1/2 origin-right bg-[radial-gradient(circle_at_top,_#5a2c31,_#2a1115_45%,_#090305_90%)]"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[rgba(247,231,206,0.5)] via-[rgba(247,231,206,0.12)] to-transparent" />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(247,231,206,0.22),_transparent_65%)]" />

          <button
            type="button"
            onClick={handleSkip}
            className="curtain-skip-link pointer-events-auto absolute bottom-6 right-6 rounded-full bg-black/40 px-4 py-2 backdrop-blur-md"
          >
            Skip animation
          </button>
        </div>
      )}
    </div>
  );
}

