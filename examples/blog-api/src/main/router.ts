import type { HttpController } from '../shared/http.ts';

export type Route = { method: string; path: string; controller: HttpController };

export type RouteMatch = { controller: HttpController; params: Record<string, string> };

/** Tiny path matcher: `/posts/:postId/publish`. Replace with your framework's router. */
export function matchRoute(routes: readonly Route[], method: string, pathname: string): RouteMatch | undefined {
  const actual = pathname.split('/').filter(Boolean);

  for (const route of routes) {
    if (route.method !== method) continue;
    const expected = route.path.split('/').filter(Boolean);
    if (expected.length !== actual.length) continue;

    const params: Record<string, string> = {};
    const matches = expected.every((segment, i) => {
      const value = actual[i] ?? '';
      if (segment.startsWith(':')) {
        params[segment.slice(1)] = decodeURIComponent(value);
        return true;
      }
      return segment === value;
    });
    if (matches) return { controller: route.controller, params };
  }
  return undefined;
}
