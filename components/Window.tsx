'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useResize } from '@/hooks/useResize';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useDraggable } from '@/hooks/useDraggable';
import type { ProgramConfig } from '@/types';
import WindowMenuBar from './WindowMenuBar';

import minimizeIcon from '@/public/icons/minimize.png';
import maximizeIcon from '@/public/icons/maximize.png';
import closeIcon from '@/public/icons/close.png';

interface WindowProps {
  config: ProgramConfig;
  titleData?: string;
  children: React.ReactNode;
  onClose?: () => void;
  menuBarProps?: Record<string, unknown>;
}

export default function Window({
  config,
  titleData,
  children,
  onClose,
  menuBarProps,
}: WindowProps) {
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

  const win = getWindow(config.id);
  const active = isActive(config.id);
  const isSmall = useSmallScreen();
  const clickRef = useRef<HTMLDivElement>(null);
  const [isFocusLost, setIsFocusLost] = useState(false);

  const isFullScreen = win?.isFullScreen ?? false;

  const { dragProps } = useDraggable({
    disabled: false,
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

  useClickOutside(clickRef, () => setIsFocusLost(true));

  if (!win || !win.isOpen || win.isMinimized) return null;

  const currentSize = isSmall ? config.smallSize : win.size;

  const displayTitle = config.titled
    ? `${titleData || 'Untitled'} - ${config.title}`
    : config.title;

  function handleClose() {
    onClose?.();
    close(config.id);
    resetSize(config.id, isSmall ? config.smallSize : config.initialSize);
  }

  function handleFocus() {
    setIsFocusLost(false);
    focus(config.id);
  }

  return (
    <div {...dragProps}>
      <div
        ref={clickRef}
        onClick={handleFocus}
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
              }
        }
      >
        {/* ── Title Bar ──────────────────────────────────────────── */}
        <div
          className={`win-titlebar ${isFocusLost ? 'win-titlebar-inactive' : ''}`}
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
          <div className='flex items-center gap-0.5 shrink-0'>
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
            {...menuBarProps}
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
    </div>
  );
}
