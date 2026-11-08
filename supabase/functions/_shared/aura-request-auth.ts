const DEFAULT_MAX_CLOCK_SKEW_SECONDS = 5 * 60;
const SHA_256_HEX_LENGTH = 64;

export type AuraRequestAuthFailure =
  | 'missing_header'
  | 'invalid_timestamp'
  | 'stale_timestamp'
  | 'workspace_mismatch'
  | 'invalid_signature';

export type AuraRequestAuthResult =
  | { ok: true; workspace: string }
  | { ok: false; reason: AuraRequestAuthFailure };

type VerifyAuraRequestOptions = {
  secret: string;
  now?: Date;
  maxClockSkewSeconds?: number;
  expectedWorkspace?: string;
};

function pathWithQuery(url: URL) {
  return `${url.pathname}${url.search}`;
}

export function buildAuraSignaturePayload(
  timestamp: string,
  method: string,
  requestPathWithQuery: string,
  rawBody: string,
) {
  return `${timestamp}.${method.toUpperCase()}.${requestPathWithQuery}.${rawBody}`;
}

function decodeHex(value: string) {
  if (!new RegExp(`^[0-9a-fA-F]{${SHA_256_HEX_LENGTH}}$`).test(value)) return null;

  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes;
}

async function verifyHmacSha256(secret: string, payload: string, signature: string) {
  const signatureBytes = decodeHex(signature);
  if (!signatureBytes) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  return crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payload));
}

export async function verifyAuraRequest(
  request: Request,
  rawBody: string,
  options: VerifyAuraRequestOptions,
): Promise<AuraRequestAuthResult> {
  const workspace = request.headers.get('x-aura-workspace')?.trim() || '';
  const timestamp = request.headers.get('x-aura-timestamp')?.trim() || '';
  const signature = request.headers.get('x-aura-signature')?.trim() || '';

  if (!workspace || !timestamp || !signature || !options.secret) {
    return { ok: false, reason: 'missing_header' };
  }

  if (!/^\d+$/.test(timestamp)) return { ok: false, reason: 'invalid_timestamp' };
  const timestampSeconds = Number(timestamp);
  if (!Number.isSafeInteger(timestampSeconds)) return { ok: false, reason: 'invalid_timestamp' };

  const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1000);
  const maxClockSkewSeconds = options.maxClockSkewSeconds ?? DEFAULT_MAX_CLOCK_SKEW_SECONDS;
  if (Math.abs(nowSeconds - timestampSeconds) > maxClockSkewSeconds) {
    return { ok: false, reason: 'stale_timestamp' };
  }

  if (options.expectedWorkspace && workspace !== options.expectedWorkspace) {
    return { ok: false, reason: 'workspace_mismatch' };
  }

  const url = new URL(request.url);
  const payload = buildAuraSignaturePayload(timestamp, request.method, pathWithQuery(url), rawBody);
  const valid = await verifyHmacSha256(options.secret, payload, signature);

  return valid
    ? { ok: true, workspace }
    : { ok: false, reason: 'invalid_signature' };
}
