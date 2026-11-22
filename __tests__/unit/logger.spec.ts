import { Writable } from 'stream';
import pino from 'pino';

import { REDACTED_PATHS } from '../../src/infrastructure/shared/logger';

const captureLog = (payload: object): Record<string, unknown> => {
  let output = '';
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });
  pino({ redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' } }, stream).info(payload, 'test');
  return JSON.parse(output);
};

describe('logger redaction', () => {
  it('redacts credentials in request headers', () => {
    const log = captureLog({
      req: { headers: { authorization: 'Bearer secret-token', cookie: 'refresh=secret' } },
    });

    expect(log.req).toEqual({ headers: { authorization: '[REDACTED]', cookie: '[REDACTED]' } });
  });

  it('redacts secrets at any of the first nesting levels', () => {
    const log = captureLog({
      password: 'p1',
      user: { password: 'p2', email: 'jane@example.com' },
      body: { credentials: { refreshToken: 'r1' } },
    });

    expect(log.password).toBe('[REDACTED]');
    expect(log.user).toEqual({ password: '[REDACTED]', email: 'jane@example.com' });
    expect(log.body).toEqual({ credentials: { refreshToken: '[REDACTED]' } });
  });
});
