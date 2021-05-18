import {
  Body,
  Controller,
  Get,
  Inject,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa';
import { Todo } from './todo';
import { TodosService, TodoCreationParams } from './todoService';
import { injectable } from 'tsyringe';

@injectable()
@Route('todos')
export class TodosController extends Controller {
  constructor(private todosService?: TodosService) {
    super();
  }

  @Get('{todoId}')
  public async getTodo(
    @Path() todoId: string,
    @Query() name?: string
  ): Promise<Todo> {
    return await this.todosService.get(todoId, name);
  }

  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createTodo(
    @Body() requestBody: TodoCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    this.todosService.create(requestBody);
    return;
  }
}
