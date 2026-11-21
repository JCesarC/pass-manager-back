import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import pinoHttp from 'pino-http';

import { logger } from '../../../infrastructure/shared/logger';

const REQUEST_ID_HEADER = 'x-request-id';
const isValidRequestId = (value: unknown): value is string =>
  typeof value === 'string' && /^[\w-]{1,64}$/.test(value);

/**
 * One structured log line per request, correlated by a request id that is
 * accepted from a trusted proxy (when well-formed) or generated, and echoed
 * back in the X-Request-Id response header.
 */
export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const incoming = req.headers[REQUEST_ID_HEADER];
    const id = isValidRequestId(incoming) ? incoming : randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req: IncomingMessage & { id?: string }) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
  },
  autoLogging: { ignore: (req) => req.url?.startsWith('/api/docs') ?? false },
});
