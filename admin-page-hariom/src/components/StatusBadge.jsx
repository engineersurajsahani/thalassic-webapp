import { cn } from "@/lib/utils.js";
const StatusBadge = ({ status, variant }) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "confirmed":
      case "completed":
      case "paid":
      case "eligible":
      case "submitted":
        return "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20";
      case "pending":
      case "under-review":
      case "ongoing":
      case "inprogress":
        return "bg-status-pending/10 text-status-pending border-status-pending/20";
      case "scheduled":
        return "bg-status-scheduled/10 text-status-scheduled border-status-scheduled/20";
      case "not-started":
      case "not-generated":
      case "not-sent":
        return "bg-status-not-started/10 text-status-not-started border-status-not-started/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        getVariantClasses(variant)
      )}
    >
      {status}
    </span>
  );
};
export default StatusBadge;