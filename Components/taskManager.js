/**
 * TaskManager Component - AI Integrated
 * Handles CRUD and AI Insight Generation
 */
import { AIService } from './aiService.js';

export const TaskManager = {
    getTasks: () => {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    },

    // Added 'async' to allow waiting for Gemini API
    addTask: async (taskData) => {
        try {
            // 1. Fetch AI tips based on the task title
            const aiAdvice = await AIService.getStudyTips(taskData.title);

            const tasks = TaskManager.getTasks();
            const newTask = {
                id: Date.now(),
                title: taskData.title,
                type: taskData.type,
                priority: taskData.priority,
                deadline: taskData.deadline,
                aiInsight: aiAdvice, // Storing AI response
                completed: false
            };
            
            tasks.push(newTask);
            TaskManager.saveAndRefresh(tasks);
        } catch (error) {
            console.error("Failed to add task with AI:", error);
            // Fallback: Add task without AI if API fails
            const tasks = TaskManager.getTasks();
            tasks.push({ ...taskData, id: Date.now(), completed: false, aiInsight: "Study hard!" });
            TaskManager.saveAndRefresh(tasks);
        }
    },

    toggleTask: (id) => {
        let tasks = TaskManager.getTasks();
        tasks = tasks.map(task => {
            if (task.id === id) return { ...task, completed: !task.completed };
            return task;
        });
        TaskManager.saveAndRefresh(tasks);
    },

    deleteTask: (id) => {
        let tasks = TaskManager.getTasks();
        tasks = tasks.filter(task => task.id !== id);
        TaskManager.saveAndRefresh(tasks);
    },

    saveAndRefresh: (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.dispatchEvent(new Event('tasksUpdated'));
    }
};