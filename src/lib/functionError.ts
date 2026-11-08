type FunctionErrorWithContext = Error & { context?: Response };

export async function getFunctionErrorMessage(error: unknown, fallback: string) {
  const context = error instanceof Error
    ? (error as FunctionErrorWithContext).context
    : undefined;

  if (context instanceof Response) {
    try {
      const payload = await context.clone().json() as { error?: unknown; message?: unknown };
      if (typeof payload.error === 'string' && payload.error.trim()) return payload.error;
      if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
    } catch {
      // The response may be empty or non-JSON. Fall back to the client error.
    }
  }

  return error instanceof Error && error.message ? error.message : fallback;
}
