import express from 'express';
import v1Router from '../v1/router';

const mainRooter = express.Router();

mainRooter.use('/v1', v1Router);

export default mainRooter;
