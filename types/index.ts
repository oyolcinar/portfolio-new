import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

// ── Window Management ──────────────────────────────────────────────

export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  size: Size;
  zIndex: number;
  isFullScreen: boolean;
}

export interface Size {
  w: number;
  h: number;
}

export type WindowAction =
  | { type: 'OPEN'; id: string; initialSize: Size }
  | { type: 'CLOSE'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'RESIZE'; id: string; size: Size }
  | { type: 'TOGGLE_FULLSCREEN'; id: string }
  | { type: 'RESET_SIZE'; id: string; size: Size };

export interface WindowManagerState {
  windows: Record<string, WindowState>;
  activeId: string;
  zCounter: number;
}

// ── File System ────────────────────────────────────────────────────

export interface FileItem {
  id: string;
  name: string;
  type: string; // '.txt' | '.bmp' | '.jpg' | '.jpeg'
  data: string;
  directory: 'desktop' | 'briefcase';
  program: 'notepad' | 'paint';
}

export type FileAction =
  | { type: 'SAVE'; file: FileItem }
  | { type: 'DELETE'; id: string }
  | { type: 'OVERWRITE'; id: string; data: string }
  | { type: 'RESTORE_ALL' }
  | { type: 'EMPTY_BIN' }
  | { type: 'LOAD'; items: FileItem[] };

export interface FileSystemState {
  items: FileItem[];
  recycleItems: FileItem[];
}

// ── Program Registry ───────────────────────────────────────────────

export interface ProgramConfig {
  id: string;
  title: string;
  icon: StaticImageData;
  desktopIcon?: StaticImageData;
  shortcutOverlay?: boolean;
  initialSize: Size;
  smallSize: Size;
  saveable: boolean;
  opennable: boolean;
  hasMenuBar: boolean;
  titled: boolean; // shows "filename - Title" in titlebar
  component: React.ComponentType<ProgramBodyProps>;
}

export interface ProgramBodyProps {
  windowId: string;
}

// ── Desktop Icon ───────────────────────────────────────────────────

export interface DesktopIconConfig {
  id: string;
  name: string;
  icon: StaticImageData;
  shortcutOverlay?: boolean;
  action: () => void;
}
