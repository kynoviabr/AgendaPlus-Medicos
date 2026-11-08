import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CFM_MEDICAL_SPECIALTIES, CFM_SPECIALTIES_MAP } from '@/lib/medicalSpecialties';
import { cn } from '@/lib/utils';

interface SpecialtyMultiSelectProps {
  selected: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function SpecialtyMultiSelect({
  selected,
  onChange,
  disabled = false,
  placeholder = 'Selecione as especialidades...',
  className,
}: SpecialtyMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredSpecialties = React.useMemo(() => {
    if (!search.trim()) return CFM_MEDICAL_SPECIALTIES;
    const query = normalize(search);
    return CFM_MEDICAL_SPECIALTIES.filter((item) => normalize(item.label).includes(query));
  }, [search]);

  const toggleSpecialty = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeSpecialty = (value: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange([]);
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal text-left h-auto min-h-10 py-2 px-3 border-input hover:bg-background"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <span className="text-foreground font-medium text-sm">
                  {selected.length} {selected.length === 1 ? 'especialidade selecionada' : 'especialidades selecionadas'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {selected.length > 0 && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={clearAll}
                  onKeyDown={(e) => { if (e.key === 'Enter') clearAll(); }}
                  className="p-1 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer text-xs"
                  title="Limpar todas"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[calc(100vw-2rem)] sm:w-[480px] p-0 shadow-lg"
          align="start"
          sideOffset={5}
        >
          {/* Top Search bar */}
          <div className="flex items-center border-b px-3 py-2 gap-2 bg-muted/20">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar especialidade do CFM..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-muted-foreground hover:text-foreground p-0.5"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick info toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground bg-muted/40 border-b">
            <span>
              {filteredSpecialties.length} de {CFM_MEDICAL_SPECIALTIES.length} especialidades CFM
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-primary hover:underline font-medium"
              >
                Desmarcar todas ({selected.length})
              </button>
            )}
          </div>

          {/* Scrollable List */}
          <div className="max-h-64 overflow-y-auto p-1 divide-y divide-border/40">
            {filteredSpecialties.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma especialidade encontrada para &ldquo;{search}&rdquo;.
              </div>
            ) : (
              filteredSpecialties.map((item) => {
                const isSelected = selected.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSpecialty(item.value)}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </label>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected badges / chips displayed underneath */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected.map((val) => {
            const spec = CFM_SPECIALTIES_MAP[val];
            const label = spec ? spec.label : val;
            return (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-normal bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 rounded-md"
              >
                <span>{label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => removeSpecialty(val, e)}
                    className="hover:bg-primary/20 rounded p-0.5 text-primary/80 hover:text-primary transition-colors"
                    aria-label={`Remover ${label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
