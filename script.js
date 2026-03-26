/**
 * SMART AI STUDY PLANNER - Main Controller
 * Professional Edition for Dheemanth Bhatta
 */

// 1. Imports - Matching your "Components" (Capital C) folder structure
import { TaskManager } from './Components/taskManager.js';
import { Dashboard } from './Components/dashboard.js';
import { ChartModule } from './Components/charts.js';
import { Scheduler } from './Components/scheduler.js';
import { initializeDummyData } from './data/dummyData.js';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing App...");

    // Inject initial data if LocalStorage is empty
    initializeDummyData();
    
    // Setup UI Components
    try {
        ChartModule.init('taskChart');
        Dashboard.updateCounters();
        setupModal(); // Initialize Modal Logic
        renderTasks(); 
        updateAIInsight();
    } catch (error) {
        console.error("Initialization Error:", error);
    }

    console.log("✅ System Ready.");
});

// --- 🎯 MODAL LOGIC (THE FIX) ---
const setupModal = () => {
    const modal = document.getElementById('taskModal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const taskForm = document.getElementById('taskForm');

    if (openBtn && modal) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            console.log("Opening Task Modal...");
            modal.style.display = 'flex';
            // Add a slight delay to trigger entry animation
            modal.querySelector('.modal-card').style.animation = 'popUp 0.4s ease-out';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Close if user clicks the dark background overlay
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Form Submission Handling
    if (taskForm) {
        taskForm.onsubmit = (e) => {
            e.preventDefault();
            
            const taskData = {
                title: document.getElementById('taskTitle').value,
                type: document.getElementById('taskType').value,
                priority: document.getElementById('taskPriority').value,
                deadline: document.getElementById('taskDeadline').value
            };

            TaskManager.addTask(taskData);
            modal.style.display = 'none'; // Close modal
            taskForm.reset(); // Clear inputs
            
            // Refresh UI
            refreshAllUI();
        };
    }
};

// --- 🧭 VIEW NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-view');
        if (!targetView) return; // Ignore theme toggle clicks

        // Update Navigation UI
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update Header Title
        const viewTitle = document.getElementById('viewTitle');
        if (viewTitle) viewTitle.innerText = item.innerText.trim();

        // Switch Views
        viewSections.forEach(section => section.classList.add('hidden'));
        const targetSection = document.getElementById(`${targetView}-view`);
        if (targetSection) targetSection.classList.remove('hidden');

        // Refresh dynamic content for the specific view
        if (targetView === 'tasks') renderTasks();
        if (targetView === 'schedule') renderSchedule();
        if (targetView === 'dashboard') {
            Dashboard.updateCounters();
            ChartModule.update();
        }
    });
});

// --- 🃏 DYNAMIC RENDERING ---
function renderTasks() {
    const grid = document.getElementById('taskGrid');
    if (!grid) return;

    const tasks = TaskManager.getTasks();
    
    if (tasks.length === 0) {
        grid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: var(--text-muted);">No tasks yet. Click "+ Add New Task" to begin!</p>`;
        return;
    }

    // Generate HTML with staggered animation delays
    grid.innerHTML = tasks.map((t, index) => `
        <div class="task-card ${t.priority.toLowerCase()} ${t.completed ? 'completed' : ''}" 
             style="animation-delay: ${index * 0.1}s">
            <h3>${t.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                ${t.type} • ${new Date(t.deadline).toLocaleDateString()}
            </p>
            <div style="display: flex; gap: 10px;">
                <button onclick="window.toggleTask(${t.id})" class="btn-primary" style="background: var(--success); padding: 8px 15px; font-size: 0.8rem;">
                    ${t.completed ? 'Undo' : 'Done'}
                </button>
                <button onclick="window.deleteTask(${t.id})" class="btn-primary" style="background: var(--danger); padding: 8px 15px; font-size: 0.8rem;">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function renderSchedule() {
    const list = document.getElementById('scheduleList');
    if (!list) return;

    const sortedTasks = Scheduler.generateSmartSchedule();
    
    list.innerHTML = sortedTasks.map((t, i) => `
        <div class="ai-insight-box" style="margin-bottom: 12px; animation-delay: ${i * 0.1}s; opacity: 0.95;">
            <div style="flex: 1;">
                <strong style="display:block;">${t.title}</strong>
                <span style="font-size: 0.8rem; opacity: 0.8;">
                    ${t.priority} Priority | Deadline: ${new Date(t.deadline).toLocaleString()}
                </span>
            </div>
        </div>
    `).join('');
}

function updateAIInsight() {
    const msg = document.getElementById('ai-message');
    if (msg) msg.innerText = Scheduler.getAIInsight();
}

// --- 🔄 GLOBAL REFRESH ---
function refreshAllUI() {
    Dashboard.updateCounters();
    ChartModule.update();
    renderTasks();
    renderSchedule();
    updateAIInsight();
}

// Listen for custom events from TaskManager
window.addEventListener('tasksUpdated', refreshAllUI);

// Attach methods to window so inline HTML onclicks can find them
window.toggleTask = (id) => TaskManager.toggleTask(id);
window.deleteTask = (id) => TaskManager.deleteTask(id);

// --- 🌓 THEME TOGGLE ---
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
    themeBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    };
}