import { BookOpen, FileText, Users, Plus, BarChart3, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.js";
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const mainModules = [
    {
      name: "Course Booking Manager",
      path: "/",
      icon: BookOpen,
      active: location.pathname === "/"
    },
    {
      name: "Documentation Admin - DG",
      path: "/documentation",
      icon: FileText,
      active: location.pathname === "/documentation"
    },
    {
      name: "Documentation Admin - Flag State",
      path: "/flag-state",
      icon: FileText,
      active: location.pathname === "/flag-state"
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: Users,
      active: location.pathname === "/analytics"
    }
  ];
  const quickActions = [
    {
      name: "Add New Task",
      icon: Plus
    },
    {
      name: "Analytics",
      icon: BarChart3
    },
    {
      name: "Settings",
      icon: Settings
    }
  ];
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-24 h-[calc(100vh-6rem)] w-72 text-white transform transition-transform duration-300 ease-in-out z-40",
          "lg:fixed lg:transform-none lg:top-24 lg:h-[calc(100vh-6rem)]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ backgroundColor: '#49828A' }}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-md text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Add top padding to account for header on desktop */}
        <div className="px-6 pb-6 pt-6 h-full overflow-y-auto">
          <div className="mb-10">
            <nav className="space-y-2">
              {mainModules.map((module) => (
                  <Link
                  key={module.name}
                  to={module.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-lg text-base font-medium transition-colors",
                    module.active 
                      ? "bg-white/25 text-white border border-white/40 shadow-lg" 
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  )}
                >
                  <module.icon className="h-5 w-5" />
                  {module.name}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-6 px-1">
              Quick Actions
            </h2>
            <nav className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/15 hover:text-white transition-colors"
                >
                  <action.icon className="h-5 w-5" />
                  {action.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;