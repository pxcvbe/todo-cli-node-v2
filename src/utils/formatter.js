import chalk from 'chalk';
import { PRIORITY_EMOJI, STATUS_EMOJI, EMOJI, PRIORITY, BAR } from '../config/constants.js';
import { parser } from './parser.js';

export const formatter = {
    success(message) {
        console.log(chalk.green(`${EMOJI.SUCCESS} ${message}`));
    },

    error(message) {
        console.log(chalk.red(`${EMOJI.ERROR} ${message}`));
    },

    info(message) {
        console.log(chalk.blue(`${EMOJI.INFO} ${message}`));
    },

    warning(message) {
        console.log(chalk.yellow(`${EMOJI.WARNING} ${message}`));
    },

    header(message) {
        console.log(chalk.bold.cyan(`\n${message}\n`));
    },

    formatPriority(priority) {
        // Handle null/undefined by default to MEDIUM
        const normalizedPriority = priority || PRIORITY.MEDIUM;
        const emoji = PRIORITY_EMOJI[normalizedPriority] || PRIORITY_EMOJI[PRIORITY.MEDIUM];
        const color = normalizedPriority === PRIORITY.HIGH ? chalk.red :
                      normalizedPriority === PRIORITY.LOW ? chalk.green : chalk.yellow;
        return `${emoji} ${color(normalizedPriority.toUpperCase())}`;
    },

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

    formatProgressBar(percentage) {
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const emptyLength = barLength - filledLength;

        const filled = chalk.green(BAR.FILLED.repeat(filledLength));
        const empty = chalk.green(BAR.EMPTY.repeat(emptyLength));

        return `[${filled}${empty}] ${chalk.bold.cyan(percentage + '%')}`;
    },

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

    divider() {
        console.log(chalk.gray('-'.repeat(60)));
    },

    emptyLine() {
        console.log();
    },
}