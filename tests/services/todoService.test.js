import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoService } from '../../src/services/todoService.js';
import { PRIORITY } from '../../src/config/constants.js';

// Mock storage
const mockStorage = {
  data: [],
  read() {
    return [...this.data];
  },
  write(data) {
    this.data = [...data];
    return true;
  },
  reset() {
    this.data = [];
  }
};

describe('TodoService', () => {
  let service;

  beforeEach(() => {
    mockStorage.reset();
    service = new TodoService(mockStorage);
  });

  describe('create', () => {
    it('should create a new task', () => {
      const task = service.create({
        description: 'Test task',
        priority: PRIORITY.HIGH
      });

      expect(task).toMatchObject({
        description: 'Test task',
        priority: PRIORITY.HIGH,
        completed: false
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    it('should create task with default priority', () => {
      const task = service.create({ description: 'Test task' });
      expect(task.priority).toBe(PRIORITY.MEDIUM);
    });
  });

  describe('getAll', () => {
    it('should return all tasks', () => {
      service.create({ description: 'Task 1' });
      service.create({ description: 'Task 2' });

      const tasks = service.getAll();
      expect(tasks).toHaveLength(2);
    });

    it('should return empty array when no tasks', () => {
      const tasks = service.getAll();
      expect(tasks).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return task by ID', () => {
      const created = service.create({ description: 'Test task' });
      const found = service.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should throw error when task not found', () => {
      expect(() => service.getById(999)).toThrow('not found');
    });
  });

  describe('update', () => {
    it('should update task description', () => {
      const task = service.create({ description: 'Old description' });
      const result = service.update(task.id, { description: 'New description' });

      expect(result.updated.description).toBe('New description');
      expect(result.old.description).toBe('Old description');
      expect(result.updated.updatedAt).toBeDefined();
    });

    it('should throw error when task not found', () => {
      expect(() => service.update(999, { description: 'New' })).toThrow('not found');
    });
  });

  describe('delete', () => {
    it('should delete task by ID', () => {
      const task = service.create({ description: 'Test task' });
      const deleted = service.delete(task.id);

      expect(deleted).toEqual(task);
      expect(service.getAll()).toHaveLength(0);
    });

    it('should throw error when task not found', () => {
      expect(() => service.delete(999)).toThrow('not found');
    });
  });

  describe('complete', () => {
    it('should mark task as complete', () => {
      const task = service.create({ description: 'Test task' });
      const result = service.complete(task.id);

      expect(result.updated.completed).toBe(true);
      expect(result.updated.completedAt).toBeDefined();
    });

    it('should throw error when already completed', () => {
      const task = service.create({ description: 'Test task' });
      service.complete(task.id);

      expect(() => service.complete(task.id)).toThrow('already completed');
    });
  });

  describe('uncomplete', () => {
    it('should mark task as incomplete', () => {
      const task = service.create({ description: 'Test task' });
      service.complete(task.id);
      const result = service.uncomplete(task.id);

      expect(result.updated.completed).toBe(false);
      expect(result.updated.completedAt).toBeUndefined();
    });

    it('should throw error when not completed', () => {
      const task = service.create({ description: 'Test task' });
      expect(() => service.uncomplete(task.id)).toThrow('not completed yet');
    });
  });

  describe('filter', () => {
    beforeEach(() => {
      const task1 = service.create({ description: 'Task 1', priority: PRIORITY.HIGH});
      const task2 = service.create({ description: 'Task 2', priority: PRIORITY.LOW});
      const task3 = service.create({ description: 'Task 3', priority: PRIORITY.HIGH});
      // Mark task2 as completed
      service.complete(task2.id)
    });

    it('should filter by completed status', () => {
      const completed = service.filter({ completed: true });
      expect(completed).toHaveLength(1);
      expect(completed[0].completed).toBe(true);
    });

    it('should filter by pending status', () => {
      const pending = service.filter({ pending: true });
      expect(pending).toHaveLength(2);
      pending.forEach(task => expect(task.completed).toBe(false));
    });

    it('should filter by priority', () => {
      const highPriority = service.filter({ priority: PRIORITY.HIGH });
      expect(highPriority).toHaveLength(2);
      highPriority.forEach(task => expect(task.priority).toBe(PRIORITY.HIGH));
    });
  });

  describe('search', () => {
    beforeEach(() => {
      service.create({ description: 'Fix bug in login' });
      service.create({ description: 'Add new feature' });
      service.create({ description: 'Fix bug in signup' });
    });

    it('should search tasks by keyword', () => {
      const results = service.search('bug');
      expect(results).toHaveLength(2);
    });

    it('should return empty array when no match', () => {
      const results = service.search('nonexistent');
      expect(results).toEqual([]);
    });

    it('should be case insensitive', () => {
      const results = service.search('BUG');
      expect(results).toHaveLength(2);
    });
  });

  describe('clearCompleted', () => {
    it('should clear all completed tasks', () => {
      service.create({ description: 'Task 1', completed: false });
      const task2 = service.create({ description: 'Task 2', completed: false });
      service.complete(task2.id);

      const result = service.clearCompleted();

      expect(result.cleared).toBe(1);
      expect(result.remaining).toBe(1);
      expect(service.getAll()).toHaveLength(1);
    });

    it('should return 0 when no completed tasks', () => {
      service.create({ description: 'Task 1' });
      const result = service.clearCompleted();

      expect(result.cleared).toBe(0);
      expect(result.remaining).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      service.create({ description: 'Task 1' });
      const task2 = service.create({ description: 'Task 2' });
      service.complete(task2.id);

      const stats = service.getStats();

      expect(stats.total).toBe(2);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.percentage).toBe(50);
      expect(stats.motivationalMessage).toBeDefined();
    });

    it('should return 0% for empty task list', () => {
      const stats = service.getStats();

      expect(stats.total).toBe(0);
      expect(stats.percentage).toBe(0);
    });

    it('should return 100% when all tasks completed', () => {
      const task1 = service.create({ description: 'Task 1' });
      service.complete(task1.id);

      const stats = service.getStats();
      expect(stats.percentage).toBe(100);
    });
  });

  describe('export', () => {
    it('should export all tasks', () => {
      service.create({ description: 'Task 1' });
      service.create({ description: 'Task 2' });

      const exported = service.export();
      expect(exported).toHaveLength(2);
    });
  });

  describe('import', () => {
    it('should import tasks', () => {
      const importData = [
        { id: 1, description: 'Imported 1', completed: false },
        { id: 2, description: 'Imported 2', completed: true }
      ];

      const result = service.import(importData);

      expect(result.imported).toBe(2);
      expect(result.total).toBe(2);
      expect(service.getAll()).toHaveLength(2);
    });

    it('should merge with existing tasks', () => {
      service.create({ description: 'Existing task' });

      const importData = [
        { id: 999, description: 'Imported task', completed: false }
      ];

      const result = service.import(importData);

      expect(result.imported).toBe(1);
      expect(result.total).toBe(2);
    });

    it('should throw error for invalid import data', () => {
      expect(() => service.import('invalid')).toThrow('Invalid import data');
      expect(() => service.import({})).toThrow('Invalid import data');
    });
  });
});