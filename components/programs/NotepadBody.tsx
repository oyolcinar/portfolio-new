'use client';

import { useState } from 'react';
import type { ProgramBodyProps } from '@/types';

export default function NotepadBody({ windowId }: ProgramBodyProps) {
  const [text, setText] = useState('');

  return (
    <div className="w-full h-[calc(100%+2px)] win-sunken">
      <textarea
        className="w-full h-full border-none outline-none text-[0.6rem] tracking-wide overflow-auto resize-none win-scrollbar box-border"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
