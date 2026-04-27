import { BookingStatus } from "@prisma/client";
import { CheckCircle2, CircleDashed, CircleX } from "lucide-react";

type BookingStatusTimelineProps = {
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  bookingDate: Date;
};

type Step = {
  key: BookingStatus | "SCHEDULED";
  label: string;
  emoji: string;
  done: boolean;
  active: boolean;
  timeLabel?: string;
};

function dateLabel(value: Date): string {
  return new Date(value).toLocaleDateString();
}

export function BookingStatusTimeline({
  status,
  createdAt,
  updatedAt,
  bookingDate,
}: BookingStatusTimelineProps) {
  const isCancelled = status === "CANCELLED";
  const isPending = status === "PENDING";
  const isConfirmed = status === "CONFIRMED" || status === "COMPLETED";
  const isCompleted = status === "COMPLETED";

  const steps: Step[] = isCancelled
    ? [
        {
          key: "PENDING",
          label: "Pending",
          emoji: "⏳",
          done: true,
          active: false,
          timeLabel: dateLabel(createdAt),
        },
        {
          key: "CANCELLED",
          label: "Cancelled",
          emoji: "❌",
          done: true,
          active: true,
          timeLabel: dateLabel(updatedAt),
        },
      ]
    : [
        {
          key: "PENDING",
          label: "Pending",
          emoji: "⏳",
          done: isPending || isConfirmed || isCompleted,
          active: isPending,
          timeLabel: dateLabel(createdAt),
        },
        {
          key: "CONFIRMED",
          label: "Confirmed",
          emoji: "✅",
          done: isConfirmed || isCompleted,
          active: status === "CONFIRMED",
          timeLabel: isConfirmed ? dateLabel(updatedAt) : undefined,
        },
        {
          key: "SCHEDULED",
          label: "Trip Day",
          emoji: "🛥️",
          done: isCompleted,
          active: status === "CONFIRMED",
          timeLabel: dateLabel(bookingDate),
        },
        {
          key: "COMPLETED",
          label: "Completed",
          emoji: "🎉",
          done: isCompleted,
          active: status === "COMPLETED",
          timeLabel: isCompleted ? dateLabel(updatedAt) : undefined,
        },
      ];

  const progressPercent = isCancelled
    ? 100
    : status === "PENDING"
      ? 25
      : status === "CONFIRMED"
        ? 65
        : status === "COMPLETED"
          ? 100
          : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        Booking Timeline
      </p>
      <div className="mb-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isCancelled ? "bg-red-500" : "bg-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] font-medium text-slate-500">
          {isCancelled ? "Cancelled" : `${progressPercent}% journey progress`}
        </p>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-start gap-2">
            <div className="mt-0.5">
              {step.key === "CANCELLED" ? (
                <CircleX className="h-4 w-4 text-red-600" />
              ) : step.done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <CircleDashed className="h-4 w-4 text-slate-400" />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-semibold ${
                  step.active ? "text-slate-900" : step.done ? "text-slate-700" : "text-slate-500"
                }`}
              >
                {step.emoji} {step.label}
              </p>
              {step.timeLabel ? <p className="text-[11px] text-slate-500">{step.timeLabel}</p> : null}
            </div>
            {index < steps.length - 1 ? <span className="sr-only">then</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
