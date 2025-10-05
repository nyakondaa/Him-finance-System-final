import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navbar handles its own width and collapsing */}
      <Navbar onCollapseChange={setIsSidebarCollapsed} />
      
      {/* Main content - dynamically adjusts based on sidebar state */}
      <main className={`
        flex-1 overflow-auto bg-gray-50 transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}
      `}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;