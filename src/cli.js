import { Command } from "commander";
import chalk from "chalk";
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from "./commands/update.js";
import { deleteCommand } from "./commands/delete.js";
import { completeCommand, uncompleteCommand } from "./commands/complete.js";

const program = new Command();

program
    .name('todos')
    .description(chalk.cyan('Simple and powerful CLI Todo List List manager'))
    .version('2.0.0');

// Add command
program
    .command('add <description...>')
    .description('Add a new task')
    .action((description) => {
        addCommand(description.join(' '));
    });

// List command
program
    .command('list')
    .description('Show all tasks')
    .option('-c, --completed', 'Show only completed tasks')
    .option('-p, --pending', 'Show only pending tasks')
    .option('--priority <level>', 'Filter by priority (high, medium, low)')
    .option('--tag <name>', 'Filter by tag')
    .action((options) => {
        listCommand(options);
    });

// Delete command
program
    .command('delete <id>')
    .alias('remove')
    .alias('rm')
    .description('Delete a task by ID')
    .action((id) => {
        deleteCommand(id);
    });

// Complete command
program
    .command('done <id>')
    .alias('complete')
    .alias('finish')
    .description('Mark a task as complete')
    .action((id) => {
        completeCommand(id);
    });

// Uncomplete command
program
    .command('undone <id>')
    .alias('uncomplete')
    .alias('incomplete')
    .description('Mark a task as incomplete')
    .action((id) => {
        uncompleteCommand(id);
    });

// Update command
program
    .command('update <id> <description...>')
    .alias('edit')
    .description('Update task description')
    .action((id, description) => {
        updateCommand(id, description.join(' '));
    });

// Custom help
program.addHelpText('after', `
${chalk.bold('\nExample:')}
    ${chalk.gray('$')} todo add "Buy groceries at Indomaret"
    ${chalk.gray('$')} todo add "Fix bug" --priority high --due 2025-11-06 --tag work
    ${chalk.gray('$')} todo list
    ${chalk.gray('$')} todo list --completed
    ${chalk.gray('$')} todo list --priority high
    ${chalk.gray('$')} todo update 1234567890 "Buy groceries at Alfamidi"
    ${chalk.gray('$')} todo done   1234567890
    ${chalk.gray('$')} todo undone 1234567890
    ${chalk.gray('$')} todo delete 1234567890
`);

export function createCLI() {
    return program;
}