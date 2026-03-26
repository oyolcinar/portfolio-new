'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import TrayItem from './TrayItem';
import StartMenu from './StartMenu';
import SoundControl from './SoundControl';
import { PROGRAMS } from '@/config/programs';

import windowsIcon from '@/public/icons/windows.png';
import speakerIcon from '@/public/icons/loudspeaker.png';
import dialUpIcon from '@/public/icons/conn_dialup.png';
import offOff from '@/public/icons/conn_pcs_off_off.png';
import onOff from '@/public/icons/conn_pcs_on_off.png';
import offOn from '@/public/icons/conn_pcs_off_on.png';
import onOn from '@/public/icons/conn_pcs_on_on.png';

export default function Taskbar() {
  const { openWindows, open, getWindow, restore, focus } = useWindowManager();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [time, setTime] = useState('');
  const [modemImage, setModemImage] = useState(offOff);

  const startBtnRef = useRef<HTMLButtonElement>(null);

  // Clock
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    }
    updateTime();
    const id = setInterval(updateTime, 10_000);
    return () => clearInterval(id);
  }, []);

  // Modem animation
  useEffect(() => {
    const images = [offOff, onOff, offOn, onOn];
    const id = setInterval(() => {
      setModemImage(images[Math.floor(Math.random() * images.length)]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  function handleModemClick() {
    const modemWin = getWindow('modem');
    if (!modemWin?.isOpen) {
      open('modem', { w: 320, h: 160 });
    } else if (modemWin.isMinimized) {
      restore('modem');
    } else {
      focus('modem');
    }
  }

  // Filter program windows (not modem, not shutdown)
  const programWindows = openWindows.filter(
    (w) => w.id !== 'shutdown' && w.id !== 'modem',
  );

  const modemWin = getWindow('modem');

  return (
    <nav
      className='absolute bottom-0 w-full z-[1] bg-[#c0c0c0] h-[45px] px-1 pt-px pb-[3px] flex items-center justify-between'
      style={{
        borderTop: '2px solid #fcfcfc',
        borderBottom: '2px solid #c0c0c0',
      }}
    >
      {/* Left: Start + tray items */}
      <ul className='relative pl-0 flex list-none gap-[5px] flex-nowrap items-center'>
        <li className='h-8 mb-[2px]'>
          <button
            ref={startBtnRef}
            className='win-raised text-[0.85rem] text-black bg-[#c0c0c0] flex items-center gap-[5px] h-9 px-[5px] cursor-pointer active:border-2 active:border-[#0a0a0a]'
            style={{ fontFamily: "'Win95 Bold', sans-serif" }}
            onClick={() => setIsStartOpen((prev) => !prev)}
          >
            <Image src={windowsIcon} height={28} alt='' />
            <span className='mb-[5px]'>Start</span>
          </button>
        </li>

        {/* Modem tray item */}
        {modemWin?.isOpen && (
          <li>
            <TrayItem
              windowId='modem'
              title='Connected to Internet Central'
              icon={dialUpIcon}
            />
          </li>
        )}

        {/* Program tray items */}
        {programWindows.map((win) => {
          const prog = PROGRAMS.find((p) => p.id === win.id);
          if (!prog) return null;
          return (
            <li key={win.id}>
              <TrayItem windowId={win.id} title={prog.title} icon={prog.icon} />
            </li>
          );
        })}
      </ul>

      {/* Right: System tray */}
      <div
        className='flex items-center text-[0.65rem] px-3 mr-px'
        style={{
          borderTop: '1px solid #08080e',
          borderLeft: '1px solid #08080e',
          borderRight: '1px solid #fcfcfc',
          borderBottom: '1px solid #fcfcfc',
        }}
      >
        <Image
          src={modemImage}
          alt=''
          height={24}
          className='mr-[7px] cursor-pointer'
          onClick={handleModemClick}
        />
        <Image
          src={speakerIcon}
          alt=''
          height={24}
          className='mr-[10px] cursor-pointer'
          onClick={() => setIsSoundOpen((prev) => !prev)}
        />
        <div>{time}</div>
      </div>

      {/* Sound Control — rendered at nav level for correct positioning */}
      {isSoundOpen && <SoundControl onClose={() => setIsSoundOpen(false)} />}

      {/* Start Menu */}
      {isStartOpen && (
        <StartMenu
          onClose={() => setIsStartOpen(false)}
          startBtnRef={startBtnRef}
        />
      )}
    </nav>
  );
}
