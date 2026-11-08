import { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCnpjInput } from '@/lib/cnpj';
import { getFunctionErrorMessage } from '@/lib/functionError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Stethoscope, Building2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [clinicName, setClinicName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [specialties, setSpecialties] = useState<string[]>([]);

  const specialtyOptions = [
    ['dermatologia', 'Dermatologia'],
    ['ortopedia', 'Ortopedia'],
    ['cardiologia', 'Cardiologia'],
    ['clinica_medica', 'Clínica médica'],
  ] as const;

  // If user already has a role, redirect to appropriate area
  useEffect(() => {
    if (!roleLoading && role) {
      navigate(role === 'patient' ? '/portal' : '/clinic', { replace: true });
    }
  }, [role, roleLoading, navigate]);

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-clinic', {
        body: { clinicName, legalName, cnpj, phone, email, selectedSpecialties: specialties },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Clínica criada com sucesso!', description: 'Bem-vindo ao Kynovia.' });
      // Reload once so the freshly assigned administrator role is read before
      // the protected clinic route is evaluated.
      window.location.replace('/clinic');
    } catch (err: unknown) {
      toast({
        title: 'Erro',
        description: await getFunctionErrorMessage(err, 'Tente novamente em alguns instantes.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Stethoscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo!</h1>
          <p className="text-muted-foreground mt-1">Vamos configurar sua clínica em poucos passos</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${s <= step ? 'w-12 bg-primary' : 'w-8 bg-muted'}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground">Dados da Clínica</h2>
                <p className="text-sm text-muted-foreground mt-1">Informe os dados básicos para começar</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nome da Clínica *</Label>
                  <Input
                    id="clinic-name"
                    placeholder="Ex: Clínica Bella Forma"
                    value={clinicName}
                    onChange={e => setClinicName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-legal-name">Razão social</Label>
                  <Input
                    id="clinic-legal-name"
                    placeholder="Ex.: Clínica Aura LTDA"
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    maxLength={160}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-cnpj">CNPJ</Label>
                  <Input
                    id="clinic-cnpj"
                    placeholder="00.000.000/ABCD-00"
                    value={cnpj}
                    onChange={e => setCnpj(formatCnpjInput(e.target.value))}
                    autoCapitalize="characters"
                    spellCheck={false}
                    maxLength={18}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Telefone</Label>
                  <Input
                    id="clinic-phone"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-email">E-mail da Clínica</Label>
                  <Input
                    id="clinic-email"
                    type="email"
                    placeholder="contato@clinica.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Especialidades atendidas *</Label>
                  <p className="text-xs text-muted-foreground">O Aura cria serviços sugeridos para as escolhas abaixo. Você poderá editar ou remover qualquer item depois.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map(([value, label]) => (
                      <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm">
                        <Checkbox
                          checked={specialties.includes(value)}
                          onCheckedChange={(checked) => setSpecialties(current => checked ? [...current, value] : current.filter(item => item !== value))}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={!clinicName.trim() || specialties.length === 0}>
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Tudo pronto!</h2>
                <p className="text-sm text-muted-foreground mt-1">Confirme os dados e crie sua clínica</p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Clínica</span>
                  <span className="text-sm font-medium text-foreground">{clinicName}</span>
                </div>
                {legalName && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Razão social</span>
                    <span className="text-right text-sm font-medium text-foreground">{legalName}</span>
                  </div>
                )}
                {cnpj && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">CNPJ</span>
                    <span className="text-right text-sm font-medium text-foreground">{cnpj}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Telefone</span>
                    <span className="text-sm font-medium text-foreground">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">E-mail</span>
                    <span className="text-sm font-medium text-foreground">{email}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Especialidades</span>
                  <span className="text-right text-sm font-medium text-foreground">{specialtyOptions.filter(([value]) => specialties.includes(value)).map(([, label]) => label).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Seu papel</span>
                  <span className="text-sm font-medium text-primary">Administrador</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
                <Button onClick={handleCreateClinic} disabled={loading} className="flex-1 gradient-primary text-primary-foreground">
                  {loading ? 'Criando...' : 'Criar Clínica'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Kynovia. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
