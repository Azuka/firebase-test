import { Todo } from './todo';
import { v4 as uuidv4 } from 'uuid';

// A post request should not contain an id.
export type TodoCreationParams = Pick<Todo, 'description'>;

export class TodosService {
  public get(id: string, description?: string): Todo {
    return {
      id,
      description: description ?? 'Keep moving',
    };
  }

  public create(todoCreationParams: TodoCreationParams): Todo {
    return {
      id: uuidv4(), // Random
      ...todoCreationParams,
    };
  }
}
