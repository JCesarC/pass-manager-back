import Joi from 'joi';

import { INoteModel } from '../../domain/notes/interfaces';

const noteValidator = Joi.object<INoteModel>({
  user: Joi.string().required(),
  title: Joi.string(),
  body: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
  isFavorite: Joi.boolean(),
  isArchived: Joi.boolean(),
  tags: Joi.array(),
});

export { noteValidator };
