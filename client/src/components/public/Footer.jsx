import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap size={16} className="text-primary-400" />
          <span className="text-sm text-muted">Made with passion by</span>
        </div>
        <p className="text-lg font-bold gradient-text font-mono">
          芯捷工作室
        </p>
        <p className="text-xs text-muted mt-2 font-mono">
          &copy; {new Date().getFullYear()} Xinjie Studio
        </p>
        <p className="text-[10px] text-muted mt-3 opacity-50 font-mono">
          测试版 v1.0
        </p>
      </div>
    </footer>
  );
}
