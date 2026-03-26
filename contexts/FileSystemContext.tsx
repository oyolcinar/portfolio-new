'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { nanoid } from 'nanoid';
import type { FileSystemState, FileAction, FileItem } from '@/types';

const initialState: FileSystemState = {
  items: [],
  recycleItems: [],
};

function fileReducer(
  state: FileSystemState,
  action: FileAction
): FileSystemState {
  switch (action.type) {
    case 'SAVE': {
      const exists = state.items.find(
        (item) =>
          item.name === action.file.name &&
          item.type === action.file.type &&
          item.directory === action.file.directory
      );
      if (exists) return state; // caller should handle duplicate via OVERWRITE
      return { ...state, items: [...state.items, action.file] };
    }

    case 'DELETE': {
      const toDelete = state.items.find((item) => item.id === action.id);
      if (!toDelete) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
        recycleItems: [...state.recycleItems, toDelete],
      };
    }

    case 'OVERWRITE':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, data: action.data } : item
        ),
      };

    case 'RESTORE_ALL':
      return {
        ...state,
        items: [...state.items, ...state.recycleItems],
        recycleItems: [],
      };

    case 'EMPTY_BIN':
      return { ...state, recycleItems: [] };

    case 'LOAD':
      return { ...state, items: action.items };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────

interface FileSystemContextValue {
  state: FileSystemState;
  saveFile: (
    name: string,
    type: string,
    data: string,
    directory: 'desktop' | 'briefcase',
    program: 'notepad' | 'paint'
  ) => { success: boolean; id: string; duplicate: boolean };
  deleteFile: (id: string) => void;
  overwriteFile: (id: string, data: string) => void;
  restoreAll: () => void;
  emptyBin: () => void;
  getFile: (id: string) => FileItem | undefined;
  getFilesByDirectory: (directory: string) => FileItem[];
  getFilesByType: (type: string, directory: string) => FileItem[];
  hasRecycleItems: boolean;
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null);

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('win95-files');
      if (stored) {
        const items = JSON.parse(stored) as FileItem[];
        dispatch({ type: 'LOAD', items });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('win95-files', JSON.stringify(state.items));
  }, [state.items]);

  const saveFile = useCallback(
    (
      name: string,
      type: string,
      data: string,
      directory: 'desktop' | 'briefcase',
      program: 'notepad' | 'paint'
    ) => {
      const duplicate = state.items.some(
        (item) =>
          item.name === name &&
          item.type === type &&
          item.directory === directory
      );

      if (duplicate) {
        return { success: false, id: '', duplicate: true };
      }

      const file: FileItem = {
        id: nanoid(),
        name,
        type,
        data,
        directory,
        program,
      };
      dispatch({ type: 'SAVE', file });
      return { success: true, id: file.id, duplicate: false };
    },
    [state.items]
  );

  const deleteFile = useCallback(
    (id: string) => dispatch({ type: 'DELETE', id }),
    []
  );

  const overwriteFile = useCallback(
    (id: string, data: string) => dispatch({ type: 'OVERWRITE', id, data }),
    []
  );

  const restoreAll = useCallback(
    () => dispatch({ type: 'RESTORE_ALL' }),
    []
  );

  const emptyBin = useCallback(() => dispatch({ type: 'EMPTY_BIN' }), []);

  const getFile = useCallback(
    (id: string) => state.items.find((item) => item.id === id),
    [state.items]
  );

  const getFilesByDirectory = useCallback(
    (directory: string) =>
      state.items.filter((item) => item.directory === directory),
    [state.items]
  );

  const getFilesByType = useCallback(
    (type: string, directory: string) =>
      state.items.filter(
        (item) => item.type === type && item.directory === directory
      ),
    [state.items]
  );

  return (
    <FileSystemContext.Provider
      value={{
        state,
        saveFile,
        deleteFile,
        overwriteFile,
        restoreAll,
        emptyBin,
        getFile,
        getFilesByDirectory,
        getFilesByType,
        hasRecycleItems: state.recycleItems.length > 0,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const ctx = useContext(FileSystemContext);
  if (!ctx)
    throw new Error('useFileSystem must be used within FileSystemProvider');
  return ctx;
}
