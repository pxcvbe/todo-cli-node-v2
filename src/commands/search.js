/**
 * @fileoverview Command handler for searching tasks.
 * @module commands/search
 * @description Handles the 'search' command to find tasks by keyword in description or tag.
 */

import chalk from 'chalk';
import todoService from '../services/todoService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

/**
 * Searches for tasks matching a keyword.
 * @async
 * @function searchCommand
 * @param {string} keyword - The search keyword to match against task descriptions and tags.
 * @returns {Promise<void>}
 * @throws {ValidationError} If validation fails.
 * @example
 * searchCommand("groceries");
 */
export async function searchCommand(keyword) {
    try {
        const validKeyword = validator.validateKeyword(keyword);
        const results = todoService.search(validKeyword);

        if (results.length === 0) {
            formatter.info(`No tasks found matching "${chalk.bold(keyword)}"`);
            console.log(chalk.gray('Try a different keyword or use "todo list" to see all tasks'));
            return;
        }

        formatter.header(`${EMOJI.SEARCH} Found ${chalk.bold(results.length)} task(s) matching "${chalk.bold(keyword)}"`);

        results.forEach((todo, index) => {
            console.log(formatter.formatTask(todo, index));
        });

        formatter.emptyLine();

    } catch (error) {
        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo search <keyword>'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}