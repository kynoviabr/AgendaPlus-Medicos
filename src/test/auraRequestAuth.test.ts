import { describe, expect, it } from 'vitest';
import {
  buildAuraSignaturePayload,
  verifyAuraRequest,
} from '../../supabase/functions/_shared/aura-request-auth.ts';

const SECRET = 'synthetic-aura-webhook-secret';
const NOW = new Date('2026-11-07T18:00:00.000Z');
const TIMESTAMP = String(Math.floor(NOW.getTime() / 1000));

async function sign(payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function requestWithSignature(input?: {
  method?: string;
  url?: string;
  body?: string;
  workspace?: string;
  timestamp?: string;
  signature?: string;
}) {
  const method = input?.method ?? 'GET';
  const url = input?.url ?? 'https://agenda.test/functions/v1/aura-api/aura/catalog?active=true';
  const body = input?.body ?? '';
  const workspace = input?.workspace ?? 'clinic-a';
  const timestamp = input?.timestamp ?? TIMESTAMP;
  const parsedUrl = new URL(url);
  const payload = buildAuraSignaturePayload(
    timestamp,
    method,
    `${parsedUrl.pathname}${parsedUrl.search}`,
    body,
  );
  const signature = input?.signature ?? await sign(payload);

  return new Request(url, {
    method,
    headers: {
      'X-Aura-Workspace': workspace,
      'X-Aura-Timestamp': timestamp,
      'X-Aura-Signature': signature,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body || undefined,
  });
}

describe('Aura request authentication', () => {
  it('accepts a valid signed request and returns the tenant workspace', async () => {
    const request = await requestWithSignature({});

    await expect(verifyAuraRequest(request, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: true, workspace: 'clinic-a' });
  });

  it('includes method, path, query and exact raw body in the signature', async () => {
    const body = '{"serviceId":"service-a"}';
    const request = await requestWithSignature({
      method: 'POST',
      url: 'https://agenda.test/functions/v1/aura-api/aura/bookings?source=ai',
      body,
    });

    await expect(verifyAuraRequest(request, body, { secret: SECRET, now: NOW }))
      .resolves.toMatchObject({ ok: true });
    await expect(verifyAuraRequest(request, `${body}\n`, { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'invalid_signature' });
  });

  it('rejects missing authentication headers', async () => {
    const request = new Request('https://agenda.test/functions/v1/aura-api/aura/catalog');

    await expect(verifyAuraRequest(request, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'missing_header' });
  });

  it('rejects malformed, expired and excessively future timestamps', async () => {
    const malformed = await requestWithSignature({ timestamp: 'not-a-timestamp' });
    const expired = await requestWithSignature({ timestamp: String(Number(TIMESTAMP) - 301) });
    const future = await requestWithSignature({ timestamp: String(Number(TIMESTAMP) + 301) });

    await expect(verifyAuraRequest(malformed, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'invalid_timestamp' });
    await expect(verifyAuraRequest(expired, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'stale_timestamp' });
    await expect(verifyAuraRequest(future, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'stale_timestamp' });
  });

  it('rejects a workspace that does not match the expected clinic', async () => {
    const request = await requestWithSignature({ workspace: 'clinic-b' });

    await expect(verifyAuraRequest(request, '', {
      secret: SECRET,
      now: NOW,
      expectedWorkspace: 'clinic-a',
    })).resolves.toEqual({ ok: false, reason: 'workspace_mismatch' });
  });

  it('rejects malformed and incorrect signatures', async () => {
    const malformed = await requestWithSignature({ signature: 'xyz' });
    const incorrect = await requestWithSignature({ signature: '0'.repeat(64) });

    await expect(verifyAuraRequest(malformed, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'invalid_signature' });
    await expect(verifyAuraRequest(incorrect, '', { secret: SECRET, now: NOW }))
      .resolves.toEqual({ ok: false, reason: 'invalid_signature' });
  });
});
