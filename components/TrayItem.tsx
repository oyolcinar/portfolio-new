'use client';

import Image, { StaticImageData } from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';

interface TrayItemProps {
  windowId: string;
  title: string;
  icon: StaticImageData;
}

export default function TrayItem({ windowId, title, icon }: TrayItemProps) {
  const { getWindow, isActive, restore, focus } = useWindowManager();
  const win = getWindow(windowId);

  if (!win?.isOpen) return null;

  const active = isActive(windowId) && !win.isMinimized;

  return (
    <div
      className={`top-px w-[250px] max-sm:w-[60px] max-sm:h-[35px] max-sm:overflow-hidden rounded-none ${
        active ? 'win-pressed font-bold' : 'win-raised'
      } bg-[#c0c0c0] cursor-pointer`}
      onClick={() => {
        if (win.isMinimized) {
          restore(windowId);
        } else {
          focus(windowId);
        }
      }}
    >
      <div className="flex items-center text-[0.55rem] p-1 border-2 border-[#bdbdbd] text-black">
        <Image src={icon} alt="" height={20} className="mr-[5px] shrink-0" />
        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-sm:max-w-[10%]">
          {title}
        </span>
      </div>
    </div>
  );
}
