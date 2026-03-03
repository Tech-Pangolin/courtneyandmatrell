"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { CanvasShimmer } from "./CanvasShimmer";

interface SparkleImageProps extends ImageProps {
  containerClassName?: string;
  index?: number;
  denseSparkles?: boolean;
  sparkleDurationMs?: number;
}

export function SparkleImage({
  containerClassName,
  index = 0,
  className,
  denseSparkles = false,
  sparkleDurationMs,
  ...imageProps
}: SparkleImageProps) {
  const [visible, setVisible] = useState(false);
  const [sparkleActive, setSparkleActive] = useState(false);

  useEffect(() => {
    const delay = 350 + index * 350;
    const duration = sparkleDurationMs ?? 1300;
    const showTimer = setTimeout(() => {
      setVisible(true);
      setSparkleActive(true);
      const hideTimer = setTimeout(() => {
        setSparkleActive(false);
      }, duration);
      return () => clearTimeout(hideTimer);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [index]);

  return (
    <div className={`relative inline-block overflow-hidden ${containerClassName ?? ""}`}>
      <Image
        {...imageProps}
        className={`h-auto w-full object-contain transition-opacity duration-900 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        } ${className ?? ""}`}
      />
      {sparkleActive && <CanvasShimmer active density={denseSparkles ? 2.8 : 1} />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(247,231,206,0.16),_transparent_60%)] mix-blend-screen" />
    </div>
  );
}

