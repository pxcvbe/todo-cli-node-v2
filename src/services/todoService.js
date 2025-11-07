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

    search(keyword) {
        const todos = this.getAll();
        const searchTerm = keyword.toLowerCase();

        return todos.filter(t => 
            t.description.toLowerCase().includes(searchTerm) ||
            (t.tag && t.tag.toLowerCase().includes(searchTerm))
        );
    }
}

export default new TodoService(storageService);