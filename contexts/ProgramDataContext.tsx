'use client';

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  ReactNode,
} from 'react';

/**
 * Per-window program data (notepad text, paint canvas, file metadata).
 * Stored in a Map keyed by windowId.  Avoids full-tree re-renders by
 * using a ref + selective subscription (bump counter).
 */

export interface ProgramData {
  text: string; // notepad body text
  fileTitle: string; // e.g. "MyFile.txt"
  fileId: string; // nanoid from FileSystemContext, '' if unsaved
  isSaved: boolean; // false = dirty
}

const DEFAULT_DATA: ProgramData = {
  text: '',
  fileTitle: '',
  fileId: '',
  isSaved: true,
};

interface ProgramDataContextValue {
  getData: (windowId: string) => ProgramData;
  setText: (windowId: string, text: string) => void;
  setFileTitle: (windowId: string, title: string) => void;
  setFileId: (windowId: string, id: string) => void;
  setIsSaved: (windowId: string, saved: boolean) => void;
  resetData: (windowId: string) => void;
  loadFile: (windowId: string, text: string, title: string, id: string) => void;
  /** Force a re-render in consumers — bump after any mutation. */
  version: number;
}

const ProgramDataContext = createContext<ProgramDataContextValue | null>(null);

export function ProgramDataProvider({ children }: { children: ReactNode }) {
  const store = useRef<Map<string, ProgramData>>(new Map());
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const getData = useCallback(
    (windowId: string): ProgramData => {
      // version is read to trigger re-render dependency
      void version;
      return store.current.get(windowId) ?? { ...DEFAULT_DATA };
    },
    [version],
  );

  const ensureEntry = (windowId: string) => {
    if (!store.current.has(windowId)) {
      store.current.set(windowId, { ...DEFAULT_DATA });
    }
    return store.current.get(windowId)!;
  };

  const setText = useCallback(
    (windowId: string, text: string) => {
      const d = ensureEntry(windowId);
      d.text = text;
      d.isSaved = false;
      bump();
    },
    [bump],
  );

  const setFileTitle = useCallback(
    (windowId: string, title: string) => {
      const d = ensureEntry(windowId);
      d.fileTitle = title;
      bump();
    },
    [bump],
  );

  const setFileId = useCallback(
    (windowId: string, id: string) => {
      const d = ensureEntry(windowId);
      d.fileId = id;
      bump();
    },
    [bump],
  );

  const setIsSaved = useCallback(
    (windowId: string, saved: boolean) => {
      const d = ensureEntry(windowId);
      d.isSaved = saved;
      bump();
    },
    [bump],
  );

  const resetData = useCallback(
    (windowId: string) => {
      store.current.set(windowId, { ...DEFAULT_DATA });
      bump();
    },
    [bump],
  );

  const loadFile = useCallback(
    (windowId: string, text: string, title: string, id: string) => {
      store.current.set(windowId, {
        text,
        fileTitle: title,
        fileId: id,
        isSaved: true,
      });
      bump();
    },
    [bump],
  );

  return (
    <ProgramDataContext.Provider
      value={{
        getData,
        setText,
        setFileTitle,
        setFileId,
        setIsSaved,
        resetData,
        loadFile,
        version,
      }}
    >
      {children}
    </ProgramDataContext.Provider>
  );
}

export function useProgramData() {
  const ctx = useContext(ProgramDataContext);
  if (!ctx)
    throw new Error('useProgramData must be used within ProgramDataProvider');
  return ctx;
}
