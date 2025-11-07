import chalk from "chalk";
import ora from "ora";
import todoService from "../services/todoService.js";
import { parser } from "../utils/parser.js";
import { formatter } from "../utils/formatter.js";
import { ValidationError, validator } from "../utils/validator.js";
import { EMOJI } from "../config/constants.js";

export async function addCommand(description, options = {}) {
    const spinner = ora('Adding task...').start();

    try {
        // Parse input - use options from Commander.js if available, otherwise parse from description
        let parsed;
        if (options.priority || options.due || options.tag) {
            // Use Commander.js options
            parsed = {
                description: description.trim(),
                priority: options.priority || null,
                dueDate: options.due || null,
                tag: options.tag || null
            };

            // Validate inputs
            parsed.description = validator.validateDescription(parsed.description);
            if (parsed.priority) {
                parsed.priority = validator.validatePriority(parsed.priority);
            }
            if (parsed.dueDate) {
                parsed.dueDate = validator.validateDate(parsed.dueDate);
            }
            if (parsed.tag) {
                parsed.tag = validator.validateTag(parsed.tag);
            }
        } else {
            // Fallback to regex parsing for backward compability
            parsed = parser.parseTaskInput(description);
        }

        // Create task
        const newTodo = todoService.create(parsed);

        spinner.succeed(chalk.green(' Task added successfully!'));

        // Display task details
        console.log(chalk.cyan('ID:') + ` ${newTodo.id}`);
        console.log(chalk.cyan('Task:') + ` ${newTodo.description}`);
        console.log(chalk.cyan('Priority:') + ` ${formatter.formatPriority(newTodo.priority)}`);

        if (newTodo.dueDate) {
            console.log(chalk.cyan('Due Date:') + ` ${EMOJI.CALENDAR} ${chalk.blue(newTodo.dueDate)}`);
        }

        if (newTodo.tag) {
            console.log(chalk.cyan('Tag:') + ` ${EMOJI.TAG} ${chalk.magenta(newTodo.tag)}`);
        }

        formatter.emptyLine();

    } catch (error) {
        spinner.fail(chalk.red(' Failed to add task'));

        if (error instanceof ValidationError) {
            formatter.error(error.message);
            console.log(chalk.gray('Usage: todo add <description> [--priority high|medium|low] [--due YYYY-MM-DD] [--tag tagname'));
        } else {
            formatter.error(error.message);
        }

        process.exit(1);
    }
}