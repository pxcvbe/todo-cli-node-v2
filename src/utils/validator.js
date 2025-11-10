/**
 * @fileoverview Validation utilities and error class for input validation.
 * @module utils/validator
 * @description Provides validation functions for todos, dates, priorities, and other inputs.
 */

import { PRIORITY, VALIDATION } from "../config/constants.js";

/**
 * Custom error class for validation errors.
 * @class ValidationError
 * @extends Error
 * @description Represents errors that occur during input validation.
 */
export class ValidationError extends Error {
    /**
     * Creates a new ValidationError instance.
     * @param {string} message - Error message.
     * @constructor
     */
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Validator object containing methods for validating various inputs.
 * @namespace validator
 */
export const validator = {
    /**
     * Validates and parses a task ID.
     * @method validateId
     * @param {string|number} id - The ID to validate.
     * @returns {number} Parsed numeric ID.
     * @throws {ValidationError} If the ID is missing or invalid.
     */
    validateId(id) {
        if (!id) {
            throw new ValidationError('Task ID is required');
        }

        const numId = parseInt(id);
        if (isNaN(numId)) {
            throw new ValidationError('Invalid task ID! ID must be a number');
        }

        return numId;
    },

    /**
     * Validates a task description.
     * @method validateDescription
     * @param {string} description - The description to validate.
     * @returns {string} Trimmed and validated description.
     * @throws {ValidationError} If the description is empty, too short, or too long.
     */
    validateDescription(description) {
        if (!description || description.trim() === '') {
            throw new ValidationError('Task description cannot be empty');
        }

        const trimmed = description.trim();

        if (trimmed.length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
            throw new ValidationError('Task description is too short');
        }

        if (trimmed.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
            throw new ValidationError(`Task description is too long (max: ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters)`);
        }

        return trimmed;
    },

    /**
     * Validates a priority level.
     * @method validatePriority
     * @param {string|null} priority - The priority to validate.
     * @returns {string} Validated priority level (defaults to MEDIUM if null).
     * @throws {ValidationError} If the priority is invalid.
     */
    validatePriority(priority) {
        if (!priority) return PRIORITY.MEDIUM;

        const normalized = priority.toLowerCase();
        const validPriorities = Object.values(PRIORITY);

        if (!validPriorities.includes(normalized)) {
            throw new ValidationError(`Invalid priority! Must be one of: ${validPriorities.join(', ')}`);
        }

        return normalized;
    },

    /**
     * Validates a date string in YYYY-MM-DD format.
     * @method validateDate
     * @param {string|null} dateString - The date string to validate.
     * @returns {string|null} Validated date string or null.
     * @throws {ValidationError} If the date format or value is invalid.
     */
    validateDate(dateString) {
        if (!dateString) return null;

        if (!VALIDATION.DATE_REGEX.test(dateString)) {
            throw new ValidationError('Invalid date format! Use YYYY-MM-DD');
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new ValidationError('Invalid date value');
        }

        return dateString;
    },

    /**
     * Validates a tag name.
     * @method validateTag
     * @param {string|null} tag - The tag to validate.
     * @returns {string|null} Validated and normalized tag (lowercase) or null.
     * @throws {ValidationError} If the tag contains invalid characters.
     */
    validateTag(tag) {
        if (!tag) return null;

        const trimmed = tag.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            throw new ValidationError('Tag must contain only letters, numbers, hyphens, or underscores');
        }

        return trimmed;
    },

    /**
     * Validates a search keyword.
     * @method validateKeyword
     * @param {string} keyword - The keyword to validate.
     * @returns {string} Trimmed and validated keyword.
     * @throws {ValidationError} If the keyword is empty.
     */
    validateKeyword(keyword) {
        if (!keyword || keyword.trim() === '') {
            throw new ValidationError('Search keyword cannot be empty');
        }

        return keyword.trim();
    },

    /**
     * Validates a filename.
     * @method validateFilename
     * @param {string} filename - The filename to validate.
     * @returns {string} Trimmed and validated filename.
     * @throws {ValidationError} If the filename is empty.
     */
    validateFilename(filename) {
        if (!filename || filename.trim() === '') {
            throw new ValidationError('Filename cannot be empty');
        }

        return filename.trim();
    }
};