import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // The sidebar navigation

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 h-full fixed left-0 top-0 bg-[#111827]">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 ml-64 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

