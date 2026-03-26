'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useProgramData } from '@/contexts/ProgramDataContext';
import { useResize } from '@/hooks/useResize';
import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useDraggable } from '@/hooks/useDraggable';
import type { ProgramConfig } from '@/types';
import WindowMenuBar from './WindowMenuBar';
import SaveAsDialog from './dialogs/SaveAsDialog';
import SaveQuestionDialog from './dialogs/SaveQuestionDialog';

import minimizeIcon from '@/public/icons/minimize.png';
import maximizeIcon from '@/public/icons/maximize.png';
import closeIcon from '@/public/icons/close.png';

interface WindowProps {
  config: ProgramConfig;
  children: React.ReactNode;
}

export default function Window({ config, children }: WindowProps) {
  const {
    getWindow,
    isActive,
    close,
    minimize,
    focus,
    resize,
    toggleFullScreen,
    resetSize,
  } = useWindowManager();
  const fs = useFileSystem();
  const pd = useProgramData();

  const win = getWindow(config.id);
  const active = isActive(config.id);
  const isSmall = useSmallScreen();
  const data = pd.getData(config.id);

  // Dialog state
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showSaveQuestion, setShowSaveQuestion] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'new' | null>(
    null,
  );

  const isFullScreen = win?.isFullScreen ?? false;

  const { containerStyle, handleProps } = useDraggable({
    disabled: isFullScreen,
    lockedPosition: isFullScreen ? { x: 0, y: 0 } : null,
  });

  const handleResize = useCallback(
    (size: { w: number; h: number }) => {
      resize(config.id, size);
    },
    [config.id, resize],
  );

  const resizeHandlers = useResize(
    win?.size ?? config.initialSize,
    handleResize,
  );

  if (!win || !win.isOpen || win.isMinimized) return null;

  const currentSize = isSmall ? config.smallSize : win.size;

  const displayTitle = config.titled
    ? `${data.fileTitle || 'Untitled'} - ${config.title}`
    : config.title;

  // ── Close logic ──────────────────────────────────────────────
  function doClose() {
    pd.resetData(config.id);
    close(config.id);
    resetSize(config.id, isSmall ? config.smallSize : config.initialSize);
  }

  function handleClose() {
    if (config.saveable && !data.isSaved) {
      setPendingAction('close');
      setShowSaveQuestion(true);
    } else {
      doClose();
    }
  }

  // ── Menu bar callbacks ────────────────────────────────────────
  function handleNew() {
    if (config.saveable && !data.isSaved) {
      setPendingAction('new');
      setShowSaveQuestion(true);
    } else {
      pd.resetData(config.id);
    }
  }

  function handleSave() {
    if (data.fileTitle && data.fileId) {
      fs.overwriteFile(data.fileId, data.text);
      pd.setIsSaved(config.id, true);
    } else {
      setShowSaveAs(true);
    }
  }

  function handleOpenMenu() {
    setShowOpen(true);
  }

  function handleOpenFile(fileId: string) {
    const file = fs.getFile(fileId);
    if (file) {
      pd.loadFile(config.id, file.data, file.name + file.type, file.id);
    }
  }

  function handleDelete() {
    if (data.fileId) {
      fs.deleteFile(data.fileId);
      pd.resetData(config.id);
    }
  }

  function handleEmptyBin() {
    fs.emptyBin();
  }

  function handleRestore() {
    fs.restoreAll();
  }

  function handleHelp() {}

  // ── Save question callbacks ───────────────────────────────────
  function onSaveQuestionYes() {
    setShowSaveQuestion(false);
    if (data.fileTitle && data.fileId) {
      fs.overwriteFile(data.fileId, data.text);
      pd.setIsSaved(config.id, true);
      if (pendingAction === 'close') doClose();
      if (pendingAction === 'new') pd.resetData(config.id);
    } else {
      setShowSaveAs(true);
    }
    setPendingAction(null);
  }

  function onSaveQuestionNo() {
    setShowSaveQuestion(false);
    if (pendingAction === 'close') doClose();
    if (pendingAction === 'new') pd.resetData(config.id);
    setPendingAction(null);
  }

  function onSaveQuestionCancel() {
    setShowSaveQuestion(false);
    setPendingAction(null);
  }

  function handleFocus() {
    focus(config.id);
  }

  const programType: 'notepad' | 'paint' =
    config.id === 'paint' ? 'paint' : 'notepad';

  return (
    <>
      <div
        onMouseDown={handleFocus}
        className={
          isFullScreen
            ? 'absolute top-0 left-0 w-[calc(100vw-1px)] h-[calc(100vh-45px)] bg-[#bdbdbd]'
            : 'absolute win-raised bg-[#c0c0c0] rounded-none'
        }
        style={
          isFullScreen
            ? { zIndex: win.zIndex }
            : {
                left: `calc(50% - ${config.initialSize.w / 2}px)`,
                top: `calc(50% - ${config.initialSize.h / 2}px)`,
                width: isSmall ? config.smallSize.w : currentSize.w,
                height: isSmall ? config.smallSize.h : currentSize.h,
                zIndex: win.zIndex,
                ...containerStyle,
              }
        }
      >
        {/* ── Title Bar (drag handle) ─────────────────────────────── */}
        <div
          {...handleProps}
          className={`win-titlebar ${!active ? 'win-titlebar-inactive' : ''}`}
        >
          <div className='flex items-center gap-1 overflow-hidden'>
            <Image src={config.icon} alt='' height={20} className='shrink-0' />
            <span
              className='truncate text-[0.73rem] leading-none pb-[5px]'
              style={{ fontFamily: "'Win95 Bold', sans-serif" }}
            >
              {displayTitle}
            </span>
          </div>
          <div className='flex items-center gap-0.5 shrink-0' data-no-drag>
            <div className='flex'>
              <Image
                alt='minimize'
                src={minimizeIcon}
                height={22}
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  minimize(config.id);
                }}
              />
              <Image
                alt='maximize'
                src={maximizeIcon}
                height={22}
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullScreen(config.id);
                }}
              />
            </div>
            <div className='ml-0.5'>
              <Image
                alt='close'
                src={closeIcon}
                height={23}
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Menu Bar ───────────────────────────────────────────── */}
        {config.hasMenuBar && (
          <WindowMenuBar
            windowId={config.id}
            config={config}
            onClose={handleClose}
            onNew={handleNew}
            onSave={handleSave}
            onOpen={handleOpenMenu}
            onDelete={handleDelete}
            onEmptyBin={handleEmptyBin}
            onRestore={handleRestore}
            onHelp={handleHelp}
          />
        )}

        {/* ── Body ───────────────────────────────────────────────── */}
        <div
          className='absolute p-px w-full'
          style={{
            borderTop: '2px solid #bdbdbd',
            borderLeft: '2px solid #bdbdbd',
            borderRight: '2px solid #bdbdbd',
            borderBottom: config.hasMenuBar
              ? '2px solid white'
              : '2px solid #bdbdbd',
            height: config.hasMenuBar
              ? 'calc(100% - 67px)'
              : 'calc(100% - 37px)',
          }}
        >
          {children}
        </div>

        {/* ── Resize Handle ──────────────────────────────────────── */}
        {!isSmall && (
          <div
            className='absolute bottom-[10px] right-[5px] w-6 h-6 cursor-se-resize'
            style={{
              border: '2px inset #bdbdbd',
              borderBottomColor: 'white',
              borderRightColor: 'white',
              backgroundColor: '#bdbdbd',
            }}
            {...resizeHandlers}
          >
            {[20, 18, 16, 14, 12, 10, 8, 6, 4].map((size, i) => (
              <div
                key={i}
                className='absolute bottom-0 right-0'
                style={{
                  width: size,
                  height: size,
                  clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)',
                  backgroundColor:
                    i % 3 === 0 ? 'white' : i % 3 === 1 ? '#393939' : '#bdbdbd',
                  border: '1px solid #bdbdbd',
                  borderTopColor: '#bdbdbd',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────── */}
      {showSaveAs && (
        <SaveAsDialog
          windowId={config.id}
          programType={programType}
          isSaveMode={true}
          onClose={() => setShowSaveAs(false)}
          onSaveComplete={() => {
            if (pendingAction === 'close') doClose();
            if (pendingAction === 'new') pd.resetData(config.id);
            setPendingAction(null);
          }}
        />
      )}

      {showOpen && (
        <SaveAsDialog
          windowId={config.id}
          programType={programType}
          isSaveMode={false}
          onClose={() => setShowOpen(false)}
          onOpenFile={handleOpenFile}
        />
      )}

      {showSaveQuestion && (
        <SaveQuestionDialog
          title={config.title}
          fileTitle={data.fileTitle}
          onYes={onSaveQuestionYes}
          onNo={onSaveQuestionNo}
          onCancel={onSaveQuestionCancel}
        />
      )}
    </>
  );
}
