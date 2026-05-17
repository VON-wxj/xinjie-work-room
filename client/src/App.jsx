import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from './store/auth';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
// Public
import HomePage from './pages/public/HomePage';
import ActivityDetail from './pages/public/ActivityDetail';
import TeamList from './pages/public/TeamList';
import TeamMember from './pages/public/TeamMember';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ProfilePage from './pages/public/ProfilePage';
import ProjectsPage from './pages/public/ProjectsPage';
// Admin
import Dashboard from './pages/admin/Dashboard';
import ActivityList from './pages/admin/ActivityList';
import ActivityEdit from './pages/admin/ActivityEdit';
import CategoryManage from './pages/admin/CategoryManage';
import CommentManage from './pages/admin/CommentManage';
import UserManage from './pages/admin/UserManage';
import SiteSettings from './pages/admin/SiteSettings';
import OperationLogs from './pages/admin/OperationLogs';
import TeamManage from './pages/admin/TeamManage';
import TimelineManage from './pages/admin/TimelineManage';
import ProjectManage from './pages/admin/ProjectManage';
import VisitorsManage from './pages/admin/VisitorsManage';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(2px)' },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);
  const location = useLocation();

  useEffect(() => { init(); }, [init]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          <Route path="visitors" element={<PageTransition><VisitorsManage /></PageTransition>} />
          <Route path="timeline" element={<PageTransition><TimelineManage /></PageTransition>} />
          <Route path="users" element={<PageTransition><UserManage /></PageTransition>} />
          <Route path="settings" element={<PageTransition><SiteSettings /></PageTransition>} />
          <Route path="logs" element={<PageTransition><OperationLogs /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
