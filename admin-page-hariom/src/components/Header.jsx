import logo from "../assets/logo.png";
import { Menu, Clock, Bell, Settings } from "lucide-react";

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="h-24 flex items-center justify-between px-8 w-full shadow-lg fixed top-0 z-50" style={{ backgroundColor: '#49828A' }}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-3 hover:bg-white/10 rounded-md text-white"
        >
          <Menu className="h-7 w-7" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
            <img 
              src={logo} 
              alt="Hari Om Thalassic Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">Hari Om Thalassic</h1>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-white/90">
          <Clock className="h-5 w-5" />
          <span className="font-medium">06:27 AM</span>
        </div>
        <button className="p-3 hover:bg-white/10 rounded-md relative text-white">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-3 hover:bg-white/10 rounded-md text-white">
          <Settings className="h-6 w-6" />
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
          RK
        </button>
      </div>
    </header>
  );
};
export default Header;