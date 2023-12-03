import { Container } from 'inversify';

import { INoteRepository } from '../../../../../domain/notes/repository/INoteRepository';
import { TYPES } from '../../../../../domain/types';

import { NoteRepository } from '../../../../persistance/mongoose/database/notes/repository/NoteRepository';
import NoteSchema from '../../../../persistance/mongoose/database/notes/models/NoteSchema';

const setupNoteRepository = (iocContainer: Container) => {
  iocContainer.bind<INoteRepository>(TYPES.INoteRepository).toDynamicValue(() => {
    return new NoteRepository(NoteSchema);
  });
};

export { setupNoteRepository };
