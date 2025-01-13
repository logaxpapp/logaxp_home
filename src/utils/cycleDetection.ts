// src/utils/cycleDetection.ts

import { ICard } from '../types/task';

/**
 * Detects if adding a dependency creates a circular dependency.
 * @param tasks All available tasks.
 * @param targetTaskId The task to which the dependency is being added.
 * @param dependencyId The task that is being added as a dependency.
 * @returns True if a circular dependency is detected, else False.
 */
export const hasCircularDependency = (
  tasks: ICard[],
  targetTaskId: string,
  dependencyId: string
): boolean => {
  const visited = new Set<string>();

  const visit = (taskId: string): boolean => {
    if (taskId === targetTaskId) return true; // Cycle detected
    if (visited.has(taskId)) return false;

    visited.add(taskId);
    const task = tasks.find(t => t._id === taskId);
    if (!task || !task.dependencies) return false;

    for (const depId of task.dependencies) {
      if (visit(depId)) return true;
    }
    return false;
  };

  return visit(dependencyId);
};
