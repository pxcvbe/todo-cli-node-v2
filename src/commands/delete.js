import chalk from 'chalk';
import ora from 'ora';
import todoService from '../services/todoService.js';
import { validator, ValidationError } from '../utils/validator.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

export async function deleteCommand(taskId) {
    const spinner = ora('Deleting task...').start();

    try {
        const id = validator.validateId(taskId);
        const deletedTask = todoService.delete(id);

        spinner.succeed(chalk.green('Task deleted successfully!'));
        console.log(chalk.gray('    ') + `${EMOJI.TRASH} Deleted: ${chalk.strikethrough(deletedTask.description)}`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red('Failed to delete task'));
        
        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('    Usage: todo delete <id>'));
            console.log(chalk.gray('    Tip: Use "todo list" to see all task IDs'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}