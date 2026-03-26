'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { FileItem } from '@/types';

import notepadFileIcon from '@/public/icons/notepadFileIcon.png';
import paintFileIcon from '@/public/icons/paintIcon.png';

interface FileListItemProps {
  file: FileItem;
  onDoubleClick?: (file: FileItem) => void;
}

export default function FileListItem({ file, onDoubleClick }: FileListItemProps) {
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setSelected(false));

  const icon = file.program === 'notepad' ? notepadFileIcon : paintFileIcon;

  function handleClick(e: React.MouseEvent) {
    setSelected(true);
    if (e.detail === 2) {
      onDoubleClick?.(file);
    }
  }

  return (
    <div
      ref={ref}
      className="flex items-center mt-[5px] ml-[6px] text-[0.55rem] w-[100px] cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src={icon}
        alt=""
        height={18}
        className={selected ? 'win-icon-selected' : ''}
      />
      <div
        className={
          selected
            ? 'text-white border border-dotted border-white bg-[#000181] ml-1'
            : 'border border-transparent ml-1'
        }
      >
        {file.name}{file.type}
      </div>
    </div>
  );
}
