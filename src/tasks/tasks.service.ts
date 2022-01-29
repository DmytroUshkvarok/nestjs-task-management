import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

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

  getAllTasks() {
    return this.tasks;
  }
}
