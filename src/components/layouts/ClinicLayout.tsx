import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ClinicSidebar from './ClinicSidebar';
import { PATH_PERMISSION_MAP } from '@/lib/accessPermissions';
import { useAccessControl } from '@/hooks/useAccessControl';

/**
 * Stripe-style clinic shell.
 * - Sidebar: 220px (lg+)
 * - Mobile: 60px sticky top header
 * - Content area uses bg-page (#f6f9fc)
 */
export default function ClinicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { has, loading } = useAccessControl();

  const matched = PATH_PERMISSION_MAP.find((item) => location.pathname.startsWith(item.prefix));
  const hasCurrentAccess = matched ? has(matched.key) : true;
  const hasAnyAccess = PATH_PERMISSION_MAP.some((item) => has(item.key));

  useEffect(() => {
    if (loading) return;
    if (!matched) return;

    if (!hasCurrentAccess) {
      const fallback = PATH_PERMISSION_MAP.find((item) => has(item.key));
      if (fallback) {
        navigate(fallback.prefix, { replace: true });
      }
    }
  }, [location.pathname, hasCurrentAccess, loading, matched, has, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAnyAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-card border border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Acesso não liberado</h2>
          <p className="text-sm text-muted-foreground">
            Seu usuário não possui permissões ativas nos grupos de acesso desta clínica. Entre em contato com o administrador da clínica para liberar seu acesso.
          </p>
          <div className="pt-2">
            <Button variant="outline" className="w-full gap-2" onClick={() => signOut()}>
              <LogOut className="w-4 h-4" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page">
      <ClinicSidebar />
      <main className="lg:ml-[220px] pt-[60px] lg:pt-0 min-h-screen">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8 2xl:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
