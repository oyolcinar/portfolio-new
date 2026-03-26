'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDraggable } from '@/hooks/useDraggable';

import modemIcon from '@/public/icons/conn_dialup.png';
import minimizeIcon from '@/public/icons/minimize.png';
import maximizeIcon from '@/public/icons/maximize.png';
import closeIcon from '@/public/icons/close.png';

export default function Connection() {
  const { getWindow, isActive, close, minimize, focus } = useWindowManager();
  const win = getWindow('modem');
  const active = isActive('modem');

  const [currentSpeed, setCurrentSpeed] = useState(20000);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [inactive, setInactive] = useState(false);
  const clickRef = useRef<HTMLDivElement>(null);

  const { dragProps } = useDraggable();

  useClickOutside(clickRef, () => setInactive(true));

  // Randomize speed
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSpeed(Math.floor(Math.random() * (36000 - 20000 + 1) + 20000));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Elapsed timer
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  function formatDuration(seconds: number) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  }

  if (!win || !win.isOpen || win.isMinimized) return null;

  return (
    <div {...dragProps}>
      <div
        ref={clickRef}
        className='absolute win-raised bg-[#c0c0c0] rounded-none'
        style={{
          left: 'calc(50% - 150px)',
          top: 'calc(50% - 80px)',
          zIndex: win.zIndex,
          boxShadow: '3px 0 4px -2px #393939',
        }}
        onClick={() => {
          setInactive(false);
          focus('modem');
        }}
      >
        {/* Title bar */}
        <div
          className={`win-titlebar ${inactive ? 'win-titlebar-inactive' : ''}`}
        >
          <div className='flex items-center gap-1 overflow-hidden'>
            <Image
              src={modemIcon}
              alt=''
              height={20}
              className='shrink-0 mr-[5px]'
            />
            <span
              className='truncate text-[0.73rem] leading-none pb-[5px]'
              style={{ fontFamily: "'Win95 Bold', sans-serif" }}
            >
              Connected to Internet Central
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
                  minimize('modem');
                }}
              />
              <Image
                alt='maximize'
                src={maximizeIcon}
                height={22}
                className='cursor-pointer'
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
                  close('modem');
                }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className='flex p-[10px]' style={{ border: '2px solid #bdbdbd' }}>
          <div className='text-[0.55rem] flex items-center'>
            <Image src={modemIcon} alt='' height={40} className='mr-[10px]' />
            <div>
              <p className='w-[170px]'>
                Connected at {(currentSpeed / 1000).toFixed(3)} bps
              </p>
              <p>Duration: {formatDuration(elapsed)}</p>
            </div>
          </div>
          <div className='ml-5 flex flex-col justify-end gap-[10px]'>
            <button className='win-btn'>
              Dis<span className='underline'>c</span>onnect
            </button>
            <button className='win-btn'>
              Show <span className='underline'>D</span>etails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
