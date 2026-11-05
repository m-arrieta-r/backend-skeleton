/**
 * Explicit success/failure value returned by app rules and domain factories.
 * Errors are string codes so controllers can map them exhaustively to transport codes.
 */
export type Result<T, E extends string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E; readonly message: string };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function fail<E extends string>(error: E, message: string): Result<never, E> {
  return { ok: false, error, message };
}
