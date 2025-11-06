import { PRIORITY, VALIDATION } from "../config/constants.js";

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validator = {
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

    validatePriority(priority) {
        if (!priority) return PRIORITY.MEDIUM;

        const normalized = priority.toLowerCase();
        const validPriorities = Object.values(PRIORITY);

        if (!validPriorities.includes(normalized)) {
            throw new ValidationError(`Invalid priority! Must be one of: ${validPriorities.join(', ')}`);
        }

        return normalized;
    },

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

    validateTag(tag) {
        if (!tag) return null;

        const trimmed = tag.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            throw new ValidationError('Tag must contain only letters, numbers, hyphens, or underscores');
        }

        return trimmed;
    },

    validateKeyword(keyword) {
        if (!keyword || keyword.trim() === '') {
            throw new ValidationError('Search keyword cannot be empty');
        }

        return keyword.trim();
    },

    validateFilename(filename) {
        if (!filename || filename.trim() === '') {
            throw new ValidationError('Filename cannot be empty');
        }

        return filename.trim();
    }
};