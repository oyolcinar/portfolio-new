'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useClickOutside } from '@/hooks/useClickOutside';

import shutdownImage from '@/public/icons/shutdown.png';
import closeIcon from '@/public/icons/close.png';

export default function ShutdownDialog() {
  const [redirect, setRedirect] = useState('http://www.google.com');
  const [inactive, setInactive] = useState(false);
  const { close } = useWindowManager();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setInactive(true));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    close('shutdown');
    router.push(redirect);
  }

  function handleCancel() {
    close('shutdown');
  }

  return (
    <div className="absolute z-[100] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        ref={ref}
        className="win-raised bg-[#c0c0c0] rounded-none"
        style={{ boxShadow: '3px 0 4px -2px #393939' }}
        onClick={() => setInactive(false)}
      >
        {/* Title bar */}
        <div className={`win-titlebar ${inactive ? 'win-titlebar-inactive' : ''}`}>
          <div className="text-[0.73rem] text-white pb-[5px]">
            Shut Down Windows
          </div>
          <div className="ml-0.5">
            <Image
              alt="close"
              src={closeIcon}
              height={23}
              className="cursor-pointer"
              onClick={handleCancel}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex p-[10px] border-2 border-[#bdbdbd]">
          <div className="text-[0.55rem] flex items-start mr-[10px]">
            <Image src={shutdownImage} alt="" height={45} />
          </div>
          <div className="text-[0.55rem]">
            <div>What do you want the computer to do?</div>
            <form className="mt-[10px]" onSubmit={handleSubmit}>
              <div className="mb-[10px]">
                <input
                  type="radio"
                  id="choice1"
                  name="shutdown"
                  className="win-radio translate-y-[10px]"
                  defaultChecked
                  onClick={() => setRedirect('http://www.google.com')}
                />
                <label htmlFor="choice1" className="ml-[5px] hover:outline-dashed hover:outline-1 hover:outline-win-darker hover:outline-offset-2 cursor-pointer">
                  <span className="underline">S</span>hut down
                </label>
              </div>
              <div className="mb-[10px]">
                <input
                  type="radio"
                  id="choice2"
                  name="shutdown"
                  className="win-radio translate-y-[10px]"
                  onClick={() => setRedirect('/')}
                />
                <label htmlFor="choice2" className="ml-[5px] hover:outline-dashed hover:outline-1 hover:outline-win-darker hover:outline-offset-2 cursor-pointer">
                  <span className="underline">R</span>estart
                </label>
              </div>
              <div className="mb-[10px]">
                <input
                  type="radio"
                  id="choice3"
                  name="shutdown"
                  className="win-radio translate-y-[10px]"
                  onClick={() => setRedirect('https://github.com/oyolcinar/portfolio-site')}
                />
                <label htmlFor="choice3" className="ml-[5px] hover:outline-dashed hover:outline-1 hover:outline-win-darker hover:outline-offset-2 cursor-pointer">
                  Restart in <span className="underline">M</span>S-DOS mode
                </label>
              </div>
              <div className="mt-5 flex items-center justify-between gap-[10px]">
                <input
                  type="submit"
                  value="OK"
                  className="win-btn w-[100px] cursor-pointer"
                />
                <button
                  type="button"
                  className="win-btn w-[100px] cursor-pointer"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="button" className="win-btn w-[100px] cursor-pointer">
                  <span className="underline">H</span>elp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
