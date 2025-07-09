class MemoryManager {
  constructor() {
    this.cleanupTasks = [];
    this.intervals = [];
    this.timeouts = [];
  }

  addCleanupTask(task) {
    this.cleanupTasks.push(task);
  }

  setInterval(callback, delay) {
    const id = setInterval(callback, delay);
    this.intervals.push(id);
    return id;
  }

  setTimeout(callback, delay) {
    const id = setTimeout(callback, delay);
    this.timeouts.push(id);
    return id;
  }

  cleanup() {
    // Clear all intervals and timeouts
    this.intervals.forEach(clearInterval);
    this.timeouts.forEach(clearTimeout);

    // Run custom cleanup tasks
    this.cleanupTasks.forEach((task) => {
      try {
        task();
      } catch (error) {
        console.error("Cleanup task failed:", error);
      }
    });

    // Reset arrays
    this.intervals = [];
    this.timeouts = [];
    this.cleanupTasks = [];
  }
}
