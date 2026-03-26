import { TaskManager } from './taskManager.js';
import { Scheduler } from './scheduler.js';

export const Dashboard = {
    updateCounters: () => {
        const tasks = TaskManager.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        
        document.getElementById('total-tasks').innerText = tasks.length;
        document.getElementById('pending-tasks').innerText = tasks.length - completed;
        document.getElementById('completed-tasks').innerText = completed;
        
        Dashboard.updateProgressBar(tasks.length, completed);
    },

    updateProgressBar: (total, completed) => {
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        const aiMessage = Scheduler.getAIInsight();
        
        const banner = document.getElementById('ai-message');
        if (banner) banner.innerText = aiMessage;
    }
};