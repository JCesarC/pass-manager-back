import express from 'express';
import v1Router from '../v1/router';

const mainRouter = express.Router();

mainRouter.use('/v1', v1Router);

export default mainRouter;
