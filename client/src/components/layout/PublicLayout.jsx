import { Outlet } from 'react-router-dom';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import ChatWidget from '../public/ChatWidget';
import { SquaresBg, GradientOrbs } from '../public/AnimatedBg';

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--c-bg)' }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <SquaresBg count={30} speed={0.2} />
        <GradientOrbs count={3} />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatWidget />
    </div>
  );
}
