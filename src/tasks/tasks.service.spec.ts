import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
});

const mockId = 'mockId';
const mockUser: User = {
  id: mockId,
  username: 'testUser',
  password: 'testPassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('some values...');
      const tasks = await tasksService.getTasks(null, mockUser);

      expect(tasksRepository.getTasks).toBeCalledTimes(1);
      expect(tasks).toEqual('some values...');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.getTaskById and returns the result when tasksRepository returns some task', async () => {
      tasksRepository.getTaskById.mockResolvedValue('some values...');
      const task = await tasksService.getTaskById(mockId, mockUser);

      expect(tasksRepository.getTaskById).toBeCalledTimes(1);
      expect(task).toEqual('some values...');
    });

    it('calls tasksRepository.getTaskById and throws 404 exception when tasksRepository can not find a task', async () => {
      tasksRepository.getTaskById.mockResolvedValue(null);
      expect(tasksService.getTaskById(mockId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
