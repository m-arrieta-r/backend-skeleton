import { errorResponse, type HttpController } from '../../../../shared/http.ts';
import { getPost, type GetPostDeps } from './app-rules.ts';

export function makeGetPostController(deps: GetPostDeps): HttpController {
  return async (request) => {
    const requesterId = request.headers['x-user-id'];
    const result = await getPost(
      { postId: request.params.postId ?? '', ...(requesterId ? { requesterId } : {}) },
      deps,
    );
    if (!result.ok) return errorResponse(404, result.error, result.message);
    return { status: 200, body: result.value };
  };
}
