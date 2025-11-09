/**
 * @fileoverview Command handlers for marking tasks as complete or incomplete.
 * @module commands/complete
 * @description Handles the 'done' and 'undone' commands to toggle task completion status.
 */

import chalk from 'chalk';
import ora from 'ora';
import todoService from '../services/todoService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

/**
 * Marks a task as completed.
 * @async
 * @function completeCommand
 * @param {string|number} taskId - The ID of the task to mark as complete.
 * @returns {Promise<void>}
 * @throws {ValidationError} If validation fails.
 * @throws {Error} If the task is not found or already completed.
 * @example
 * completeCommand(1234567890);
 */
export async function completeCommand(taskId) {
    const spinner = ora('Marking task as complete...').start();

    try {
        const id  = validator.validateId(taskId);
        const  { updated } = todoService.complete(id);

        spinner.succeed(chalk.green(' Task marked as complete!'));
        console.log(`${EMOJI.SUCCESS} ${chalk.green(updated.description)}`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red('Failed to complete task'));

        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo done <id>'));
        } else if (error.message.includes('already completed')) {
            formatter.info(error.message);
            const todo = todoService.getById(validator.validateId(taskId));
            console.log(chalk.gray('Task: ') + chalk.green(todo.description));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}

/**
 * Marks a task as incomplete.
 * @async
 * @function uncompleteCommand
 * @param {string|number} taskId - The ID of the task to mark as incomplete.
 * @returns {Promise<void>}
 * @throws {ValidationError} If validation fails.
 * @throws {Error} If the task is not found or not completed.
 * @example
 * uncompleteCommand(1234567890);
 */
export async function uncompleteCommand(taskId) {
    const spinner = ora('Marking task as incomplete...').start();

    try {
        const id  = validator.validateId(taskId);
        const  { updated } = todoService.uncomplete(id);

        spinner.succeed(chalk.yellow('Task marked as incomplete!'));
        console.log(`${EMOJI.RECYCLE} ${updated.description}`);
        formatter.emptyLine();
    } catch (error) {
        spinner.fail(chalk.red('Failed to mark task as incomplete'));

        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo undone <id>'));
        } else if (error.message.includes('not completed yet')) {
            formatter.info(error.message);
            const todo = todoService.getById(validator.validateId(taskId));
            console.log(chalk.gray('Task: ') + todo.description);
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}