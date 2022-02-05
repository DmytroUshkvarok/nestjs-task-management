import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasks({ search, status }: GetTasksFilterDto): Promise<Task[]> {
    const queryBuilder = this.createQueryBuilder('task');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await queryBuilder.getMany();

    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const target = await this.findOne(id);

    if (!target) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return target;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const target = await this.getTaskById(id);

    await this.update(target, { status });

    return { ...target, status };
  }

  async deleteTask(id: string): Promise<void> {
    const target = await this.getTaskById(id);

    await this.delete(target);
  }
}
