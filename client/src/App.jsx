import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from './store/auth';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('./pages/public/HomePage'));
const ActivityDetail = lazy(() => import('./pages/public/ActivityDetail'));
const TeamList = lazy(() => import('./pages/public/TeamList'));
const TeamMember = lazy(() => import('./pages/public/TeamMember'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/public/ProfilePage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const CreatorPage = lazy(() => import('./pages/public/CreatorPage'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ActivityList = lazy(() => import('./pages/admin/ActivityList'));
const ActivityEdit = lazy(() => import('./pages/admin/ActivityEdit'));
const CategoryManage = lazy(() => import('./pages/admin/CategoryManage'));
const CommentManage = lazy(() => import('./pages/admin/CommentManage'));
const UserManage = lazy(() => import('./pages/admin/UserManage'));
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'));
const OperationLogs = lazy(() => import('./pages/admin/OperationLogs'));
const TeamManage = lazy(() => import('./pages/admin/TeamManage'));
const TimelineManage = lazy(() => import('./pages/admin/TimelineManage'));
const ProjectManage = lazy(() => import('./pages/admin/ProjectManage'));
const VisitorsManage = lazy(() => import('./pages/admin/VisitorsManage'));
const ApplicationManage = lazy(() => import('./pages/admin/ApplicationManage'));
const CreatorManage = lazy(() => import('./pages/admin/CreatorManage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);
  const location = useLocation();

  useEffect(() => { init(); }, [init]);

  return (
    <Routes location={location}>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/activity/:id" element={<PageTransition><ActivityDetail /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/team" element={<PageTransition><TeamList /></PageTransition>} />
        <Route path="/team/:id" element={<PageTransition><TeamMember /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/creator" element={<PageTransition><CreatorPage /></PageTransition>} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="activities" element={<PageTransition><ActivityList /></PageTransition>} />
        <Route path="activities/new" element={<PageTransition><ActivityEdit /></PageTransition>} />
        <Route path="activities/:id/edit" element={<PageTransition><ActivityEdit /></PageTransition>} />
        <Route path="categories" element={<PageTransition><CategoryManage /></PageTransition>} />
        <Route path="comments" element={<PageTransition><CommentManage /></PageTransition>} />
        <Route path="team" element={<PageTransition><TeamManage /></PageTransition>} />
        <Route path="projects" element={<PageTransition><ProjectManage /></PageTransition>} />
        <Route path="applications" element={<PageTransition><ApplicationManage /></PageTransition>} />
        <Route path="visitors" element={<PageTransition><VisitorsManage /></PageTransition>} />
        <Route path="timeline" element={<PageTransition><TimelineManage /></PageTransition>} />
        <Route path="users" element={<PageTransition><UserManage /></PageTransition>} />
        <Route path="settings" element={<PageTransition><SiteSettings /></PageTransition>} />
        <Route path="logs" element={<PageTransition><OperationLogs /></PageTransition>} />
        <Route path="creator" element={<PageTransition><CreatorManage /></PageTransition>} />
      </Route>
    </Routes>
  );
}
