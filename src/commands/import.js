import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import todoService from '../services/todoService.js';
import storageService from '../services/storageService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importCommand(filename) {
    const spinner = ora('Importing tasks...').start();

    try {
        const validFilename = validator.validateFilename(filename);
        const importPath = path.join(__dirname, '../../', validFilename);

        if (!storageService.fileExists(importPath)) {
            throw new Error(`File "${validFilename}" not found!\n  Make sure the file is in the project directory.`);
        }

        const importedTodos = storageService.readFile(importPath);
        const result = todoService.import(importedTodos);

        spinner.succeed(chalk.green(` ${EMOJI.IMPORT} Tasks imported successfully!`));
        console.log(chalk.cyan('Imported:') + ` ${chalk.bold(result.imported)} tasks`);
        console.log(chalk.cyan('Total now:') + ` ${chalk.bold(result.total)} tasks`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red('Failed to import tasks'));

        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo import <filename>'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}