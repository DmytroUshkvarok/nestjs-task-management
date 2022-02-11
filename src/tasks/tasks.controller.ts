import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskIdDto } from './dto/task-id.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  private logger = new Logger('TasksController');

  @Get()
  getTasks(
    @Query() filters: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} ${
        user.id
      } retrieving all tasks. Filters: ${JSON.stringify(filters)}`,
    );
    return this.tasksService.getTasks(filters, user);
  }

  @Get('/:id')
  getTask(@Param() params: TaskIdDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} ${user.id} retrieving task ${params.id}.`,
    );

    return this.tasksService.getTaskById(params.id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} ${
        user.id
      } is creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );

    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param() params: TaskIdDto,
    @Body() statusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} ${user.id} updating a task ${
        params.id
      }. Status: ${JSON.stringify(statusDto)}`,
    );

    return this.tasksService.updateTaskStatus(
      params.id,
      statusDto.status,
      user,
    );
  }

  @Delete('/:id')
  deleteTask(@Param() params: TaskIdDto, @GetUser() user: User): Promise<void> {
    this.logger.verbose(
      `User ${user.username} ${user.id} deleting a task ${params.id}.`,
    );

    return this.tasksService.deleteTask(params.id, user);
  }
}
