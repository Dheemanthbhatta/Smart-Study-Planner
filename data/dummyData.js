/**
 * Initial Data Setup
 * Start with a clean slate for the MCA Study Planner
 */
export const initializeDummyData = () => {
    if (!localStorage.getItem('tasks')) {
        // Setting to an empty array so no default tasks appear
        localStorage.setItem('tasks', JSON.stringify([]));
        console.log("📁 LocalStorage initialized: Empty task list created.");
    } else {
        console.log("📁 LocalStorage found: Loading existing user tasks.");
    }
};