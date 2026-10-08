"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  createIdea,
  deleteIdea as deleteStoredIdea,
  importIdea as importStoredIdea,
  replaceActiveIdea as replaceStoredActiveIdea,
  loadIdeaLibrary,
  selectIdea as selectStoredIdea,
  subscribeIdeaLibrary,
  updateActiveIdea as updateStoredActiveIdea,
} from "@/lib/project/storage";
import {
  hasCompletedConcept,
  shouldResumeIdea,
  type Idea,
  type IdeaLibrary,
} from "@/lib/project/types";

const emptyLibrary: IdeaLibrary = { version: 2, activeIdeaId: null, ideas: [] };

function getLibrarySnapshot() {
  return loadIdeaLibrary();
}

function getServerSnapshot() {
  return emptyLibrary;
}

function getClientReadySnapshot(): boolean {
  return true;
}

function getServerReadySnapshot(): boolean {
  return false;
}

export function useIdeaLibrary() {
  const library = useSyncExternalStore(
    subscribeIdeaLibrary,
    getLibrarySnapshot,
    getServerSnapshot,
  );
  const isReady = useSyncExternalStore(
    subscribeIdeaLibrary,
    getClientReadySnapshot,
    getServerReadySnapshot,
  );
  const activeIdea = library.ideas.find(
    (idea) => idea.id === library.activeIdeaId,
  ) ?? null;

  const updateActiveIdea = useCallback((updater: (current: Idea) => Idea) => {
    updateStoredActiveIdea(updater);
  }, []);

  const selectIdea = useCallback((id: string) => {
    selectStoredIdea(id);
  }, []);

  const deleteIdea = useCallback((id: string) => {
    deleteStoredIdea(id);
  }, []);

  const createNewIdea = useCallback(() => {
    return createIdea();
  }, []);

  const importIdea = useCallback((idea: Idea) => {
    return importStoredIdea(idea);
  }, []);

  const replaceActiveIdea = useCallback((idea: Idea) => {
    return replaceStoredActiveIdea(idea);
  }, []);

  return {
    library,
    ideas: library.ideas,
    activeIdea,
    isReady,
    isResumable: shouldResumeIdea(activeIdea),
    isCompleted: hasCompletedConcept(activeIdea),
    createIdea: createNewIdea,
    importIdea,
    replaceActiveIdea,
    selectIdea,
    updateActiveIdea,
    deleteIdea,
  };
}
