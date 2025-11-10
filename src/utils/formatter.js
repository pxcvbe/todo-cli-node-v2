/**
 * @fileoverview Utility functions for formatting console output with colors and emojis.
 * @module utils/formatter
 * @description Provides formatting functions for displaying messages, tasks, and statistics in the CLI.
 */

import chalk from 'chalk';
import { PRIORITY_EMOJI, STATUS_EMOJI, EMOJI, PRIORITY, BAR } from '../config/constants.js';
import { parser } from './parser.js';

/**
 * Formatter object containing methods for formatting console output.
 * @namespace formatter
 */
export const formatter = {
    /**
     * Displays a success message with green color and success emoji.
     * @method success
     * @param {string} message - The success message to display.
     * @returns {void}
     */
    success(message) {
        console.log(chalk.green(`${EMOJI.SUCCESS} ${message}`));
    },

    /**
     * Displays an error message with red color and error emoji.
     * @method error
     * @param {string} message - The error message to display.
     * @returns {void}
     */
    error(message) {
        console.log(chalk.red(`${EMOJI.ERROR} ${message}`));
    },

    /**
     * Displays an info message with blue color and info emoji.
     * @method info
     * @param {string} message - The info message to display.
     * @returns {void}
     */
    info(message) {
        console.log(chalk.blue(`${EMOJI.INFO} ${message}`));
    },

    /**
     * Displays a warning message with yellow color and warning emoji.
     * @method warning
     * @param {string} message - The warning message to display.
     * @returns {void}
     */
    warning(message) {
        console.log(chalk.yellow(`${EMOJI.WARNING} ${message}`));
    },

    /**
     * Displays a header message with bold cyan color.
     * @method header
     * @param {string} message - The header message to display.
     * @returns {void}
     */
    header(message) {
        console.log(chalk.bold.cyan(`\n${message}\n`));
    },

    /**
     * Formats a priority level with emoji and color.
     * @method formatPriority
     * @param {string|null} priority - Priority level (high, medium, low). Defaults to medium if null/undefined.
     * @returns {string} Formatted priority string with emoji and color.
     */
    formatPriority(priority) {
        // Handle null/undefined by default to MEDIUM
        const normalizedPriority = priority || PRIORITY.MEDIUM;
        const emoji = PRIORITY_EMOJI[normalizedPriority] || PRIORITY_EMOJI[PRIORITY.MEDIUM];
        const color = normalizedPriority === PRIORITY.HIGH ? chalk.red :
                      normalizedPriority === PRIORITY.LOW ? chalk.green : chalk.yellow;
        return `${emoji} ${color(normalizedPriority.toUpperCase())}`;
    },

    /**
     * Formats a single task for display in a list.
     * @method formatTask
     * @param {Object} todo - The todo object to format.
     * @param {number} todo.id - Task ID.
     * @param {string} todo.description - Task description.
     * @param {boolean} todo.completed - Completion status.
     * @param {string} todo.priority - Priority level.
     * @param {string|null} [todo.dueDate] - Due date in YYYY-MM-DD format.
     * @param {string|null} [todo.tag] - Task tag.
     * @param {number|null} [index=null] - Optional index for numbered lists.
     * @returns {string} Formatted task string with colors and emojis.
     */
    formatTask(todo, index = null) {
        const status = todo.completed ? STATUS_EMOJI.COMPLETED : STATUS_EMOJI.PENDING;
        const priority = todo.priority || PRIORITY.MEDIUM;
        const priorityEmoji = PRIORITY_EMOJI[priority];

        const descColor = todo.completed ? chalk.gray : chalk.white;
        const taskNumber = index !== null ? chalk.gray(`${index + 1}.`) : '';

        let taskLine = `${taskNumber} [${chalk.cyan(status)}] ${priorityEmoji} ${descColor(todo.description)}`;

        // Add due date
        if (todo.dueDate) {
            const isOverdue = parser.isOverdue(todo.dueDate, todo.completed);
            const dueDateEmoji = isOverdue ? EMOJI.WARNING : EMOJI.CALENDAR;
            const dateColor = isOverdue ? chalk.red : chalk.blue;
            taskLine += ` ${dueDateEmoji} ${dateColor(todo.dueDate)}`;
        }

        // Add tag
        if (todo.tag) {
            taskLine += ` ${EMOJI.TAG} ${chalk.magenta(todo.tag)}`;
        }

        taskLine += chalk.gray(` (ID: ${todo.id})`);

        return taskLine;
    },

    /**
     * Displays detailed information about a task.
     * @method formatTaskDetail
     * @param {Object} todo - The todo object to display.
     * @param {number} todo.id - Task ID.
     * @param {string} todo.description - Task description.
     * @param {boolean} todo.completed - Completion status.
     * @param {string} todo.priority - Priority level.
     * @param {string|null} [todo.dueDate] - Due date in YYYY-MM-DD format.
     * @param {string|null} [todo.tag] - Task tag.
     * @param {string} [todo.createdAt] - Creation timestamp.
     * @param {string} [todo.completedAt] - Completion timestamp.
     * @returns {void}
     */
    formatTaskDetail(todo) {
        console.log(chalk.bold('\n[-] Task Details:'));
        console.log(chalk.gray('-'.repeat(50)));
        console.log(`${chalk.cyan('ID:')}          ${todo.id}`);
        console.log(`${chalk.cyan('Description:')} ${todo.description}`);
        console.log(`${chalk.cyan('Status:')}      ${todo.completed ? chalk.green('✓ Completed') : chalk.yellow('○ Pending')}`);
        console.log(`${chalk.cyan('Priority:')}    ${this.formatPriority(todo.priority || PRIORITY.MEDIUM)}`);

        if (todo.dueDate) {
            const isOverdue = parser.isOverdue(todo.dueDate, todo.completed);
            console.log(`${chalk.cyan('Due Date:')}     ${isOverdue ? chalk.red(todo.dueDate + '(OVERDUE)') : chalk.blue(todo.dueDate)}`);
        }

        if (todo.tag) {
            console.log(`${chalk.cyan('Tag:')}      ${EMOJI.TAG} ${chalk.magenta(todo.tag)}`);
        }

        if (todo.createdAt) {
            console.log(`${chalk.cyan('Created:')}      ${chalk.gray(new Date(todo.createdAt).toDateString())}`);
        }

        if (todo.completedAt) {
            console.log(`${chalk.cyan('Completed:')}    ${chalk.gray(new Date(todo.completedAt).toDateString())}`);
        }

        console.log(chalk.gray('-'.repeat(50)));
    },

    /**
     * Formats a progress bar as a string.
     * @method formatProgressBar
     * @param {number} percentage - Completion percentage (0-100).
     * @returns {string} Formatted progress bar string.
     */
    formatProgressBar(percentage) {
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const emptyLength = barLength - filledLength;

        const filled = chalk.green(BAR.FILLED.repeat(filledLength));
        const empty = chalk.green(BAR.EMPTY.repeat(emptyLength));

        return `[${filled}${empty}] ${chalk.bold.cyan(percentage + '%')}`;
    },

    /**
     * Displays task statistics in a formatted box.
     * @method formatStats
     * @param {Object} stats - Statistics object.
     * @param {number} stats.total - Total number of tasks.
     * @param {number} stats.completed - Number of completed tasks.
     * @param {number} stats.pending - Number of pending tasks.
     * @param {number} stats.percentage - Completion percentage.
     * @returns {void}
     */
    formatStats(stats) {
        console.log(chalk.bold.cyan('\n📊 Task Statistics\n'));
        console.log(chalk.gray('┌' + '─'.repeat(26) + '┐'));
        console.log(chalk.gray('│') + ` ${EMOJI.CLIPBOARD} Total Tasks:    ${chalk.bold(stats.total)}`.padEnd(27) + chalk.gray('     │'));
        console.log(chalk.gray('│') + ` ${EMOJI.SUCCESS} Completed:      ${chalk.green.bold(stats.completed)}`.padEnd(27 + 10) + chalk.gray('     │'));
        console.log(chalk.gray('│') + ` ⏳ Pending:        ${chalk.yellow.bold(stats.pending)}`.padEnd(27 + 10) + chalk.gray('     │'));
        console.log(chalk.gray('│') + ` 📈 Progress:       ${chalk.cyan.bold(stats.percentage + '%')}`.padEnd(27 + 10) + chalk.gray('    │'));
        console.log(chalk.gray('└' + '─'.repeat(26) + '┘'));

        console.log(`\n${this.formatProgressBar(stats.percentage)}\n`)
    },

    /**
     * Displays a horizontal divider line.
     * @method divider
     * @returns {void}
     */
    divider() {
        console.log(chalk.gray('-'.repeat(60)));
    },

    /**
     * Displays an empty line.
     * @method emptyLine
     * @returns {void}
     */
    emptyLine() {
        console.log();
    },
}