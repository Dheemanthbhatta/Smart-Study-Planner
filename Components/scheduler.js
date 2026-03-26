import { TaskManager } from './taskManager.js';

export const Scheduler = {
    generateSmartSchedule: () => {
        const tasks = TaskManager.getTasks().filter(t => !t.completed);
        
        // Priority Mapping for sorting
        const priorityWeight = { 'High': 1, 'Medium': 2, 'Low': 3 };

        return tasks.sort((a, b) => {
            // First sort by Priority
            if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
                return priorityWeight[a.priority] - priorityWeight[b.priority];
            }
            // Then sort by closest Deadline
            return new Date(a.deadline) - new Date(b.deadline);
        });
    },

    getAIInsight: () => {
        const tasks = TaskManager.getTasks().filter(t => !t.completed);
        const highPriorityCount = tasks.filter(t => t.priority === 'High').length;

        if (tasks.length === 0) return "🌟 Your schedule is clear! Ready to add a new goal?";
        if (highPriorityCount > 3) return "⚠️ Warning: High workload detected. Break tasks into smaller chunks.";
        return "🚀 Focus on your High priority tasks first to maximize productivity.";
    }
};