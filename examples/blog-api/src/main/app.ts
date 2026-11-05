import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import {
  InMemoryPostRepository,
  makeCreatePostDraftController,
  makeGetPostController,
  makePublishPostController,
} from '../modules/posts/index.ts';
import { InMemoryUserRepository, makeGetUserController, makeSignUpUserController } from '../modules/users/index.ts';
import { matchRoute, type Route } from './router.ts';

/**
 * Composition root: the only place that knows every module. It creates adapters,
 * wires dependencies into each app case and registers one route per app case.
 * Adding an app case = add its folder + one line here.
 */
export function createRoutes(): Route[] {
  const users = new InMemoryUserRepository();
  const posts = new InMemoryPostRepository();
  const generateId = () => randomUUID();
  const now = () => new Date();
  const authorExists = async (id: string) => (await users.findById(id)) !== undefined;

  return [
    { method: 'POST', path: '/users', controller: makeSignUpUserController({ users, generateId, now }) },
    { method: 'GET', path: '/users/:userId', controller: makeGetUserController({ users }) },
    { method: 'POST', path: '/posts', controller: makeCreatePostDraftController({ posts, authorExists, generateId, now }) },
    { method: 'POST', path: '/posts/:postId/publish', controller: makePublishPostController({ posts, now }) },
    { method: 'GET', path: '/posts/:postId', controller: makeGetPostController({ posts }) },
  ];
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return undefined;
  }
}

/** node:http adapter. Swap for Express/Fastify/Lambda without touching any app case. */
export function createApp(): Server {
  const routes = createRoutes();

  return createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const match = matchRoute(routes, req.method ?? 'GET', url.pathname);

    const send = (status: number, body?: unknown) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(body === undefined ? undefined : JSON.stringify(body));
    };

    if (!match) return send(404, { error: 'ROUTE_NOT_FOUND', message: `${req.method} ${url.pathname}` });

    try {
      const headers: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        headers[key] = Array.isArray(value) ? value[0] : value;
      }
      const response = await match.controller({ params: match.params, headers, body: await readJson(req) });
      send(response.status, response.body);
    } catch (error) {
      console.error(error);
      send(500, { error: 'INTERNAL_ERROR', message: 'Unexpected error.' });
    }
  });
}
