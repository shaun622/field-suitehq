/**
 * RealPhone — render a real mobile screenshot inside the existing phone bezel.
 * Crops the tenant chrome off the top via inset/margin-top trick (same as
 * DesktopDashboard / ProductGallery). Light + dark variants toggled via
 * Tailwind dark: utilities so SSR + theme toggle stay in sync.
 */
import Image from "next/image";
import { Screenshot } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  shot: Screenshot;
  /** Bezel render width in CSS px */
  width?: number;
  /** CSS rotation in deg */
  tilt?: number;
  className?: string;
}

export function RealPhone({ shot, width = 280, tilt = 0, className }: Props) {
  const cropPx = shot.cropTopPx ?? 140;
  const visibleH = shot.height - cropPx;
  const aspectAfter = visibleH / shot.width;
  const renderHeight = width * aspectAfter;

  return (
    <div
      className={cn("phone", className)}
      style={{
        width,
        height: renderHeight,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      <div className="notch" aria-hidden />
      <div className="phone-inner overflow-hidden" style={{ height: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: `${aspectAfter * 100}%`,
            overflow: "hidden",
          }}
        >
          <Image
            src={shot.light}
            alt="Mobile preview (light)"
            width={shot.width}
            height={shot.height}
            className="absolute inset-x-0 top-0 w-full h-auto pointer-events-none select-none block dark:hidden"
            style={{ marginTop: `-${(cropPx / shot.width) * 100}%` }}
          />
          <Image
            src={shot.dark ?? shot.light}
            alt="Mobile preview (dark)"
            width={shot.width}
            height={shot.height}
            className="absolute inset-x-0 top-0 w-full h-auto pointer-events-none select-none hidden dark:block"
            style={{ marginTop: `-${(cropPx / shot.width) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
