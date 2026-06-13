import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6001/tasks")
      .then((r) => r.json())
      .then((data) => setTasks(data));
  }, []);

  function addTask(task) {
    fetch("http://localhost:6001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((r) => r.json())
      .then((newTask) => {
        setTasks((currentTasks) => [...currentTasks, newTask]);
      });
  }

  function toggleComplete(task) {
    fetch(`http://localhost:6001/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then((r) => r.json())
      .then((updatedTask) => {
        setTasks((currentTasks) =>
          currentTasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
          )
        );
      });
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}