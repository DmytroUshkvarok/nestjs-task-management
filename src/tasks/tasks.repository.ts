import {
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }

  async getTasks(
    { search, status }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const queryBuilder = this.createQueryBuilder('task').where({ user });

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(
        `Failed get tasks for user ${user.username}. Filters: ${JSON.stringify({
          search,
          status,
        })}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const target = await this.findOne({ id, user });

    if (!target) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return target;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const target = await this.getTaskById(id, user);

    await this.update(target, { status });

    return { ...target, status };
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const target = await this.getTaskById(id, user);

    await this.delete(target);
  }
}
