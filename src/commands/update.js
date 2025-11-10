/**
 * @fileoverview Command handler for updating tasks.
 * @module commands/update
 * @description Handles the 'update' command to modify task descriptions.
 */

import chalk from 'chalk';
import ora from 'ora';
import todoService from '../services/todoService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

/**
 * Updates a task's description.
 * @async
 * @function updateCommand
 * @param {string|number} taskId - The ID of the task to update.
 * @param {string} newDescription - The new description for the task.
 * @returns {Promise<void>}
 * @throws {ValidationError} If validation fails.
 * @throws {Error} If the task is not found.
 * @example
 * updateCommand(1234567890, "Updated task description");
 */
export async function updateCommand(taskId, newDescription) {
    const spinner = ora('Updating task...').start();

    try {
        const id = validator.validateId(taskId);
        const description = validator.validateDescription(newDescription);

        const { old, updated } = todoService.update(id, { description });

        spinner.succeed(chalk.green(' Task updated successfully!'));
        console.log(chalk.cyan('Old:') + ` ${chalk.strikethrough(old.description)}`);
        console.log(chalk.cyan('New:') + ` ${chalk.bold(updated.description)}`);
    } catch (error) {
        spinner.fail(chalk.red(' Failed to update task'));

        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo update <id> <new description>'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}