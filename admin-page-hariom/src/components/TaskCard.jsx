import StatusBadge from "./StatusBadge.jsx";
import { User, Calendar } from "lucide-react";

const TaskCard = ({ title, description, assignee, date, status }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-foreground text-sm leading-tight">{title}</h3>
          <StatusBadge status={status === "ongoing" ? "Ongoing" : "Pending"} variant={status} />
        </div>
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">{description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{assignee}</span>
        </div>
        {date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskCard;