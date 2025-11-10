/**
 * @fileoverview Command handler for exporting tasks to a JSON file.
 * @module commands/export
 * @description Handles the 'export' command to save all tasks to a JSON file.
 */

import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import todoService from '../services/todoService.js';
import storageService from '../services/storageService.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exports all tasks to a JSON file with a timestamp in the filename.
 * @async
 * @function exportCommand
 * @returns {Promise<void>}
 * @throws {Error} If the export operation fails.
 * @example
 * exportCommand(); // Exports to todos-export-2025-11-07.json
 */
export async function exportCommand() {
    const spinner = ora('Exporting tasks...').start();

    try {
        const todos = todoService.export();

        if (todos.length === 0) {
            spinner.info(chalk.blue(' No tasks to export!'));
            return;
        }

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `todos-export-${timestamp}.json`;
        const exportPath = path.join(__dirname, '../../', filename);

        storageService.writeFile(exportPath, todos);

        spinner.succeed(chalk.green(` ${EMOJI.EXPORT} Task exported successfully`));
        console.log(chalk.cyan('File:') + ` ${filename}`);
        console.log(chalk.cyan('Location:') + ` ${exportPath}`);
        console.log(chalk.cyan('Total tasks:') + ` ${chalk.bold(todos.length)}`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red(' Failed to export tasks'));
        formatter.error(error.message);
        process.exit(1);
    }
}