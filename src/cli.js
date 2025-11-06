import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';

const program = new Command();

program
  .name('todo')
  .description(chalk.cyan('📋 Simple and powerful CLI Todo List manager'))
  .version('2.0.0');

// Add command
program
  .command('add <description...>')
  .description('Add a new task')
  .action((description) => {
    addCommand(description.join(' '));
  });

// List command
program
  .command('list')
  .description('Show all tasks')
  .option('-c, --completed', 'Show only completed tasks')
  .option('-p, --pending', 'Show only pending tasks')
  .option('--priority <level>', 'Filter by priority (high, medium, low)')
  .option('--tag <name>', 'Filter by tag')
  .action((options) => {
    listCommand(options);
  });

// Custom help
program.addHelpText('after', `
${chalk.bold('\nExamples:')}
  ${chalk.gray('$')} todo add "Buy groceries"
  ${chalk.gray('$')} todo add "Fix bug" --priority high --due 2025-11-10 --tag work
  ${chalk.gray('$')} todo list
  ${chalk.gray('$')} todo list --completed
  ${chalk.gray('$')} todo list --priority high
  ${chalk.gray('$')} todo search "bug"
  ${chalk.gray('$')} todo done 1234567890
  ${chalk.gray('$')} todo update 1234567890 "Buy groceries at Indomaret"
  ${chalk.gray('$')} todo stats
  ${chalk.gray('$')} todo delete 1234567890
  ${chalk.gray('$')} todo export
  ${chalk.gray('$')} todo import todos-export-2025-11-04.json

${chalk.bold('\nVisual Indicators:')}
  Priority: ${chalk.red('🔴')} High | ${chalk.yellow('🟡')} Medium | ${chalk.green('🟢')} Low
  Status: ${chalk.cyan('✓')} Completed | ${chalk.gray('○')} Pending
  Due Date: ${chalk.blue('📅')} Normal | ${chalk.red('⚠️')} Overdue
  Tag: ${chalk.magenta('🏷️')} Category label
`);

export function createCLI() {
  return program;
}