import { describe, it, expect } from 'vitest';
import { parser } from '../../src/utils/parser.js';
import { PRIORITY } from '../../src/config/constants.js';

describe('Parser', () => {
  describe('parseTaskInput', () => {
    it('should parse simple description', () => {
      const result = parser.parseTaskInput('Buy groceries');
      
      expect(result.description).toBe('Buy groceries');
      expect(result.priority).toBeNull();
      expect(result.dueDate).toBeNull();
      expect(result.tag).toBeNull();
    });

    it('should parse description with priority flag', () => {
      const result = parser.parseTaskInput('Fix bug --priority high');
      
      expect(result.description).toBe('Fix bug');
      expect(result.priority).toBe(PRIORITY.HIGH);
    });

    it('should parse description with due date flag', () => {
      const result = parser.parseTaskInput('Submit report --due 2025-12-15');
      
      expect(result.description).toBe('Submit report');
      expect(result.dueDate).toBe('2025-12-15');
    });

    it('should parse description with tag flag', () => {
      const result = parser.parseTaskInput('Code review --tag work');
      
      expect(result.description).toBe('Code review');
      expect(result.tag).toBe('work');
    });

    it('should parse description with all flags', () => {
      const result = parser.parseTaskInput(
        'Deploy app --priority high --due 2025-11-10 --tag devops'
      );
      
      expect(result.description).toBe('Deploy app');
      expect(result.priority).toBe(PRIORITY.HIGH);
      expect(result.dueDate).toBe('2025-11-10');
      expect(result.tag).toBe('devops');
    });

    it('should handle flags in any order', () => {
      const result = parser.parseTaskInput(
        'Write tests --tag testing --priority medium --due 2025-11-20'
      );
      
      expect(result.description).toBe('Write tests');
      expect(result.priority).toBe(PRIORITY.MEDIUM);
      expect(result.dueDate).toBe('2025-11-20');
      expect(result.tag).toBe('testing');
    });
  });

  describe('getCurrentDate', () => {
    it('should return current date in YYYY-MM-DD format', () => {
      const date = parser.getCurrentDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates on incomplete tasks', () => {
      const pastDate = '2020-01-01';
      expect(parser.isOverdue(pastDate, false)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = '2030-12-31';
      expect(parser.isOverdue(futureDate, false)).toBe(false);
    });

    it('should return false for completed tasks regardless of date', () => {
      const pastDate = '2020-01-01';
      expect(parser.isOverdue(pastDate, true)).toBe(false);
    });

    it('should return false when no due date', () => {
      expect(parser.isOverdue(null, false)).toBe(false);
    });
  });
});