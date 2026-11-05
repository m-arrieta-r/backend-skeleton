import { errorResponse, type HttpController } from '../../../../shared/http.ts';
import { publishPost, type PublishPostDeps, type PublishPostError } from './app-rules.ts';

const STATUS_BY_ERROR: Record<PublishPostError, number> = {
  POST_NOT_FOUND: 404,
  NOT_POST_AUTHOR: 403,
  ALREADY_PUBLISHED: 409,
};

export function makePublishPostController(deps: PublishPostDeps): HttpController {
  return async (request) => {
    const requesterId = request.headers['x-user-id'];
    if (!requesterId) return errorResponse(401, 'UNAUTHENTICATED', 'Missing x-user-id header.');

    const result = await publishPost({ postId: request.params.postId ?? '', requesterId }, deps);
    if (!result.ok) return errorResponse(STATUS_BY_ERROR[result.error], result.error, result.message);
    return { status: 200, body: result.value };
  };
}
