import { errorResponse, isRecord, type HttpController } from '../../../../shared/http.ts';
import { signUpUser, type SignUpUserDeps, type SignUpUserError } from './app-rules.ts';

const STATUS_BY_ERROR: Record<SignUpUserError, number> = {
  INVALID_EMAIL: 400,
  INVALID_NAME: 400,
  EMAIL_ALREADY_TAKEN: 409,
};

/** Controller: translate HTTP <-> app rules input/output. No business decisions here. */
export function makeSignUpUserController(deps: SignUpUserDeps): HttpController {
  return async (request) => {
    const { body } = request;
    if (!isRecord(body) || typeof body.email !== 'string' || typeof body.name !== 'string') {
      return errorResponse(400, 'INVALID_INPUT', 'Body must be { email: string, name: string }.');
    }

    const result = await signUpUser({ email: body.email, name: body.name }, deps);
    if (!result.ok) return errorResponse(STATUS_BY_ERROR[result.error], result.error, result.message);
    return { status: 201, body: result.value };
  };
}
