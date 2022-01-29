import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'test 1',
      description: 'test 1',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'test 2',
      description: 'test 2',
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters({ search, status }: GetTasksFilterDto): Task[] {
    let result = this.getAllTasks();

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    if (search) {
      result = result.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return result;
  }

  getTaskById(id: string): Task {
    const target = this.tasks.find((task) => task.id === id);
    if (!target) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return target;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    console.log(`Task with id ${task.id} was succesfully created.`);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const target = this.getTaskById(id);
    target.status = status;
    console.log(
      `Task with id ${id} was succesfully updated with new status "${status}".`,
    );
    return target;
  }

  deleteTask(id: string): void {
    const target = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    console.log(`Task with id ${target.id} was succesfully deleted.`);
  }
}
