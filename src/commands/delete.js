/**
 * @fileoverview Command handler for deleting tasks.
 * @module commands/delete
 * @description Handles the 'delete' command to remove tasks from the list.
 */

import chalk from 'chalk';
import ora from 'ora';
import todoService from '../services/todoService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

/**
 * Deletes a task by ID.
 * @async
 * @function deleteCommand
 * @param {string|number} taskId - The ID of the task to delete.
 * @returns {Promise<void>}
 * @throws {ValidationError} If validation fails.
 * @throws {Error} If the task is not found.
 * @example
 * deleteCommand(1234567890);
 */
export async function deleteCommand(taskId) {
    const spinner = ora('Deleting task...').start();

    try {
        const id = validator.validateId(taskId);
        const deletedTask = todoService.delete(id);

        spinner.succeed(chalk.green(' Task deleted successfully!'));
        console.log(`${EMOJI.TRASH} Deleted: ${chalk.strikethrough(deletedTask.description)}`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red(' Failed to delete task'));
        
        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo delete <id>'));
            console.log(chalk.gray('Tip: Use "todo list" to see all task IDs'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}