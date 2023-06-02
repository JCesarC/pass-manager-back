import { Get, Query, Route, Tags } from 'tsoa';

import { LogSuccess } from '../../../utils/logger';

@Route('/api/hello')
@Tags('HelloController')
export class HelloController {
  /**
   *Enpoint to retrieve a Message "Hello {name}"
   * @param { string | undefined } name Name of user
   * @returns Promise of any reponse
   */
  @Get('/')
  public async getMessage(@Query()name?: string): Promise<unknown> {
    LogSuccess('[\'/api/hello\'] get request');
    return {
      message: `Hello, ${name || 'world!'}`
    };
  };
};
