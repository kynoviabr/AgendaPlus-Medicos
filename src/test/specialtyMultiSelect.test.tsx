import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpecialtyMultiSelect } from '@/components/ui/SpecialtyMultiSelect';

describe('SpecialtyMultiSelect Component', () => {
  it('renders with placeholder when empty', () => {
    const handleChange = vi.fn();
    render(<SpecialtyMultiSelect selected={[]} onChange={handleChange} placeholder="Escolha..." />);

    expect(screen.getByText('Escolha...')).toBeInTheDocument();
  });

  it('renders count and badges when items are selected', () => {
    const handleChange = vi.fn();
    render(
      <SpecialtyMultiSelect
        selected={['cardiologia', 'dermatologia']}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('2 especialidades selecionadas')).toBeInTheDocument();
    expect(screen.getByText('Cardiologia')).toBeInTheDocument();
    expect(screen.getByText('Dermatologia')).toBeInTheDocument();
  });

  it('allows removing an item directly from its badge', () => {
    const handleChange = vi.fn();
    render(
      <SpecialtyMultiSelect
        selected={['cardiologia', 'dermatologia']}
        onChange={handleChange}
      />
    );

    const removeBtn = screen.getByRole('button', { name: 'Remover Cardiologia' });
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(['dermatologia']);
  });

  it('filters specialties when user types in search', async () => {
    const handleChange = vi.fn();
    render(
      <SpecialtyMultiSelect
        selected={[]}
        onChange={handleChange}
      />
    );

    // Open combobox popover
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Find search input
    const searchInput = screen.getByPlaceholderText('Buscar especialidade do CFM...');
    expect(searchInput).toBeInTheDocument();

    // Type "oftalmo"
    fireEvent.change(searchInput, { target: { value: 'oftalmo' } });

    expect(screen.getByText('Oftalmologia')).toBeInTheDocument();
    expect(screen.queryByText('Cardiologia')).not.toBeInTheDocument();
  });
});
