/**
 * @fileoverview Application constants and configuration values.
 * @module config/constants
 * @description Contains all constant values used throughout the application including file paths, priorities, emojis, messages, and validation rules.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Path to the JSON file where todos are stored.
 * @type {string}
 * @constant
 */
export const DATA_FILE = path.join(__dirname, '../../todos.json');

/**
 * Task priority levels.
 * @type {Object<string, string>}
 * @constant
 * @property {string} HIGH - High priority level.
 * @property {string} MEDIUM - Medium priority level (default).
 * @property {string} LOW - Low priority level.
 */
export const PRIORITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

/**
 * Emoji mappings for priority levels.
 * @type {Object<string, string>}
 * @constant
 */
export const PRIORITY_EMOJI = {
    [PRIORITY.HIGH]: '🔴',
    [PRIORITY.MEDIUM]: '🟡',
    [PRIORITY.LOW]: '🟢',
};

/**
 * Emoji mappings for task status.
 * @type {Object<string, string>}
 * @constant
 * @property {string} COMPLETED - Emoji for completed tasks.
 * @property {string} PENDING - Emoji for pending tasks.
 */
export const STATUS_EMOJI = {
    COMPLETED: '✓',
    PENDING: '○'
};

/**
 * Collection of emojis used throughout the application.
 * @type {Object<string, string>}
 * @constant
 */
export const EMOJI = {
    SUCCESS: '✅',
    ERROR: '❌',
    INFO: 'ℹ️',
    WARNING: '⚠️',
    CALENDAR: '📅',
    TAG: '🏷️',
    TRASH: '🗑️',
    STATS: '📊',
    SEARCH: '🔍',
    EXPORT: '📤',
    IMPORT: '📥',
    CLEAN: '🧹',
    EDIT: '✏️',
    RECYCLE: '🔄',
    ROCKET: '🚀',
    PARTY: '🎉',
    MUSCLE: '💪',
    THUMBS: '👍',
    SPROUT: '🌱',
    BULB: '💡',
    CLIPBOARD: '📋'
};

/**
 * Application messages, including motivational messages.
 * @type {Object<string, Object<string, string>>}
 * @constant
 * @property {Object<string, string>} MOTIVATIONAL - Motivational messages based on completion percentage.
 */
export const MESSAGES = {
    MOTIVATIONAL: {
        PERFECT: '🎉 Amazing! All tasks completed!',
        GREAT: '💪 Great progress! Keep it up!',
        HALFWAY: "👍 You're halfway there!",
        GOOD: '🚀 Good start! Keep going!',
        START: '🌱 Every journey starts with a single step!',
        BEGIN: '💡 Time to start checking off those tasks!'
    }
};

/**
 * Progress bar characters.
 * @type {Object<string, string>}
 * @constant
 * @property {string} FILLED - Character for filled portion of progress bar.
 * @property {string} EMPTY - Character for empty portion of progress bar.
 */
export const BAR = {
    FILLED: '█',
    EMPTY: '░'
};

/**
 * Date format constants.
 * @type {Object<string, string>}
 * @constant
 * @property {string} ISO - ISO date format (YYYY-MM-DD).
 */
export const DATE_FORMAT = {
    ISO: 'YYYY-MM-DD'
};

/**
 * Validation rules and constraints.
 * @type {Object<string, number|RegExp>}
 * @constant
 * @property {number} MAX_DESCRIPTION_LENGTH - Maximum length for task descriptions.
 * @property {number} MIN_DESCRIPTION_LENGTH - Minimum length for task descriptions.
 * @property {RegExp} DATE_REGEX - Regular expression for validating date format (YYYY-MM-DD).
 */
export const VALIDATION = {
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_DESCRIPTION_LENGTH: 1,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/
};