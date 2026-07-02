import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="admin-dashboard min-h-screen bg-gray-50">
      <AdminHeader onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-h-screen lg:ml-72 pt-24">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
