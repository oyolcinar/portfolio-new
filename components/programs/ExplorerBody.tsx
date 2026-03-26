'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { ProgramBodyProps } from '@/types';

import backArrow from '@/public/icons/backArrow.png';
import forwardArrow from '@/public/icons/forwardArrow.png';
import stopIcon from '@/public/icons/stopEXP.png';
import refreshIcon from '@/public/icons/refresh.png';
import homeIcon from '@/public/icons/home.png';
import searchIcon from '@/public/icons/search.png';
import favoritesIcon from '@/public/icons/favoritesEXP.png';
import historyIcon from '@/public/icons/history.png';
import goArrowIcon from '@/public/icons/goArrow.png';

const DEFAULT_URL = 'https://www.wikipedia.org/';

export default function ExplorerBody({ windowId }: ProgramBodyProps) {
  const [address, setAddress] = useState(DEFAULT_URL);
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const addressRef = useRef<HTMLInputElement>(null);

  function navigate(url: string) {
    const newHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setAddress(url);
  }

  function goBack() {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAddress(history[newIndex]);
    }
  }

  function goForward() {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAddress(history[newIndex]);
    }
  }

  function goHome() {
    navigate(DEFAULT_URL);
  }

  function handleGo() {
    navigate(address);
  }

  const toolbarBtn = 'flex flex-col items-center cursor-pointer';
  const vSep = 'h-10 w-px border-l border-l-[#393939] border-r border-r-white';

  return (
    <div className="flex flex-col h-full">
      {/* Separator */}
      <div className="win-separator" />

      {/* Toolbar */}
      <div className="flex items-center mt-[5px] ml-[10px] mb-[5px] gap-5 text-[0.55rem] overflow-x-hidden">
        <div className={toolbarBtn} onClick={goBack}>
          <Image src={backArrow} alt="" height={24} />
          <div>Back</div>
        </div>
        <div className={toolbarBtn} onClick={goForward}>
          <Image src={forwardArrow} alt="" height={24} />
          <div>Forward</div>
        </div>
        <div className={vSep} />
        <div className={toolbarBtn}>
          <Image src={stopIcon} alt="" height={24} />
          <div>Stop</div>
        </div>
        <div className={toolbarBtn}>
          <Image src={refreshIcon} alt="" height={24} />
          <div>Refresh</div>
        </div>
        <div className={toolbarBtn} onClick={goHome}>
          <Image src={homeIcon} alt="" height={24} />
          <div>Home</div>
        </div>
        <div className={vSep} />
        <div className={toolbarBtn}>
          <Image src={searchIcon} alt="" height={24} />
          <div>Search</div>
        </div>
        <div className={toolbarBtn}>
          <Image src={favoritesIcon} alt="" height={24} />
          <div>Favorites</div>
        </div>
        <div className={toolbarBtn}>
          <Image src={historyIcon} alt="" height={24} />
          <div>History</div>
        </div>
        <div className={vSep} />
      </div>

      {/* Separator */}
      <div className="win-separator" />

      {/* Address bar */}
      <div className="relative flex items-center px-px">
        <label className="inline-block text-[0.55rem] w-[68px] pl-[7px]">
          Address:
        </label>
        <input
          ref={addressRef}
          type="text"
          className="win-input flex-1 h-[21px] mb-[10px] mt-[5px]"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGo()}
        />
        <div
          className="absolute right-[28px] top-0 flex items-center text-[0.55rem] w-[60px] h-10 cursor-pointer"
          onClick={handleGo}
        >
          <div className={vSep} />
          <div className="flex items-center mx-[10px]">
            <Image src={goArrowIcon} height={24} alt="" />
            <div>Go</div>
          </div>
          <div className={vSep} />
        </div>
        <div className="absolute text-[0.55rem] top-[2px] right-[3px]">&gt;&gt;</div>
      </div>

      {/* Browser iframe */}
      <div className="flex-1 win-sunken">
        <iframe
          className="w-full h-full border-none win-scrollbar"
          src={history[historyIndex]}
        />
      </div>
    </div>
  );
}
