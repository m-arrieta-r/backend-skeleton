import { errorResponse, isRecord, type HttpController } from '../../../../shared/http.ts';
import { __appCase__, type __AppCase__Deps, type __AppCase__Error } from './app-rules.ts';

/** Exhaustive: the compiler fails if an error code has no status. */
const STATUS_BY_ERROR: Record<__AppCase__Error, number> = {
  SOMETHING_NOT_FOUND: 404,
};

export function make__AppCase__Controller(deps: __AppCase__Deps): HttpController {
  return async (request) => {
    const { body } = request;
    if (!isRecord(body)) {
      return errorResponse(400, 'INVALID_INPUT', 'Describe the expected body shape here.');
    }

    const result = await __appCase__({ /* map request -> input */ }, deps);
    if (!result.ok) return errorResponse(STATUS_BY_ERROR[result.error], result.error, result.message);
    return { status: 200, body: result.value };
  };
}
