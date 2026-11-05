import { errorResponse, type HttpController } from '../../../../shared/http.ts';
import { getUser, type GetUserDeps } from './app-rules.ts';

export function makeGetUserController(deps: GetUserDeps): HttpController {
  return async (request) => {
    const result = await getUser({ userId: request.params.userId ?? '' }, deps);
    if (!result.ok) return errorResponse(404, result.error, result.message);
    return { status: 200, body: result.value };
  };
}
