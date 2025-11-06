import { validator } from "./validator.js";

export const parser = {
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

    parseDateToISO(date) {
        return date ? new Date(date).toISOString() : null;
    },

    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },

    isOverdue(dueDate, completed) {
        if (!dueDate || completed) return false;
        return dueDate < this.getCurrentDate();
    }
};