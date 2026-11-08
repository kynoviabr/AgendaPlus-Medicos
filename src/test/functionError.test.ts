import { describe, expect, it } from 'vitest';
import { getFunctionErrorMessage } from '@/lib/functionError';

describe('function error messages', () => {
  it('shows the error returned by an Edge Function instead of the generic non-2xx message', async () => {
    const error = Object.assign(new Error('Edge Function returned a non-2xx status code'), {
      context: new Response(JSON.stringify({ error: 'CNPJ inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    });

    await expect(getFunctionErrorMessage(error, 'Tente novamente.')).resolves.toBe('CNPJ inválido');
  });

  it('falls back to the original client error when the response has no usable JSON', async () => {
    const error = Object.assign(new Error('Falha de conexão'), {
      context: new Response('', { status: 500 }),
    });

    await expect(getFunctionErrorMessage(error, 'Tente novamente.')).resolves.toBe('Falha de conexão');
  });
});
