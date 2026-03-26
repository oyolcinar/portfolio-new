'use client';

import Image from 'next/image';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import type { ProgramBodyProps } from '@/types';

import explorerPage from '@/public/icons/html.png';
import shortcutIcon from '@/public/icons/shortcut.png';

interface WorkItem {
  id: string;
  name: string;
  url: string;
}

const WORKS: WorkItem[] = [
  { id: 'baziszt', name: 'Baziszt', url: 'https://jovial-starburst-545a45.netlify.app' },
  { id: 'dislevent', name: 'Dislevent International', url: 'https://disleventinternational.com' },
  { id: 'andlana', name: '&LANA', url: 'https://andlana.co' },
  { id: 'snob', name: 'SNOB', url: 'https://curious-squirrel-791794.netlify.app' },
  { id: 'tekgoz', name: 'Tekgoz Studio', url: 'https://tekgoz.studio' },
];

export default function WorksBody({ windowId }: ProgramBodyProps) {
  const { open } = useWindowManager();

  function openInExplorer(name: string, url: string) {
    // Opens explorer with the given URL
    // TODO: pass URL to explorer via shared state or context
    open('explorer', { w: 800, h: 600 });
  }

  return (
    <div className="w-full h-[calc(100%-30px)] bg-white win-sunken">
      <div className="h-full w-full flex flex-wrap gap-4 p-2 content-start">
        {WORKS.map((item) => (
          <div
            key={item.id}
            className="text-[0.55rem] w-20 flex flex-col items-center text-center cursor-pointer text-black"
            onClick={() => openInExplorer(item.name, item.url)}
          >
            <div className="relative">
              <Image src={explorerPage} height={30} alt="" />
              <Image
                src={shortcutIcon}
                height={30}
                alt=""
                className="absolute inset-0"
              />
            </div>
            <div className="mt-[3px] border border-transparent hover:border-dotted hover:border-white hover:bg-[#000181] hover:text-white">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
