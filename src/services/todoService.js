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
}

export default new TodoService(storageService);