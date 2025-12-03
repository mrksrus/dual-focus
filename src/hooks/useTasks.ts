import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';

const STORAGE_KEY = 'unify-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tasks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(task => task.date === date);
  }, [tasks]);

  const getTasksForMonth = useCallback((year: number, month: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getFullYear() === year && taskDate.getMonth() === month;
    });
  }, [tasks]);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTasksForDate,
    getTasksForMonth,
  };
}
