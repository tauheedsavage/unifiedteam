import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  MessageSquare, 
  LogOut,
  Shield,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, role, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ...(isAdmin ? [{ href: '/members', icon: Users, label: 'Members' }] : []),
    ...(isAdmin ? [{ href: '/tasks', icon: ListTodo, label: 'Tasks' }] : []),
    ...(isAdmin ? [{ href: '/meetings', icon: Calendar, label: 'Meetings' }] : []),
    ...(isAdmin ? [{ href: '/communication', icon: MessageSquare, label: 'Communication' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="p-2 rounded-lg gradient-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Team Insight</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* User section */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <div className="flex items-center gap-1">
                  {isAdmin ? (
                    <>
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary">Admin</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground capitalize">{role || 'Member'}</span>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2" 
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="pl-64">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
