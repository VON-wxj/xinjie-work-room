import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/auth';
import Sidebar from '../admin/Sidebar';
import { Menu, Bell, LogOut, Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin, initialized, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-400/50" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface-100 border-r border-white/5">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 glass-panel">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-secondary">
              <Menu size={20} />
            </button>
            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full shadow-[0_0_6px_rgba(248,113,113,0.5)]" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-secondary">{user?.username}</span>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-red-400 transition-colors"
                  title="退出"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
