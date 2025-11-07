import chalk from 'chalk';
import ora from 'ora';
import todoService from '../services/todoService.js';
import { formatter } from '../utils/formatter.js';
import { EMOJI } from '../config/constants.js';

export async function clearCommand() {
    const spinner = ora('Clearing completed tasks...').start();

    try {
        const result = todoService.clearCompleted();

        if (result.cleared === 0) {
            spinner.info(chalk.blue(' No completed tasks to clear!'));
            return;
        }

        spinner.succeed(chalk.green(` ${EMOJI.CLEAN} Cleared ${chalk.bold(result.cleared)} completed task(s)`));
        console.log(`Remaining tasks: ${chalk.bold(result.remaining)}`);
        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red(' Failed to clear completed tasks'));
        formatter.error(error.message);
        process.exit(1);
    }
}