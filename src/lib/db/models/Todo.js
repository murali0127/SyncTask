import supabase from "../../supabase-client";

// ============================================
// MODEL DEFINITION
// ============================================
export const TodoModel = {
      table: 'todos',
      required: ['id', 'user_id', 'title', 'created_at'],
      optional: {
            description: null,
            priority: 'medium',
            due_date: null,
            completed: false
      },
      types: {
            id: 'string',
            user_id: 'string',
            title: 'string',
            description: 'string',
            priority: 'string',
            due_date: 'string',
            completed: 'boolean',
            created_at: 'string',
            updated_at: 'string'
      }
};


// VALIDATION FUNCTIONS

export function validateTodo(data) {
      const errors = [];

      // Validate title
      if (!data.title || data.title.trim() === '') {
            errors.push('Title is required');
      }

      if (data.title && data.title.length > 150) {
            errors.push('Todo title exceeds maximum length (150 characters)');
      }

      // Validate priority
      if (data.priority && !['low', 'medium', 'high'].includes(data.priority.trim())) {
            errors.push('Invalid priority (must be: low, medium, high)');
      }

      // Validate due_date
      if (data.due_date && isNaN(new Date(data.due_date).getTime())) {
            errors.push('Invalid due date format');
      }

      return {
            isValid: errors.length === 0,
            errors
      };
}

// STATUS CHECK FUNCTIONS

export function isOverdue(todo) {
      if (!todo.due_date) return false;
      return new Date(todo.due_date) < new Date();
}

export function isPriority(todo, level) {
      return todo.priority === level;
}

export function isCompleted(todo) {
      return todo.completed === true;
}
// CALCULATION FUNCTIONS

export function getDaysUntilDue(todo) {
      if (!todo.due_date) return null;
      const due = new Date(todo.due_date);
      const today = new Date();
      const diffTime = due - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatus(todo) {
      if (todo.completed) return 'completed';
      if (isOverdue(todo)) return 'overdue';
      return 'active';
}

// ARRAY MANIPULATION FUNCTIONS

export function sortTodos(todos, sortBy = 'created_at') {
      return [...todos].sort((a, b) => {
            if (sortBy === 'due_date') {
                  return new Date(a.due_date) - new Date(b.due_date);
            }
            if (sortBy === 'priority') {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(b.created_at) - new Date(a.created_at);
      });
}

export function filterTodos(todos, filterBy = {}) {
      return todos.filter(todo => {
            if (filterBy.priority && todo.priority !== filterBy.priority) return false;
            if (filterBy.completed !== undefined && todo.completed !== filterBy.completed) return false;
            if (filterBy.overdue && !isOverdue(todo)) return false;
            return true;
      });
}

export function groupTodosByStatus(todos) {
      return {
            completed: todos.filter(t => t.completed),
            overdue: todos.filter(t => isOverdue(t) && !t.completed),
            active: todos.filter(t => !t.completed && !isOverdue(t))
      };
}


// TRANSFORMATION FUNCTIONS

export function enrichTodo(todo) {
      return {
            ...todo,
            status: getStatus(todo),
            isOverdue: isOverdue(todo),
            daysUntilDue: getDaysUntilDue(todo),
            priorityLabel: todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
      };
}

export function enrichTodos(todos) {
      return todos.map(enrichTodo);
}

// ANALYSIS FUNCTIONS

export function calculateProgress(todos) {
      if (todos.length === 0) {
            return { total: 0, completed: 0, percentage: 0 };
      }
      const completed = todos.filter(t => t.completed).length;
      return {
            total: todos.length,
            completed,
            percentage: Math.round((completed / todos.length) * 100)
      };
}

export function getNextDueDate(todos) {
      if (todos.length === 0) return null;
      const sorted = sortTodos(todos, 'due_date');
      return sorted[0]?.due_date || null;
}

