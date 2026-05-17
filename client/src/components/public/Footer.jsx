import { Zap, Github, Globe, MessageCircle, Phone, Mail } from 'lucide-react';

const links = [
  { icon: Globe, label: 'CSDN', url: 'https://blog.csdn.net/2302_80329073' },
  { icon: Github, label: 'GitHub', url: 'https://github.com/VON-wxj' },
  { icon: Globe, label: 'AtomGit', url: 'https://atomgit.com/VON-' },
];

const contact = [
  { icon: MessageCircle, label: '抖音：65604971116' },
  { icon: Phone, label: '18337862102' },
  { icon: Mail, label: '2383951268@qq.com' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--c-border)] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap size={16} className="text-primary-400" />
            <span className="text-sm text-muted">Made with passion by</span>
          </div>
          <p className="text-lg font-bold gradient-text font-mono">芯捷工作室</p>
          <p className="text-xs text-muted mt-2 font-mono">
            &copy; {new Date().getFullYear()} Xinjie Studio
          </p>
        </div>

        {/* Developer links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {links.map(({ icon: Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary-400 transition-colors"
            >
              <Icon size={13} />
              {label}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {contact.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Icon size={12} />
              {label}
            </span>
          ))}
        </div>

        {/* Version */}
        <p className="text-[10px] text-muted text-center opacity-40 font-mono">
          测试版 v1.0
        </p>
      </div>
    </footer>
  );
}
