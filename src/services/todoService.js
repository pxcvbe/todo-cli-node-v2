import storageService from './storageService.js';
import { PRIORITY, MESSAGES } from '../config/constants.js';

class TodoService {
    constructor(storage) {
        this.storage = storage;
    }

    getAll() {
        return this.storage.read();
    }

    getById(id) {
        const todos = this.getAll();
        const todo = todos.find(t => t.id === id);

        if (!todo) {
            throw new Error(`Task with ID ${id} not found`);
        }

        return todo;
    }

    create({ description, priority = PRIORITY.MEDIUM, dueDate = null, tag = null}) {
        const todos = this.getAll();

        const newTodo = {
            id: Date.now(),
            description,
            completed: false,
            priority,
            dueDate,
            tag,
            createdAt: new Date().toISOString()
        };

        todos.push(newTodo);
        this.storage.write(todos);

        return newTodo;
    }    

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
}

export default new TodoService(storageService);