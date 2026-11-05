import { errorResponse, isRecord, type HttpController } from '../../../../shared/http.ts';
import { createPostDraft, type CreatePostDraftDeps, type CreatePostDraftError } from './app-rules.ts';

const STATUS_BY_ERROR: Record<CreatePostDraftError, number> = {
  INVALID_TITLE: 400,
  INVALID_BODY: 400,
  AUTHOR_NOT_FOUND: 404,
};

export function makeCreatePostDraftController(deps: CreatePostDraftDeps): HttpController {
  return async (request) => {
    const authorId = request.headers['x-user-id'];
    if (!authorId) return errorResponse(401, 'UNAUTHENTICATED', 'Missing x-user-id header.');

    const { body } = request;
    if (!isRecord(body) || typeof body.title !== 'string' || typeof body.body !== 'string') {
      return errorResponse(400, 'INVALID_INPUT', 'Body must be { title: string, body: string }.');
    }

    const result = await createPostDraft({ authorId, title: body.title, body: body.body }, deps);
    if (!result.ok) return errorResponse(STATUS_BY_ERROR[result.error], result.error, result.message);
    return { status: 201, body: result.value };
  };
}
