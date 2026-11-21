import Joi from 'joi';

import { INoteModel } from '../../domain/notes/interfaces';

const noteFields = {
  title: Joi.string().trim().min(1).max(200),
  body: Joi.string().max(10_000).allow(''),
  isFavorite: Joi.boolean(),
  isArchived: Joi.boolean(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  imageURLs: Joi.array().items(Joi.string().uri()).max(5),
};

const noteValidator = Joi.object<Partial<INoteModel>>({
  ...noteFields,
  title: noteFields.title.required(),
});

/** Partial update: any subset of the editable fields, but at least one. */
const noteUpdateValidator = Joi.object<Partial<INoteModel>>(noteFields).min(1);

export { noteUpdateValidator, noteValidator };
