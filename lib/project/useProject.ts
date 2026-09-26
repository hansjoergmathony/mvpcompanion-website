"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  clearProject,
  loadProject,
  persistProject,
  replaceProject as replaceStoredProject,
  subscribeProject,
} from "@/lib/project/storage";
import {
  createProject,
  hasCompletedConcept,
  shouldResumeProject,
  type Project,
} from "@/lib/project/types";

function getProjectSnapshot(): Project | null {
  return loadProject();
}

function getServerSnapshot(): Project | null {
  return null;
}

function getClientReadySnapshot(): boolean {
  return true;
}

function getServerReadySnapshot(): boolean {
  return false;
}

export function useProject() {
  const project = useSyncExternalStore(
    subscribeProject,
    getProjectSnapshot,
    getServerSnapshot,
  );
  const isReady = useSyncExternalStore(
    subscribeProject,
    getClientReadySnapshot,
    getServerReadySnapshot,
  );

  const updateProject = useCallback((updater: (current: Project) => Project) => {
    const current = loadProject() ?? createProject();
    persistProject(updater(current));
  }, []);

  const startNewProject = useCallback(() => {
    return replaceStoredProject();
  }, []);

  const discardProject = useCallback(() => {
    clearProject();
  }, []);

  return {
    project,
    isReady,
    isResumable: shouldResumeProject(project),
    isCompleted: hasCompletedConcept(project),
    updateProject,
    startNewProject,
    discardProject,
  };
}
