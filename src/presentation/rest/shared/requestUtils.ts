import { Request } from 'express';

export const getPaginationQueries = (req: Request) => {
  const page = req?.query?.page as string || '1';
  const limit = req?.query?.limit as string || '5';

  const intPage = parseInt(page);
  const intLimit = parseInt(limit);
  return {
    page: intPage,
    limit: intLimit
  };
};
