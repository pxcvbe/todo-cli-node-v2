/**
 * @fileoverview Service for managing todo operations and business logic.
 * @module services/todoService
 * @description Provides methods for CRUD operations, filtering, searching, and statistics for todos.
 */

import storageService from './storageService.js';
import { PRIORITY, MESSAGES } from '../config/constants.js';

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier for the todo.
 * @property {string} description - Task description.
 * @property {boolean} completed - Completion status.
 * @property {string} priority - Priority level (high, medium, low).
 * @property {string|null} dueDate - Due date in YYYY-MM-DD format.
 * @property {string|null} tag - Tag associated with the task.
 * @property {string} createdAt - ISO timestamp of creation.
 * @property {string} [updatedAt] - ISO timestamp of last update.
 * @property {string} [completedAt] - ISO timestamp of completion.
 */

/**
 * @typedef {Object} TodoStats
 * @property {number} total - Total number of tasks.
 * @property {number} completed - Number of completed tasks.
 * @property {number} pending - Number of pending tasks.
 * @property {number} percentage - Completion percentage (0-100).
 * @property {string} motivationalMessage - Motivational message based on progress.
 */

/**
 * @typedef {Object} UpdateResult
 * @property {Todo} old - The todo before update.
 * @property {Todo} updated - The todo after update.
 */

/**
 * @typedef {Object} ClearResult
 * @property {number} cleared - Number of tasks cleared.
 * @property {number} remaining - Number of tasks remaining.
 */

/**
 * @typedef {Object} ImportResult
 * @property {number} imported - Number of tasks imported.
 * @property {number} total - Total number of tasks after import.
 */

/**
 * Service class for managing todos.
 * @class TodoService
 * @description Handles all business logic for todo operations including CRUD, filtering, and statistics.
 */
class TodoService {
    /**
     * Creates a new TodoService instance.
     * @param {StorageService} storage - Storage service instance for data persistence.
     * @constructor
     */
    constructor(storage) {
        /**
         * Storage service instance.
         * @type {StorageService}
         * @private
         */
        this.storage = storage;
    }

    /**
     * Retrieves all todos from storage.
     * @method getAll
     * @returns {Array<Todo>} Array of all todo objects.
     */
    getAll() {
        return this.storage.read();
    }

    /**
     * Retrieves a todo by its ID.
     * @method getById
     * @param {number} id - The ID of the todo to retrieve.
     * @returns {Todo} The todo object with the specified ID.
     * @throws {Error} If the todo with the specified ID is not found.
     */
    getById(id) {
        const todos = this.getAll();
        const todo = todos.find(t => t.id === id);

        if (!todo) {
            throw new Error(`Task with ID ${id} not found`);
        }

        return todo;
    }

    /**
     * Creates a new todo.
     * @method create
     * @param {Object} todoData - The todo data.
     * @param {string} todoData.description - Task description.
     * @param {string} [todoData.priority=PRIORITY.MEDIUM] - Priority level (high, medium, low).
     * @param {string|null} [todoData.dueDate=null] - Due date in YYYY-MM-DD format.
     * @param {string|null} [todoData.tag=null] - Tag associated with the task.
     * @returns {Todo} The newly created todo object.
     */
    create({ description, priority = PRIORITY.MEDIUM, dueDate = null, tag = null}) {
        const todos = this.getAll();

        const normalizedPriority = priority || PRIORITY.MEDIUM;

        const newTodo = {
            id: Date.now(),
            description,
            completed: false,
            priority: normalizedPriority,
            dueDate,
            tag,
            createdAt: new Date().toISOString()
        };

        todos.push(newTodo);
        this.storage.write(todos);

        return newTodo;
    }

    /**
     * Updates an existing todo.
     * @method update
     * @param {number} id - The ID of the todo to update.
     * @param {Object} updates - Object containing fields to update.
     * @returns {UpdateResult} Object containing the old and updated todo.
     * @throws {Error} If the todo with the specified ID is not found.
     */
    update(id, updates) {
        const todos = this.getAll();
        const todoIndex = todos.findIndex(t => t.id === id);

        if (todoIndex === -1) {
            throw new Error (`Task with ID ${id} not found`);
        }

        const oldTodo = { ...todos[todoIndex] };
        todos[todoIndex] = {
            ...todos[todoIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.storage.write(todos);

        return { old: oldTodo, updated: todos[todoIndex] };
    }

    /**
     * Deletes a todo by its ID.
     * @method delete
     * @param {number} id - The ID of the todo to delete.
     * @returns {Todo} The deleted todo object.
     * @throws {Error} If the todo with the specified ID is not found.
     */
    delete(id) {
        const todos = this.getAll();
        const todoIndex = todos.findIndex(t => t.id === id);

        if (todoIndex === -1) {
            throw new Error(`Task with ID ${id} not found`);
        }

        const deletedTodo = todos[todoIndex];
        todos.splice(todoIndex, 1);
        this.storage.write(todos);

        return deletedTodo;
    }

    /**
     * Marks a todo as completed.
     * @method complete
     * @param {number} id - The ID of the todo to complete.
     * @returns {UpdateResult} Object containing the old and updated todo.
     * @throws {Error} If the todo is already completed or not found.
     */
    complete(id) {
        const todo = this.getById(id);

        if (todo.completed) {
            throw new Error('Task is already completed');
        }

        return this.update(id, {
            completed: true,
            completedAt: new Date().toISOString()
        });
    }

    /**
     * Marks a completed todo as incomplete.
     * @method uncomplete
     * @param {number} id - The ID of the todo to mark as incomplete.
     * @returns {UpdateResult} Object containing the old and updated todo.
     * @throws {Error} If the todo is not completed or not found.
     */
    uncomplete(id) {
        const todo = this.getById(id);

        if (!todo.completed) {
            throw new Error('Task is not completed yet');
        }

        const updated = this.update(id, { completed: false });
        delete updated.updated.completedAt;
        this.storage.write(this.getAll());

        return updated;
    }

    /**
     * Filters todos based on various criteria.
     * @method filter
     * @param {Object} filters - Filter criteria.
     * @param {boolean|null} [filters.completed=null] - Filter by completed status (true for completed only).
     * @param {boolean|null} [filters.pending=null] - Filter by pending status (true for pending only).
     * @param {string|null} [filters.priority=null] - Filter by priority level.
     * @param {string|null} [filters.tag=null] - Filter by tag.
     * @returns {Array<Todo>} Array of filtered todo objects.
     */
    filter({ completed = null, pending = null, priority = null, tag = null}) {
        let todos = this.getAll();

        if (completed === true) {
            todos = todos.filter(t => t.completed);
        } else if (pending === true) {
            todos = todos.filter(t => !t.completed);
        }

        if (priority) {
            todos = todos.filter(t => t.priority === priority);
        }

        if (tag) {
            todos = todos.filter(t => t.tag === tag);
        }

        return todos;
    }

    /**
     * Searches todos by keyword in description or tag.
     * @method search
     * @param {string} keyword - Search keyword.
     * @returns {Array<Todo>} Array of todos matching the keyword.
     */
    search(keyword) {
        const todos = this.getAll();
        const searchTerm = keyword.toLowerCase();

        return todos.filter(t => 
            t.description.toLowerCase().includes(searchTerm) ||
            (t.tag && t.tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Removes all completed todos from storage.
     * @method clearCompleted
     * @returns {ClearResult} Object containing the number of cleared and remaining tasks.
     */
    clearCompleted() {
        const todos = this.getAll();
        const completedTasks = todos.filter(t => t.completed);
        const remainingTasks = todos.filter(t =>  !t.completed);

        this.storage.write(remainingTasks);

        return {
            cleared: completedTasks.length,
            remaining: remainingTasks.length
        };
    }

    /**
     * Gets statistics about todos.
     * @method getStats
     * @returns {TodoStats} Object containing todo statistics and motivational message.
     */
    getStats() {
        const todos = this.getAll();
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        let motivationalMessage = '';

        switch (true) {
            case (percentage === 100):
                motivationalMessage = MESSAGES.MOTIVATIONAL.PERFECT;
                break;
            case (percentage >= 75):
                motivationalMessage = MESSAGES.MOTIVATIONAL.GREAT;
                break;
            case (percentage >= 50):
                motivationalMessage = MESSAGES.MOTIVATIONAL.HALFWAY;
                break;
            case (percentage >= 25):
                motivationalMessage = MESSAGES.MOTIVATIONAL.GOOD;
                break;
            case (percentage > 0):
                motivationalMessage = MESSAGES.MOTIVATIONAL.START;
                break;
            default:
                motivationalMessage = MESSAGES.MOTIVATIONAL.BEGIN;
        }

        return {
            total,
            completed,
            pending,
            percentage,
            motivationalMessage
        };
    }

    /**
     * Exports all todos.
     * @method export
     * @returns {Array<Todo>} Array of all todo objects.
     */
    export() {
        return this.getAll();
    }

    /**
     * Imports todos from an array and merges with existing todos.
     * @method import
     * @param {Array<Todo>} tasks - Array of todo objects to import.
     * @returns {ImportResult} Object containing the number of imported tasks and total tasks.
     * @throws {Error} If the import data is not an array.
     */
    import(tasks) {
        if (!Array.isArray(tasks)) {
            throw new Error('Invalid import data. Expected an array of tasks');
        }

        const currentTodos = this.getAll();
        const mergedTodos = [...currentTodos, ...tasks];

        this.storage.write(mergedTodos);

        return {
            imported: tasks.length,
            total: mergedTodos.length
        }
    }
}

/**
 * TodoService class export.
 * @exports TodoService
 */
export { TodoService };

/**
 * Default TodoService instance with storage service.
 * @type {TodoService}
 * @exports todoService
 */
export default new TodoService(storageService);