export type CapacityStatus = "available" | "filling_up" | "almost_full" | "fully_booked";

export function getCapacityStatus(percentage: number, available: number): CapacityStatus {
  if (available <= 0 || percentage >= 100) return "fully_booked";
  if (percentage > 95) return "almost_full";
  if (percentage > 80) return "almost_full";
  if (percentage >= 50) return "filling_up";
  return "available";
}

export function getCapacityColorClass(percentage: number) {
  if (percentage > 95) return "bg-red-500";
  if (percentage > 80) return "bg-orange-500";
  if (percentage >= 50) return "bg-amber-500";
  return "bg-emerald-500";
}

export function getMessage(available: number, percentage: number) {
  if (available <= 0) return "Fully Booked";
  if (available === 1) return "Only 1 spot left!";
  if (available <= 3) return `Only ${available} spots left!`;
  if (percentage > 80) return `${available} spots remaining`;
  if (percentage > 50) return `${available} spots available`;
  return `${available} spots available`;
}

export function getUrgencyMessage(available: number, percentage: number) {
  if (available <= 0) return "Fully booked";
  if (percentage > 80 || available <= 3) return `Selling fast! Only ${available} spots left`;
  if (percentage >= 50) return `Filling up! ${available} spots remaining`;
  return `${available} spots available`;
}
