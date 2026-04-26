import { getCapacityColorClass, getMessage, getUrgencyMessage } from "@/utils/capacity";

interface CapacityBarProps {
  current: number;
  max: number;
  date?: Date;
  variant?: "bar" | "text" | "badge";
}

export function CapacityBar({ current, max, date, variant = "bar" }: CapacityBarProps) {
  const safeMax = Math.max(1, max);
  const booked = Math.min(Math.max(0, current), safeMax);
  const available = Math.max(0, safeMax - booked);
  const percentage = Math.round((booked / safeMax) * 100);
  const colorClass = getCapacityColorClass(percentage);
  const critical = available > 0 && available < 3;

  if (variant === "text") {
    return (
      <p
        aria-live="polite"
        aria-label={`${booked} of ${safeMax} spots booked`}
        className={`text-xs font-medium text-slate-700 ${critical ? "animate-pulse" : ""}`}
      >
        {getMessage(available, percentage)}
      </p>
    );
  }

  if (variant === "badge") {
    return (
      <span
        aria-label={`${booked} of ${safeMax} spots booked`}
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          percentage > 90
            ? "bg-red-100 text-red-700"
            : percentage >= 50
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
        } ${critical ? "animate-pulse" : ""}`}
      >
        {getUrgencyMessage(available, percentage)}
      </span>
    );
  }

  return (
    <div aria-label={`${booked} of ${safeMax} spots booked`} className="space-y-1" role="status">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={`text-xs text-slate-600 ${critical ? "animate-pulse font-semibold" : ""}`}>
        {getMessage(available, percentage)}
        {date ? ` - ${date.toDateString()}` : ""}
      </p>
    </div>
  );
}
