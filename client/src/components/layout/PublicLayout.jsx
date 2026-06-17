import { Outlet } from 'react-router-dom';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import ChatWidget from '../public/ChatWidget';
import JoinForm from '../public/JoinForm';
import { SquaresBg, GradientOrbs } from '../public/AnimatedBg';

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--c-bg)' }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <SquaresBg count={12} speed={0.15} />
        <GradientOrbs count={2} />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatWidget />
      <JoinForm />
    </div>
  );
}
