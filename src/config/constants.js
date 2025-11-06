import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_FILE = path.join(__dirname, '../../todos.json');

export const PRIORITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

export const PRIORITY_EMOJI = {
    [PRIORITY.HIGH]: '🔴',
    [PRIORITY.MEDIUM]: '🟡',
    [PRIORITY.LOW]: '🟢',
};

export const STATUS_EMOJI = {
    COMPLETED: '✓',
    PENDING: '○'
};

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

export const BAR = {
    FILLED: '█',
    EMPTY: '░'
};

export const DATE_FORMAT = {
    ISO: 'YYYY-MM-DD'
};

export const VALIDATION = {
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_DESCRIPTION_LENGTH: 1,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/
};