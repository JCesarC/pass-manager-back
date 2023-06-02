import express, { Request, Response } from 'express';
import path from 'path';

// * SWAGGER
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../public/swagger.json';

// * SECURITY
import cors from 'cors';
import helmet from 'helmet';

// TODO HTTPS

// * MAIN ROUTER
import mainRooter from './routes';
import morgan from 'morgan';

// * EXPRESS APP
const app = express();

// * Security config
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

// * Content type config
app.use(express.urlencoded({ extended: true, limit: '50mb'}));
app.use(express.json());

// dist/swagger.json
// * Swagger config and route
const options = {
  explorer: true
};
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

// * DEFINE APP to use "/api" and use rootRouter from 'index.ts' in routes
app.use('/api', mainRooter);

// * static server
app.use(express.static(path.join(__dirname, '..', 'public', 'docs')));
app.use('/portal*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'docs', 'index.html'));
});

// * Redirect config
//app.get()

export default app;
