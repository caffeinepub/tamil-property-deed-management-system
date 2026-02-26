import { Link, useLocation } from '@tanstack/react-router';
import { Users, MapPin, FileText, FileSignature, BookOpen, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

const navItems = [
  { path: '/', label: 'முகப்பு', labelEn: 'Home', icon: Home },
  { path: '/parties', label: 'நபர்கள் மேலாண்மை', labelEn: 'Party Management', icon: Users },
  { path: '/locations', label: 'இட விவரங்கள் மேலாண்மை', labelEn: 'Location Management', icon: MapPin },
  { path: '/sale-deed', label: 'கிரைய பத்திரம்', labelEn: 'Sale Deed', icon: FileText },
  { path: '/agreement-deed', label: 'கிரைய உடன்படிக்கை', labelEn: 'Agreement Deed', icon: FileSignature },
  { path: '/drafts', label: 'வரைவுகள்', labelEn: 'Drafts', icon: BookOpen },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNav = navItems.find(n =>
    n.path === location.pathname ||
    (n.path !== '/' && location.pathname.startsWith(n.path))
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-sidebar shadow-sidebar transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <img
            src="/assets/generated/app-logo.dim_256x256.png"
            alt="App Logo"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <div className="text-sidebar-foreground font-bold text-sm leading-tight font-tamil">
              சொத்து ஆவண
            </div>
            <div className="text-sidebar-foreground font-bold text-sm leading-tight font-tamil">
              மேலாண்மை
            </div>
            <div className="text-sidebar-foreground/60 text-xs font-english">
              Property Deed Mgmt
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-semibold'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'}
                />
                <div>
                  <div className="text-sm font-tamil leading-tight">{item.label}</div>
                  <div className="text-xs opacity-60 font-english leading-tight">{item.labelEn}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-sidebar-foreground/40 text-xs text-center font-english">
            © {new Date().getFullYear()} Built with{' '}
            <span className="text-red-400">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'property-deed-mgmt')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sidebar-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shadow-xs no-print">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground font-tamil">
              {currentNav?.label || 'சொத்து ஆவண மேலாண்மை'}
            </h1>
            <p className="text-xs text-muted-foreground font-english">
              {currentNav?.labelEn || 'Property Deed Management System'}
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
