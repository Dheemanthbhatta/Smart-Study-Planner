import { TaskManager } from './taskManager.js';

let taskChart = null;

export const ChartModule = {
    init: (canvasId) => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        taskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#10b981', '#4f46e5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
        ChartModule.update();
    },

    update: () => {
        if (!taskChart) return;
        const tasks = TaskManager.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.length - completed;

        taskChart.data.datasets[0].data = [completed, pending];
        taskChart.update();
    }
};