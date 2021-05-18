import { Todo } from './todo';
import { v4 as uuidv4 } from 'uuid';
import { inject, singleton } from 'tsyringe';
import { Database } from '../ioc';

// A post request should not contain an id.
export type TodoCreationParams = Pick<Todo, 'description'>;

const collection = 'todos';

@singleton()
export class TodosService {
  constructor(@inject('Database') private database?: Database) {}

  public async get(id: string, description?: string): Promise<Todo> {
    return {
      id,
      description: description ?? 'Keep moving',
    };
  }

  public async create(todoCreationParams: TodoCreationParams): Promise<Todo> {
    const docRef = this.database.collection('collection').doc(uuidv4());
    const data = {
      id: uuidv4(), // Random
      ...todoCreationParams,
    };
    await docRef.create(data);
    return data;
  }
}
