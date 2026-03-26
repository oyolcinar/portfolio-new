'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import type { WindowManagerState, WindowAction, WindowState, Size } from '@/types';

const initialState: WindowManagerState = {
  windows: {},
  activeId: '',
  zCounter: 1,
};

function windowReducer(
  state: WindowManagerState,
  action: WindowAction
): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows[action.id];
      if (existing?.isOpen) {
        // Already open — just focus and restore
        return {
          ...state,
          activeId: action.id,
          zCounter: state.zCounter + 1,
          windows: {
            ...state.windows,
            [action.id]: {
              ...existing,
              isMinimized: false,
              zIndex: state.zCounter + 1,
            },
          },
        };
      }
      return {
        ...state,
        activeId: action.id,
        zCounter: state.zCounter + 1,
        windows: {
          ...state.windows,
          [action.id]: {
            id: action.id,
            isOpen: true,
            isMinimized: false,
            size: action.initialSize,
            zIndex: state.zCounter + 1,
            isFullScreen: false,
          },
        },
      };
    }

    case 'CLOSE': {
      const { [action.id]: _, ...rest } = state.windows;
      return {
        ...state,
        windows: rest,
        activeId: state.activeId === action.id ? '' : state.activeId,
      };
    }

    case 'MINIMIZE':
      return {
        ...state,
        activeId: state.activeId === action.id ? '' : state.activeId,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            isMinimized: true,
          },
        },
      };

    case 'RESTORE':
      return {
        ...state,
        activeId: action.id,
        zCounter: state.zCounter + 1,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            isMinimized: false,
            zIndex: state.zCounter + 1,
          },
        },
      };

    case 'FOCUS':
      return {
        ...state,
        activeId: action.id,
        zCounter: state.zCounter + 1,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            zIndex: state.zCounter + 1,
          },
        },
      };

    case 'RESIZE':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            size: action.size,
          },
        },
      };

    case 'TOGGLE_FULLSCREEN': {
      const win = state.windows[action.id];
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isFullScreen: !win.isFullScreen,
          },
        },
      };
    }

    case 'RESET_SIZE':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            size: action.size,
            isFullScreen: false,
          },
        },
      };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────

interface WindowManagerContextValue {
  state: WindowManagerState;
  open: (id: string, initialSize: Size) => void;
  close: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  focus: (id: string) => void;
  resize: (id: string, size: Size) => void;
  toggleFullScreen: (id: string) => void;
  resetSize: (id: string, size: Size) => void;
  getWindow: (id: string) => WindowState | undefined;
  isActive: (id: string) => boolean;
  openWindows: WindowState[];
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null
);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialState);

  const open = useCallback(
    (id: string, initialSize: Size) =>
      dispatch({ type: 'OPEN', id, initialSize }),
    []
  );
  const close = useCallback(
    (id: string) => dispatch({ type: 'CLOSE', id }),
    []
  );
  const minimize = useCallback(
    (id: string) => dispatch({ type: 'MINIMIZE', id }),
    []
  );
  const restore = useCallback(
    (id: string) => dispatch({ type: 'RESTORE', id }),
    []
  );
  const focus = useCallback(
    (id: string) => dispatch({ type: 'FOCUS', id }),
    []
  );
  const resize = useCallback(
    (id: string, size: Size) => dispatch({ type: 'RESIZE', id, size }),
    []
  );
  const toggleFullScreen = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_FULLSCREEN', id }),
    []
  );
  const resetSize = useCallback(
    (id: string, size: Size) => dispatch({ type: 'RESET_SIZE', id, size }),
    []
  );

  const getWindow = useCallback(
    (id: string) => state.windows[id],
    [state.windows]
  );

  const isActive = useCallback(
    (id: string) => state.activeId === id,
    [state.activeId]
  );

  const openWindows = Object.values(state.windows).filter((w) => w.isOpen);

  return (
    <WindowManagerContext.Provider
      value={{
        state,
        open,
        close,
        minimize,
        restore,
        focus,
        resize,
        toggleFullScreen,
        resetSize,
        getWindow,
        isActive,
        openWindows,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx)
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
