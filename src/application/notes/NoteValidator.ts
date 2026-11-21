import Joi from 'joi';

/** Request body to create a note. The owner is always the authenticated user. */
export interface NoteInput {
  title: string;
  body?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  tags?: string[];
  imageURLs?: string[];
}

/** Request body to update a note: any subset of the editable fields. */
export interface NoteUpdateInput {
  title?: string;
  body?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  tags?: string[];
  imageURLs?: string[];
}

const noteFields = {
  title: Joi.string().trim().min(1).max(200),
  body: Joi.string().max(10_000).allow(''),
  isFavorite: Joi.boolean(),
  isArchived: Joi.boolean(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  imageURLs: Joi.array().items(Joi.string().uri()).max(5),
};

const noteValidator = Joi.object<NoteInput>({
  ...noteFields,
  title: noteFields.title.required(),
});

/** Partial update: any subset of the editable fields, but at least one. */
const noteUpdateValidator = Joi.object<NoteUpdateInput>(noteFields).min(1);

export { noteUpdateValidator, noteValidator };
