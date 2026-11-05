/**
 * Framework-agnostic HTTP contract. Controllers depend on this, never on node:http,
 * Express, Lambda, etc. Adapters in src/main translate a real transport into it.
 */
export type HttpRequest = {
  readonly params: Readonly<Record<string, string>>;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly body: unknown;
};

export type HttpResponse = {
  readonly status: number;
  readonly body?: unknown;
};

export type HttpController = (request: HttpRequest) => Promise<HttpResponse>;

export function errorResponse(status: number, error: string, message: string): HttpResponse {
  return { status, body: { error, message } };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
