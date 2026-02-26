import { Link } from '@tanstack/react-router';
import { Users, MapPin, FileText, FileSignature, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllParties, useGetAllLocations, useGetAllDrafts } from '../hooks/useQueries';

const quickLinks = [
  { path: '/parties', label: 'நபர்கள் மேலாண்மை', labelEn: 'Party Management', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { path: '/locations', label: 'இட விவரங்கள் மேலாண்மை', labelEn: 'Location Management', icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
  { path: '/sale-deed', label: 'புதிய கிரைய பத்திரம்', labelEn: 'New Sale Deed', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { path: '/agreement-deed', label: 'புதிய கிரைய உடன்படிக்கை', labelEn: 'New Agreement Deed', icon: FileSignature, color: 'text-purple-600', bg: 'bg-purple-50' },
  { path: '/drafts', label: 'வரைவுகள்', labelEn: 'Saved Drafts', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
];

export default function Home() {
  const { data: parties = [] } = useGetAllParties();
  const { data: locations = [] } = useGetAllLocations();
  const { data: drafts = [] } = useGetAllDrafts();

  const stats = [
    { label: 'நபர்கள் / Parties', value: parties.length, icon: Users },
    { label: 'இடங்கள் / Locations', value: locations.length, icon: MapPin },
    { label: 'வரைவுகள் / Drafts', value: drafts.length, icon: BookOpen },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, oklch(0.32 0.07 200), oklch(0.45 0.08 200))' }}>
        <h2 className="text-xl font-bold font-tamil mb-1">வணக்கம்! 🙏</h2>
        <p className="text-white/80 text-sm font-tamil">சொத்து ஆவண மேலாண்மை அமைப்பிற்கு வரவேற்கிறோம்</p>
        <p className="text-white/60 text-xs font-english mt-1">Welcome to Tamil Property Deed Management System</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-tamil">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 font-tamil">விரைவு இணைப்புகள் / Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path}>
                <Card className="shadow-card hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${link.bg}`}>
                      <Icon size={20} className={link.color} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold font-tamil text-foreground">{link.label}</div>
                      <div className="text-xs text-muted-foreground font-english">{link.labelEn}</div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border font-english">
        © {new Date().getFullYear()} Built with <span className="text-red-400">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'property-deed-mgmt')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
