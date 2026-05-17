import { Outlet, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/auth';
import Sidebar from '../admin/Sidebar';
import { Menu, Bell, LogOut, Loader2, ArrowLeft, Home } from 'lucide-react';

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
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface-100 border-r border-white/5">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 glass-panel">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-secondary">
                <Menu size={20} />
              </button>

              {/* Back to frontend button */}
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-400/30 text-sm font-medium text-primary-400 hover:bg-primary-500/10 hover:border-primary-400/50 transition-all group"
              >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                <Home size={15} />
                返回前台
              </Link>
              <Link
                to="/"
                className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-primary-400/30 text-primary-400 hover:bg-primary-500/10"
              >
                <Home size={17} />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
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
