import chalk from 'chalk';
import todoService from '../services/todoService.js';
import { formatter } from '../utils/formatter.js';

export function statsCommand() {
    try {
        const stats = todoService.getStats();

        formatter.formatStats(stats);

        // Show motivational message
        console.log(chalk.bold.green(stats.motivationalMessage));
        formatter.emptyLine();
        
    } catch (error) {
        formatter.error(error.message);
        process.exit(1);
    }
}