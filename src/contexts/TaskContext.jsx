"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const TaskContext = createContext(null);

// 任务状态枚举
export const TaskStatus = {
  PENDING: 'pending',     // 等待中
  RUNNING: 'running',     // 运行中
  COMPLETED: 'completed', // 已完成
  FAILED: 'failed',       // 失败
  CANCELLED: 'cancelled', // 已取消
};

// 任务类型枚举
export const TaskType = {
  GENERATE_PLAN: 'generate_plan',
  GENERATE_MATERIAL: 'generate_material',
  SYNTHESIZE_ARTICLE: 'synthesize_article',
};

let taskIdCounter = 0;

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const abortControllersRef = useRef(new Map()); // 存储 AbortController

  // 创建新任务
  const createTask = useCallback((type, name, options = {}) => {
    const taskId = ++taskIdCounter;
    const newTask = {
      id: taskId,
      type,
      name,
      status: TaskStatus.PENDING,
      progress: 0,
      result: null,
      error: null,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      ...options,
    };

    setTasks(prev => [...prev, newTask]);
    return taskId;
  }, []);

  // 开始任务
  const startTask = useCallback((taskId, promise) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: TaskStatus.RUNNING,
              startedAt: new Date().toISOString(),
            }
          : task
      )
    );

    // 创建 AbortController 用于取消任务
    const abortController = new AbortController();
    abortControllersRef.current.set(taskId, abortController);

    // 处理 Promise
    promise
      .then(result => {
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: TaskStatus.COMPLETED,
                  progress: 100,
                  result,
                  completedAt: new Date().toISOString(),
                }
              : task
          )
        );
        abortControllersRef.current.delete(taskId);
      })
      .catch(error => {
        // 如果是取消操作，不更新为失败状态
        if (error.name === 'AbortError') {
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    status: TaskStatus.CANCELLED,
                    completedAt: new Date().toISOString(),
                  }
                : task
            )
          );
        } else {
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    status: TaskStatus.FAILED,
                    error: error.message || '任务执行失败',
                    completedAt: new Date().toISOString(),
                  }
                : task
            )
          );
        }
        abortControllersRef.current.delete(taskId);
      });

    return { promise, abortController };
  }, []);

  // 更新任务进度
  const updateTaskProgress = useCallback((taskId, progress) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              progress: Math.min(100, Math.max(0, progress)),
            }
          : task
      )
    );
  }, []);

  // 取消任务
  const cancelTask = useCallback((taskId) => {
    const abortController = abortControllersRef.current.get(taskId);
    if (abortController) {
      abortController.abort();
      abortControllersRef.current.delete(taskId);
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId && task.status === TaskStatus.RUNNING
          ? {
              ...task,
              status: TaskStatus.CANCELLED,
              completedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  // 删除任务
  const removeTask = useCallback((taskId) => {
    // 如果任务正在运行，先取消
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status === TaskStatus.RUNNING) {
      cancelTask(taskId);
    }

    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [tasks, cancelTask]);

  // 清空所有已完成的任务
  const clearCompletedTasks = useCallback(() => {
    setTasks(prev =>
      prev.filter(
        task =>
          task.status !== TaskStatus.COMPLETED &&
          task.status !== TaskStatus.FAILED &&
          task.status !== TaskStatus.CANCELLED
      )
    );
  }, []);

  // 清空所有任务
  const clearAllTasks = useCallback(() => {
    // 取消所有运行中的任务
    tasks.forEach(task => {
      if (task.status === TaskStatus.RUNNING) {
        cancelTask(task.id);
      }
    });
    setTasks([]);
  }, [tasks, cancelTask]);

  // 获取任务
  const getTask = useCallback(
    (taskId) => {
      return tasks.find(task => task.id === taskId);
    },
    [tasks]
  );

  // 获取运行中的任务
  const getRunningTasks = useCallback(() => {
    return tasks.filter(
      task =>
        task.status === TaskStatus.RUNNING || task.status === TaskStatus.PENDING
    );
  }, [tasks]);

  // 获取已完成的任务
  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.status === TaskStatus.COMPLETED);
  }, [tasks]);

  // 执行任务（创建并开始）
  const executeTask = useCallback(
    (type, name, promiseFactory, options = {}) => {
      const taskId = createTask(type, name, options);

      // 创建包装的 Promise，支持取消
      const abortController = new AbortController();
      abortControllersRef.current.set(taskId, abortController);

      // 更新任务状态为运行中
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: TaskStatus.RUNNING,
                startedAt: new Date().toISOString(),
              }
            : task
        )
      );

      const wrappedPromise = new Promise(async (resolve, reject) => {
        try {
          // 调用实际的 Promise factory
          const result = await promiseFactory(abortController.signal);

          // 任务完成
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    status: TaskStatus.COMPLETED,
                    progress: 100,
                    result,
                    completedAt: new Date().toISOString(),
                  }
                : task
            )
          );
          abortControllersRef.current.delete(taskId);
          resolve(result);
        } catch (error) {
          abortControllersRef.current.delete(taskId);

          // 如果是取消操作
          if (error.name === 'AbortError' || abortController.signal.aborted) {
            setTasks(prev =>
              prev.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      status: TaskStatus.CANCELLED,
                      completedAt: new Date().toISOString(),
                    }
                  : task
              )
            );
            reject(error);
          } else {
            // 任务失败
            setTasks(prev =>
              prev.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      status: TaskStatus.FAILED,
                      error: error.message || '任务执行失败',
                      completedAt: new Date().toISOString(),
                    }
                  : task
              )
            );
            reject(error);
          }
        }
      });

      return { taskId, promise: wrappedPromise, abortController };
    },
    [createTask]
  );

  const value = {
    tasks,
    createTask,
    startTask,
    updateTaskProgress,
    cancelTask,
    removeTask,
    clearCompletedTasks,
    clearAllTasks,
    getTask,
    getRunningTasks,
    getCompletedTasks,
    executeTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
