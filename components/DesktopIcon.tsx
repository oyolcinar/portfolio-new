'use client';

import { useState, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDraggable } from '@/hooks/useDraggable';

interface DesktopIconProps {
  name: string;
  icon: StaticImageData;
  shortcutOverlay?: StaticImageData;
  onDoubleClick: () => void;
  offset?: { x: number; y: number };
  darkText?: boolean;
}

export default function DesktopIcon({
  name,
  icon,
  shortcutOverlay,
  onDoubleClick,
  offset,
  darkText = false,
}: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const clickRef = useRef<HTMLDivElement>(null);
  const { containerStyle, handleProps } = useDraggable({
    defaultPosition: offset ?? { x: 0, y: 0 },
    allowClicks: true,
  });

  useClickOutside(clickRef, () => setSelected(false));

  function handleInteraction(e: React.MouseEvent | React.TouchEvent) {
    setSelected(true);
    if ('detail' in e && e.detail === 2) {
      onDoubleClick();
    } else if (e.type === 'touchstart') {
      onDoubleClick();
    }
  }

  return (
    <div style={containerStyle}>
      <div
        ref={clickRef}
        {...handleProps}
        className={`text-[0.55rem] w-20 flex flex-col items-center my-[10px] text-center cursor-pointer select-none ${
          darkText ? 'text-black' : 'text-white'
        }`}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className='relative'>
          <Image
            src={icon}
            height={30}
            alt=''
            className={selected ? 'win-icon-selected' : ''}
          />
          {shortcutOverlay && (
            <Image
              src={shortcutOverlay}
              height={30}
              alt=''
              className='absolute inset-0'
            />
          )}
        </div>
        <div
          className={`mt-[3px] ${
            selected
              ? 'border border-dotted border-white bg-[#000181]'
              : 'border border-transparent'
          }`}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
