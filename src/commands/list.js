import chalk from "chalk";
import todoService from "../services/todoService.js";
import { formatter } from "../utils/formatter.js";

export function listCommand(options = {}) {
    try {
        const { completed, pending, priority, tag } = options;

        // Get filtered todos
        const todos = todoService.filter({
            completed: completed || null,
            pending: pending || null,
            priority: priority || null,
            tag: tag || null
        });

        // Check if any todos exist
        const allTodos = todoService.getAll();

        if (allTodos.length === 0) {
            formatter.info('No tasks yet! Add one with: todo add "Your Task Here! boi"');
            return;
        }

        if (todos.length === 0) {
            let filterLabel = '';
            if (completed) filterLabel = 'completed';
            else if (pending) filterLabel = 'pending';
            else if (priority) filterLabel = `with priority ${priority}`;
            else if (tag) filterLabel = `with tag ${tag}`;

            formatter.info(`No ${filterLabel} tasks found!`);
            return;
        }

        // Build filter label
        let filterLabel = '';
        if (completed) filterLabel = ' (Completed)';
        else if (pending) filterLabel = ' (Pending)';
        else if (priority) filterLabel = ` (Priority: ${priority.toUpperCase()})`;
        else if (tag) filterLabel = ` (Tag: ${tag})`;

        formatter.header(`You have ${chalk.bold(todos.length)} task(s)${filterLabel}`);

        todos.forEach((todo, index) => {
            console.log(formatter.formatTask(todo, index));
        });

        formatter.emptyLine();

    } catch (error) {
        formatter.error(error.message);
        process.exit(1);
    }
}