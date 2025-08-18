const StatusBadge = ({ status, variant }) => {
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  const getVariantClasses = (variant) => {
    switch (variant) {
      case "confirmed":
      case "completed":
      case "paid":
      case "eligible":
      case "submitted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "under-review":
      case "ongoing":
      case "inprogress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "not-started":
      case "not-generated":
      case "not-sent":
      case "not-taken":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
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
