'use client';

import { useProgramData } from '@/contexts/ProgramDataContext';
import type { ProgramBodyProps } from '@/types';

export default function NotepadBody({ windowId }: ProgramBodyProps) {
  const { getData, setText } = useProgramData();
  const data = getData(windowId);

  return (
    <div className='w-full h-[calc(100%+2px)] win-sunken'>
      <textarea
        className='w-full h-full border-none outline-none text-[0.6rem] tracking-wide overflow-auto resize-none win-scrollbar box-border'
        value={data.text}
        onChange={(e) => setText(windowId, e.target.value)}
      />
    </div>
  );
}
