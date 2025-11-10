/**
 * @fileoverview CLI setup and command registration for the Todo application.
 * @module cli
 * @description Configures all CLI commands, options, and help text using Commander.js.
 */

import { Command } from "commander";
import chalk from "chalk";
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from "./commands/update.js";
import { deleteCommand } from "./commands/delete.js";
import { completeCommand, uncompleteCommand } from "./commands/complete.js";
import { searchCommand } from "./commands/search.js";
import { clearCommand } from "./commands/clear.js";
import { statsCommand } from "./commands/stats.js";
import { exportCommand } from "./commands/export.js";
import { importCommand } from "./commands/import.js";

/**
 * Commander.js program instance for the Todo CLI.
 * @type {Command}
 */
const program = new Command();

program
    .name('todos')
    .description(chalk.cyan('[-] Simple and powerful CLI Todo List manager'))
    .version('2.0.0');

// Add command
program
    .command('add <description...>')
    .description('Add a new task')
    .option('-p, --priority <level>', 'Set task priority (high, medium, low)')
    .option('-d, --due <date>', 'Set due date (YYYY-MM-DD)')
    .option('-t --tag <name>', 'Set task tag')
    .action((description, options) => {
        addCommand(description.join(' '), options);
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

// Search command
program
    .command('search <keyword...>')
    .alias('find')
    .description('Search tasks by keyword')
    .action((keyword) => {
        searchCommand(keyword.join(' '));
    });

// Stats command
program
    .command('stats')
    .alias('statistics')
    .alias('status')
    .description('Show task statistics')
    .action(() => {
        statsCommand();
    });

// Clear command
program
    .command('clear')
    .alias('clean')
    .description('Delete all completed tasks')
    .action(() => {
        clearCommand();
    });

// Export command
program
    .command('export')
    .description('Export tasks to JSON file')
    .action(() => {
        exportCommand();
    });

// Import command
program
    .command('import <filename>')
    .description('Import tasks from JSON file')
    .action((filename) => {
        importCommand(filename);
    });

// Custom help
program.addHelpText('after', `
${chalk.bold('\nExample:')}
    ${chalk.gray('$')} todo add "Buy groceries at Indomaret"
    ${chalk.gray('$')} todo add "Fix bug" --priority high --due 2025-11-06 --tag work
    ${chalk.gray('$')} todo list
    ${chalk.gray('$')} todo list --completed
    ${chalk.gray('$')} todo list --priority high
    ${chalk.gray('$')} todo stats
    ${chalk.gray('$')} todo search "bug"
    ${chalk.gray('$')} todo update 1234567890 "Buy groceries at Alfamidi"
    ${chalk.gray('$')} todo done   1234567890
    ${chalk.gray('$')} todo undone 1234567890
    ${chalk.gray('$')} todo delete 1234567890
    ${chalk.gray('$')} todo clear
    ${chalk.gray('$')} todo export
    ${chalk.gray('$')} todo import todos-export-2025-11-07.json

${chalk.bold('\nVisual Indicators:')}
    Priority: ${chalk.red('🔴')} High | ${chalk.yellow('🟡')} Medium | ${chalk.green('🟢')} Low
    Status: ${chalk.cyan('✓')} Completed | ${chalk.gray('○')} Pending
    Due Date: ${chalk.blue('📅')} Normal | ${chalk.red('⚠️')} Overdue
    Tag: ${chalk.magenta('🏷️')} Category label
`);

/**
 * Creates and configures the CLI program with all commands and options.
 * @function createCLI
 * @returns {Command} The configured Commander.js program instance.
 * @description Sets up the main CLI program with name, description, version, and all subcommands.
 * @example
 * const program = createCLI();
 * program.parse(process.argv);
 */
export function createCLI() {
    return program;
}