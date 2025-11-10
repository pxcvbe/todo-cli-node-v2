/**
 * @fileoverview Command handler for displaying task statistics.
 * @module commands/stats
 * @description Handles the 'stats' command to show task statistics and progress.
 */

import chalk from 'chalk';
import todoService from '../services/todoService.js';
import { formatter } from '../utils/formatter.js';

/**
 * Displays task statistics including total, completed, pending tasks, and progress.
 * @function statsCommand
 * @returns {void}
 * @example
 * statsCommand();
 */
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