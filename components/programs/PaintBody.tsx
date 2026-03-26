'use client';

import type { ProgramBodyProps } from '@/types';

export default function PaintBody({ windowId }: ProgramBodyProps) {
  // TODO: Implement react-painter canvas here
  return (
    <div className="w-full h-full bg-white win-sunken flex items-center justify-center text-[0.55rem] text-[#a0a0a0]">
      MS Paint — Coming Soon
    </div>
  );
}
