# Todo CLI Node.js v2.0 🔥

A **modern, feature-rich** command-line todo list manager built with ``Node.js``. Stay organized with **priorities**, **due dates**, **tags**, **search**, and ``more!``

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Jetbrains+Mono&size=14&pause=1000&color=0DBBAD&width=900&lines=Created+By%3A+Ivan.K+%7C+Version+v2.0)](https://git.io/typing-svg)

---

## ✨ What's New in v2.0

- 🏗️ **Modular Architecture** - Clean separation of concerns
- 🎨 **Beautiful UI** - Enhanced colors with Chalk
- ⚡ **Better Performance** - Optimized code structure
- 🧪 **Unit Tests** - Comprehensive test coverage with Vitest
- 🔄 **Loading Spinners** - Visual feedback with Ora
- 📦 **Modern Libraries** - Commander.js for argument parsing
- 🛡️ **Robust Validation** - Better error handling
- 🎯 **Type Safety** - Improved code quality

---

## ⬇️ Installation

```bash
# Clone repository
git clone https://github.com/pxcvbe/todo-cli-node.git
cd todo-cli-node

# Install dependencies
npm install

# Make CLI globally available (optional)
npm link
```

**Or you can just download the _.zip_ files 👌**

**Requirements:**
- ``Node.js >= 18.0.0``

---

## 🚀 Quick Start

```bash
# Add a task
node index.js add "Buy groceries"

# Add task with priority and due date
node index.js add "Fix critical bug" --priority high --due 2025-11-10 --tag work

# List all tasks
node index.js list

# Mark task as complete
node index.js done <task-id>

# See statistics
node index.js stats
```

---

## 📖 Complete Command Reference

### ➕ Add Task
```bash
node index.js add <description>
node index.js add <description> --priority <high|medium|low>
node index.js add <description> --due <YYYY-MM-DD>
node index.js add <description> --tag <tagname>

# Examples:
node index.js add "Buy milk"
node index.js add "Deploy to production" --priority high
node index.js add "Team meeting" --due 2025-11-15
node index.js add "Code review" --priority medium --tag work
node index.js add "Fix bug #123" --priority high --due 2025-11-10 --tag bugfix
```

### 📋 List Tasks
```bash
node index.js list                    # Show all tasks
node index.js list --completed        # Show only completed tasks
node index.js list --pending          # Show only pending tasks
node index.js list --priority high    # Filter by priority
node index.js list --tag work         # Filter by tag

# Examples:
node index.js list
node index.js list -c                 # Short form for --completed
node index.js list -p                 # Short form for --pending
```

### ✅ Complete Task
```bash
node index.js done <id>
node index.js complete <id>
node index.js finish <id>

# Example:
node index.js done 1730448000000
```

### ↩️ Uncomplete Task
```bash
node index.js undone <id>
node index.js uncomplete <id>
node index.js incomplete <id>

# Example:
node index.js undone 1730448000000
```

### ✏️ Update Task
```bash
node index.js update <id> <new description>
node index.js edit <id> <new description>

# Example:
node index.js update 1730448000000 "Buy groceries at Indomaret"
```

### 🗑️ Delete Task
```bash
node index.js delete <id>
node index.js remove <id>
node index.js rm <id>

# Example:
node index.js delete 1730448000000
```

### 🔍 Search Tasks
```bash
node index.js search <keyword>
node index.js find <keyword>

# Examples:
node index.js search "bug"
node index.js find "meeting"
```

### 📊 Statistics
```bash
node index.js stats
node index.js statistics
node index.js status
```

### 🧹 Clear Completed
```bash
node index.js clear
node index.js clean
```

### 📤 Export Tasks
```bash
node index.js export

# Creates: todos-export-YYYY-MM-DD.json
```

### 📥 Import Tasks
```bash
node index.js import <filename>

# Example:
node index.js import todos-export-2025-11-04.json
```

### 🚨 Help
```bash
node index.js --help
node index.js <command> --help
```

---

## 🎨 Visual Indicators

| Element | Display |
|---------|---------|
| **Priority** | 🔴 High \| 🟡 Medium \| 🟢 Low |
| **Status** | ✓ Completed \| ○ Pending |
| **Due Date** | 📅 Normal \| ⚠️ Overdue |
| **Tag** | 🏷️ Category label |

---

## 📊 Statistics Example

```bash
→ user@DESKTOP-12345 ~ $ node index.js stats

📊 Task Statistics

┌──────────────────────────┐
│ 📋 Total Tasks:    10    │
│ ✅ Completed:      7     │
│ ⏳ Pending:        3     │
│ 📈 Progress:       70%   │
└──────────────────────────┘

[████████████████░░░░] 70%

💪 Great progress! Keep it up!
```

---

## 🗂️ Project Structure

```
todo-cli-node/
├── src/
│   ├── commands/          # Command handlers
│   │   ├── add.js
│   │   ├── list.js
│   │   ├── delete.js
│   │   ├── complete.js
│   │   ├── update.js
│   │   ├── stats.js
│   │   ├── search.js
│   │   ├── clear.js
│   │   ├── export.js
│   │   └── import.js
│   ├── services/          # Business logic
│   │   ├── todoService.js
│   │   └── storageService.js
│   ├── utils/             # Utilities
│   │   ├── validator.js
│   │   ├── formatter.js
│   │   └── parser.js
│   ├── config/            # Configuration
│   │   └── constants.js
│   └── cli.js             # CLI setup
├── tests/                 # Unit tests
│   ├── services/
│   │   └── todoService.test.js
│   └── utils/
│       ├── validator.test.js
│       └── parser.test.js
├── index.js               # Entry point
├── package.json
├── vitest.config.js
└── README.md
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

**Test Coverage:**
- ✅ Validator utilities
- ✅ Parser utilities
- ✅ Todo service (CRUD operations)
- ✅ Filter & search functionality
- ✅ Statistics calculation
- ✅ Import/Export operations

---

## 🛠️ Technologies & Library Used

- **Node.js** - Runtime environment
- **Commander.js** - CLI argument parsing
- **Chalk** - Terminal colors
- **Ora** - Loading spinners
- **Vitest** - Unit testing framework

---

## 📁 Data Storage

Tasks are stored in `todos.json` in the project root directory. You can backup this file or use the export/import commands.

**Example `todos.json`:**
```json
[
  {
    "id": 1730448000000,
    "description": "Buy groceries at Super Indo",
    "completed": false,
    "priority": "medium",
    "dueDate": "2025-11-10",
    "tag": "personal",
    "createdAt": "2025-11-04T10:00:00.000Z"
  }
]
```

## 💡 Tips

1. **Use aliases** - Commands have multiple aliases for convenience (e.g., `rm`, `remove`, `delete`)
2. **Filter effectively** - Use `--completed`, `--pending`, `--priority`, `--tag` to focus
3. **Search tags** - Tags are searchable, making organization easier
4. **Regular exports** - Backup your tasks regularly with `todo export`
5. **Check stats** - Use `todo stats` to stay motivated!

---

### 「 ✦ Author ✦ 」
- [**PXCVBE**](https://github.com/pxcvbe) 
