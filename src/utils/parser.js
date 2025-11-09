/**
 * @fileoverview Utility functions for parsing and processing task input and dates.
 * @module utils/parser
 * @description Provides parsing functions for extracting task data from input strings and date operations.
 */

import { validator } from "./validator.js";

/**
 * @typedef {Object} ParsedTaskInput
 * @property {string} description - Cleaned task description.
 * @property {string|null} priority - Priority level (high, medium, low) or null.
 * @property {string|null} dueDate - Due date in YYYY-MM-DD format or null.
 * @property {string|null} tag - Tag name or null.
 */

/**
 * Parser object containing methods for parsing task input and dates.
 * @namespace parser
 */
export const parser = {
    /**
     * Parses task input string to extract description, priority, due date, and tag.
     * Supports flags: --priority, --due, --tag
     * @method parseTaskInput
     * @param {string} description - The input string containing task description and optional flags.
     * @returns {ParsedTaskInput} Object containing parsed task data.
     * @example
     * parseTaskInput("Buy groceries --priority high --due 2025-12-31 --tag shopping")
     * Returns: { description: "Buy groceries", priority: "high", dueDate: "2025-12-31", tag: "shopping" }
     */
    parseTaskInput(description) {
        let cleanDescription = description.trim();
        let priority = null;
        let dueDate = null;
        let tag = null;

        // Parse priority flag: --priority high|medium|low
        const priorityMatch = description.match(/--priority\s+(high|medium|low)/i);
        if (priorityMatch) {
            priority = validator.validatePriority(priorityMatch[1]);
            cleanDescription = cleanDescription.replace(/--priority\s+(high|medium|low)/i, '').trim();
        }

        // Parse due date flag: --due YYYY-MM-DD
        const dueDateMatch = description.match(/--due\s+(\d{4}-\d{2}-\d{2})/);
        if (dueDateMatch) {
            dueDate = validator.validateDate(dueDateMatch[1]);
            cleanDescription = cleanDescription.replace(/--due\s+\d{4}-\d{2}-\d{2}/, '').trim();
        }

        // Parse tag flag: --tag tagname
        const tagMatch = description.match(/--tag\s+(\w+)/i);
        if (tagMatch) {
            tag = validator.validateTag(tagMatch[1]);
            cleanDescription = cleanDescription.replace(/--tag\s+\w+/i, '').trim();
        }

        return {
            description: validator.validateDescription(cleanDescription),
            priority,
            dueDate,
            tag
        };
    },

    /**
     * Converts a date string to ISO format.
     * @method parseDateToISO
     * @param {string|null} date - Date string to convert, or null.
     * @returns {string|null} ISO formatted date string or null.
     */
    parseDateToISO(date) {
        return date ? new Date(date).toISOString() : null;
    },

    /**
     * Gets the current date in YYYY-MM-DD format.
     * @method getCurrentDate
     * @returns {string} Current date in YYYY-MM-DD format.
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Checks if a due date is overdue.
     * @method isOverdue
     * @param {string|null} dueDate - Due date in YYYY-MM-DD format.
     * @param {boolean} completed - Whether the task is completed.
     * @returns {boolean} True if the due date is overdue and the task is not completed, false otherwise.
     */
    isOverdue(dueDate, completed) {
        if (!dueDate || completed) return false;
        return dueDate < this.getCurrentDate();
    }
};