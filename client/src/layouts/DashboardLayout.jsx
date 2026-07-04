import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-600/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
