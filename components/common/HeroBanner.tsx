import type { ReactNode } from "react";

type HeroBannerProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImageUrl: string;
  minHeightClassName?: string;
  contentClassName?: string;
  children?: ReactNode;
};

export function HeroBanner({
  badge,
  title,
  subtitle,
  description,
  backgroundImageUrl,
  minHeightClassName = "min-h-[70vh]",
  contentClassName = "max-w-3xl text-left",
  children,
}: HeroBannerProps) {
  return (
    <section className={`relative -mt-20 overflow-hidden ${minHeightClassName}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-black/55" />

      <div className="relative mx-auto flex w-full max-w-6xl items-center px-4 pb-16 pt-40 text-white sm:px-6">
        <div className={contentClassName}>
          {badge ? (
            <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              {badge}
            </p>
          ) : null}
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 font-display text-xl text-emerald-100 sm:text-2xl">{subtitle}</p>
          ) : null}
          {description ? (
            <p className="mt-6 max-w-2xl text-base text-slate-100/90 sm:text-lg">{description}</p>
          ) : null}
          {children ? <div className="mt-10 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
