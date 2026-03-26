'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { RiArrowRightSFill } from 'react-icons/ri';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { PROGRAMS } from '@/config/programs';

import shutdownIcon from '@/public/icons/shutdown.png';
import keyIcon from '@/public/icons/key.png';
import helpIcon from '@/public/icons/help.png';
import programsIcon from '@/public/icons/programs.png';
import documentsIcon from '@/public/icons/documents.png';

// Program icons for sub-menu
import briefcaseImg from '@/public/icons/briefcase.png';
import explorerImg from '@/public/icons/explorer.png';
import minesweeperImg from '@/public/icons/minesweeper.png';
import notepadImg from '@/public/icons/notepad.png';
import outlookImg from '@/public/icons/outlook.png';
import paintImg from '@/public/icons/paint.png';

interface StartMenuProps {
  onClose: () => void;
  startBtnRef: React.RefObject<HTMLButtonElement | null>;
}

export default function StartMenu({ onClose, startBtnRef }: StartMenuProps) {
  const [showPrograms, setShowPrograms] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);
  const { open } = useWindowManager();

  // Close on click outside (but not on start button itself)
  useClickOutside(startRef, () => {
    // Small delay to avoid toggling the start button
    setTimeout(onClose, 0);
  });

  function openProgram(id: string) {
    const prog = PROGRAMS.find((p) => p.id === id);
    if (prog) {
      open(prog.id, prog.initialSize);
      onClose();
    }
  }

  const programItems = [
    { id: 'briefcase', icon: briefcaseImg, label: 'Briefcase' },
    { id: 'explorer', icon: explorerImg, label: 'Internet Explorer' },
    { id: 'minesweeper', icon: minesweeperImg, label: 'Minesweeper' },
    { id: 'paint', icon: paintImg, label: 'MS Paint' },
    { id: 'notepad', icon: notepadImg, label: 'Notepad' },
    { id: 'outlook', icon: outlookImg, label: 'Outlook' },
  ];

  const itemClass =
    'text-[0.6rem] h-10 w-[250px] flex items-center mb-[5px] cursor-pointer hover:text-white hover:bg-[#000181]';

  return (
    <div
      ref={startRef}
      className="absolute bottom-[38px] left-[6px] bg-[#c0c0c0] z-10 flex"
      style={{
        border: '2px solid #393939',
        borderTopColor: 'white',
        borderLeftColor: 'white',
        boxShadow: '3px 0 4px -2px #393939',
      }}
    >
      {/* Vertical banner */}
      <div
        className="w-[35px] my-[2px]"
        style={{ backgroundImage: 'linear-gradient(black, #000181)' }}
      >
        <div
          className="absolute text-white text-[0.64rem] w-[250px] h-5"
          style={{
            transform: 'rotate(270deg)',
            left: '-109px',
            bottom: '128px',
          }}
        >
          Olgun Yolcinar | Web Dev
        </div>
      </div>

      {/* Menu items */}
      <ul className="list-none pl-0 my-[2px]">
        {/* Programs */}
        <li
          className={`${itemClass} justify-between`}
          onMouseEnter={() => setShowPrograms(true)}
          onMouseLeave={() => setShowPrograms(false)}
        >
          <div className="flex items-center gap-[7px] ml-[5px]">
            <Image src={programsIcon} alt="" height={38} className="-ml-1" />
            <div>Programs</div>
          </div>
          <RiArrowRightSFill className="text-xl" />

          {/* Programs sub-menu */}
          {showPrograms && (
            <div
              className="absolute left-full bottom-[calc(100%-40px)] bg-[#c0c0c0]"
              style={{
                border: '2px solid #393939',
                borderTopColor: 'white',
                borderLeftColor: 'white',
                boxShadow: '3px 0 4px -2px #393939',
              }}
            >
              <ul className="list-none pl-0 my-[2px]">
                {programItems.map((item) => (
                  <li
                    key={item.id}
                    className={itemClass}
                    onClick={() => openProgram(item.id)}
                  >
                    <div className="flex items-center gap-[10px] ml-[5px]">
                      <Image src={item.icon} alt="" height={30} />
                      <div>{item.label}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>

        {/* Documents */}
        <li className={`${itemClass} justify-between`}>
          <div className="flex items-center gap-[10px] ml-[5px]">
            <Image src={documentsIcon} alt="" height={30} />
            <div>Documents</div>
          </div>
          <RiArrowRightSFill className="text-xl" />
        </li>

        {/* Help */}
        <li
          className={itemClass}
          onClick={() => openProgram('help')}
        >
          <Image src={helpIcon} alt="" height={30} className="ml-[5px]" />
          <div className="ml-[10px]">Help</div>
        </li>

        {/* Separator */}
        <li className="win-separator mx-[5px]" />

        {/* Login */}
        <li className={itemClass}>
          <Image src={keyIcon} alt="" height={45} className="ml-[5px]" />
          <span className="ml-[5px]">Login...</span>
        </li>

        {/* Shutdown */}
        <li
          className={`${itemClass} !mb-0`}
          onClick={() => {
            onClose();
            open('shutdown', { w: 400, h: 300 });
          }}
        >
          <Image src={shutdownIcon} alt="" height={45} className="ml-[5px]" />
          <span className="ml-[5px]">Turn Off Computer...</span>
        </li>
      </ul>
    </div>
  );
}
