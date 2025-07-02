import React, { useState, useEffect, useCallback } from "react";

const useTaskFilter = () => {
  // State management with proper initialization
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [counts, setCounts] = useState({
    all: 0,
    complete: 0,
    inProgress: 0,
    incomplete: 0,
  });

  /**
   * Load tasks from localStorage
   * Uses localStorage for cross-component data sharing
   */
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Simulate network delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get tasks from localStorage
        const storedTasks = localStorage.getItem("tasks");

        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);

          // Apply initial filtering
          applyFilters(parsedTasks, filters);

          // Calculate counts
          updateCounts(parsedTasks);
        } else {
          // Initialize with empty array if no tasks exist
          setTasks([]);
          setFilteredTasks([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Set up event listener for storage changes from other components
    const handleStorageChange = (e) => {
      if (e.key === "tasks") {
        try {
          const updatedTasks = JSON.parse(e.newValue || "[]");
          setTasks(updatedTasks);
          applyFilters(updatedTasks, filters);
          updateCounts(updatedTasks);
        } catch (err) {
          console.error("Error parsing tasks from storage:", err);
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /**
   * Update task counts by status
   *
   * @param {Array} taskList - List of tasks to count
   */
  const updateCounts = (taskList) => {
    const completeTasks = taskList.filter(
      (task) => task.status === "complete",
    ).length;
    const incompleteTasks = taskList.filter(
      (task) => task.status === "incomplete",
    ).length;
    const inProgressTasks = taskList.filter(
      (task) => task.status === "inProgress",
    ).length;

    setCounts({
      all: taskList.length,
      complete: completeTasks,
      inProgress: inProgressTasks,
      incomplete: incompleteTasks,
    });
  };

  /**
   * Apply filters to tasks based on current filter settings
   * Memoized with useCallback to prevent unnecessary re-renders
   *
   * @param {Array} taskList - List of tasks to filter
   * @param {Object} filterSettings - Current filter settings
   */
  const applyFilters = useCallback((taskList, filterSettings) => {
    let result = [...taskList];

    // Apply status filter
    if (filterSettings.status !== "all") {
      result = result.filter((task) => task.status === filterSettings.status);
    }

    // Apply search filter
    if (filterSettings.search.trim()) {
      const searchTerm = filterSettings.search.toLowerCase().trim();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm),
      );
    }

    setFilteredTasks(result);
  }, []);

  /**
   * Handle filter changes
   *
   * @param {string} filterType - Type of filter to change
   * @param {string} value - New filter value
   */
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    setFilters(newFilters);
    applyFilters(tasks, newFilters);
  };

  return {
    loading,
    error,
    filters,
    setFilters,
    handleFilterChange,
    counts,
    tasks,
    filteredTasks,
    applyFilters,
  };
};

export default useTaskFilter;
