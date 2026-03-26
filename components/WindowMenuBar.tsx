'use client';

import { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { ProgramConfig } from '@/types';

interface WindowMenuBarProps {
  windowId: string;
  config: ProgramConfig;
  onClose: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onOpen?: () => void;
  onDelete?: () => void;
  onEmptyBin?: () => void;
  onRestore?: () => void;
  onHelp?: () => void;
}

export default function WindowMenuBar({
  windowId,
  config,
  onClose,
  onNew,
  onSave,
  onOpen,
  onDelete,
  onEmptyBin,
  onRestore,
  onHelp,
}: WindowMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  useClickOutside(
    menuRef,
    () => {
      setActiveMenu(null);
      setIsHovering(false);
    },
    activeMenu !== null
  );

  const isRecycle = windowId === 'recycle';
  const isWorks = windowId === 'works';

  function handleMenuClick(menu: string) {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setIsHovering(false);
    } else {
      setActiveMenu(menu);
      setIsHovering(true);
    }
  }

  function handleMenuHover(menu: string) {
    if (isHovering) setActiveMenu(menu);
  }

  function closeMenu() {
    setActiveMenu(null);
    setIsHovering(false);
  }

  const menuItemClass =
    'flex justify-center w-full py-[5px] hover:text-white hover:bg-[#000181] cursor-pointer';
  const menuLabelClass = 'w-[70px] flex justify-start';

  return (
    <ul
      ref={menuRef}
      className="flex items-center list-none pl-[7px] gap-[10px] mt-[3px] mb-0 bg-[#bdbdbd] text-[0.55rem]"
    >
      {/* ── File ──────────────────────────────────────────────── */}
      <li className="relative">
        <button
          className="border-2 border-transparent px-[5px] py-[2px] hover:text-white hover:bg-[#000181] bg-transparent cursor-pointer"
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMenuHover('file')}
        >
          <span className="underline">F</span>ile
        </button>
        {activeMenu === 'file' && (
          <ul className="absolute top-full left-0 win-raised bg-[#c0c0c0] z-[3] list-none w-[130px] flex flex-col items-center py-[5px] pl-0">
            {config.opennable && (
              <>
                <li
                  className={menuItemClass}
                  onClick={() => {
                    closeMenu();
                    onOpen?.();
                  }}
                >
                  <div className={menuLabelClass}>
                    <span className="underline">O</span>pen
                  </div>
                </li>
                <li className="win-separator w-full" />
              </>
            )}

            {!isWorks && (
              <li
                className={menuItemClass}
                onClick={() => {
                  closeMenu();
                  isRecycle ? onRestore?.() : onNew?.();
                }}
              >
                <div className={menuLabelClass}>
                  {isRecycle ? (
                    <>
                      R<span className="underline">e</span>store
                    </>
                  ) : (
                    <>
                      <span className="underline">N</span>ew
                    </>
                  )}
                </div>
              </li>
            )}

            {config.saveable && (
              <li
                className={menuItemClass}
                onClick={() => {
                  closeMenu();
                  onSave?.();
                }}
              >
                <div className={menuLabelClass}>
                  <span className="underline">S</span>ave
                </div>
              </li>
            )}

            <li
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                isRecycle ? onEmptyBin?.() : onDelete?.();
              }}
            >
              <div className={menuLabelClass}>
                {isRecycle ? (
                  <>
                    Empty&nbsp;<span className="underline">B</span>in
                  </>
                ) : (
                  <>
                    <span className="underline">D</span>elete
                  </>
                )}
              </div>
            </li>

            <li className="win-separator w-full" />

            <li
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                onClose();
              }}
            >
              <div className={menuLabelClass}>
                <span className="underline">C</span>lose
              </div>
            </li>
          </ul>
        )}
      </li>

      {/* ── Edit ──────────────────────────────────────────────── */}
      <li className="relative">
        <button
          className="border-2 border-transparent px-[5px] py-[2px] hover:text-white hover:bg-[#000181] bg-transparent cursor-pointer"
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMenuHover('edit')}
        >
          <span className="underline">E</span>dit
        </button>
        {activeMenu === 'edit' && (
          <ul className="absolute top-full left-0 win-raised bg-[#c0c0c0] z-[3] list-none w-[130px] flex flex-col items-center py-[5px] pl-0">
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                <span className="underline">U</span>ndo
              </div>
            </li>
            <li className="win-separator w-full" />
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                Cu<span className="underline">t</span>
              </div>
            </li>
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                <span className="underline">C</span>opy
              </div>
            </li>
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                <span className="underline">P</span>aste
              </div>
            </li>
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                Dele<span className="underline">t</span>e
              </div>
            </li>
            <li className="win-separator w-full" />
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                Select <span className="underline">A</span>ll
              </div>
            </li>
          </ul>
        )}
      </li>

      {/* ── Search ────────────────────────────────────────────── */}
      <li className="relative">
        <button
          className="border-2 border-transparent px-[5px] py-[2px] hover:text-white hover:bg-[#000181] bg-transparent cursor-pointer"
          onClick={() => handleMenuClick('search')}
          onMouseEnter={() => handleMenuHover('search')}
        >
          <span className="underline">S</span>earch
        </button>
        {activeMenu === 'search' && (
          <ul className="absolute top-full left-0 win-raised bg-[#c0c0c0] z-[3] list-none w-[130px] flex flex-col items-center py-[5px] pl-0">
            <li className={menuItemClass}>
              <div className={menuLabelClass}>
                <span className="underline">U</span>ndo
              </div>
            </li>
          </ul>
        )}
      </li>

      {/* ── Help ──────────────────────────────────────────────── */}
      <li className="relative">
        <button
          className="border-2 border-transparent px-[5px] py-[2px] hover:text-white hover:bg-[#000181] bg-transparent cursor-pointer"
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMenuHover('help')}
        >
          <span className="underline">H</span>elp
        </button>
        {activeMenu === 'help' && (
          <ul className="absolute top-full left-0 win-raised bg-[#c0c0c0] z-[3] list-none w-[130px] flex flex-col items-center py-[5px] pl-0">
            <li
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                onHelp?.();
              }}
            >
              <div className={menuLabelClass}>
                A<span className="underline">b</span>out
              </div>
            </li>
          </ul>
        )}
      </li>
    </ul>
  );
}
