import { describe, it, expect } from "vitest";
import { validator, ValidationError } from '../../src/utils/validator.js';
import { PRIORITY } from "../../src/config/constants.js";

describe('Validator', () => {

    describe('validateId', () => {
        it('should validate valid numeric ID', () => {
            expect(validator.validateId('123')).toBe(123);
            expect(validator.validateId('456')).toBe(456);
        });

        it('should throw error for missing ID', () => {
            expect(() => validator.validateId()).toThrow(ValidationError);
            expect(() => validator.validateId()).toThrow('Task ID is required');
        });

        it('should throw error for non-numeric ID', () => {
            expect(() => validator.validateId('abc')).toThrow(ValidationError);
            expect(() => validator.validateId('abc')).toThrow('Invalid task ID');
        });
    });

    describe('validateDescription', () => {
        it('should validate and trim valid description', () => {
            expect(validator.validateDescription('  Buy groceries  ')).toBe('Buy groceries');
            expect(validator.validateDescription('Valid task')).toBe('Valid task');
        });

        it('should throw error for empty description', () => {
            expect(() => validator.validateDescription('')).toThrow(ValidationError);
            expect(() => validator.validateDescription('   ')).toThrow('cannot be empty');
        });

        it('should throw error for too long description', () => {
            const longText = 'a'.repeat(501);
            expect(() => validator.validateDescription(longText)).toThrow('too long');
        });
    });

    describe('validatePriority', () => {
        it('should validate valid priorities', () => {
            expect(validator.validatePriority('high')).toBe(PRIORITY.HIGH);
            expect(validator.validatePriority('MEDIUM')).toBe(PRIORITY.MEDIUM);
            expect(validator.validatePriority('Low')).toBe(PRIORITY.LOW);
        });

        it('should return default priority when not provided', () => {
            expect(validator.validatePriority()).toBe(PRIORITY.MEDIUM);
            expect(validator.validatePriority(null)).toBe(PRIORITY.MEDIUM);
        });

        it('should throw error for invalid priority', () => {
            expect(() => validator.validatePriority('urgent')).toThrow(ValidationError);
            expect(() => validator.validatePriority('invalid')).toThrow('Invalid priority');
        });
    });

    describe('validateDate', () => {
        it('should validate valid date format', () => {
            expect(validator.validateDate('2025-11-04')).toBe('2025-11-04');
            expect(validator.validateDate('2024-12-31')).toBe('2024-12-31');
        });

        it('should return null when not provided', () => {
            expect(validator.validateDate()).toBeNull();
            expect(validator.validateDate(null)).toBeNull();
        });

        it('should throw error for invalid date format', () => {
            expect(() => validator.validateDate('2025/11/04')).toThrow('Invalid date format! Use YYYY-MM-DD');
            expect(() => validator.validateDate('04-11-2025')).toThrow('Invalid date format! Use YYYY-MM-DD');
        });

        it('should throw error for invalid date value', () => {
            expect(() => validator.validateDate('2025-13-01')).toThrow('Invalid date value');
            expect(() => validator.validateDate('2025-99-99')).toThrow('Invalid date value');
        });
    });

    describe('validateTag', () => {
        it('should validate and normalize valid tags', () => {
            expect(validator.validateTag('work')).toBe('work');
            expect(validator.validateTag('PERSONAL')).toBe('personal');
            expect(validator.validateTag('bug-fix')).toBe('bug-fix');
        });

        it('should return null when not provided', () => {
            expect(validator.validateTag()).toBeNull();
            expect(validator.validateTag(null)).toBeNull();
        });

        it('should throw error for invalid tag characters', () => {
            expect(() => validator.validateTag('work space')).toThrow('only letters, numbers');
            expect(() => validator.validateTag('tag@work')).toThrow('only letters, numbers');
        });
    });

    describe('validateKeyword', () => {
        it('should validate and trim keyword', () => {
            expect(validator.validateKeyword('  search term  ')).toBe('search term');
            expect(validator.validateKeyword('bug')).toBe('bug');
        });

        it('should throw error for empty keyword', () => {
            expect(() => validator.validateKeyword('')).toThrow('cannot be empty');
            expect(() => validator.validateKeyword('   ')).toThrow('cannot be empty');
        });
    });

    describe('validateFilename', () => {
        it('should validate and trim filename', () => {
            expect(validator.validateFilename('  todos.json  ')).toBe('todos.json');
            expect(validator.validateFilename('export-2025.json')).toBe('export-2025.json');
        });

        it('should throw error for empty filename', () => {
            expect(() => validator.validateFilename('')).toThrow('cannot be empty');
            expect(() => validator.validateFilename('   ')).toThrow('cannot be empty');
        });
    });
});