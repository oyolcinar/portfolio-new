'use client';

import type { ProgramBodyProps } from '@/types';

export default function HelpBody({ windowId }: ProgramBodyProps) {
  return (
    <div className="w-full h-[calc(100%-32px)] bg-white win-sunken">
      <div className="w-full h-full overflow-hidden mt-[6px] ml-[6px] text-[0.55rem]">
        So, basically a Win98 clone. Feel free to play around, save, open etc.
        Some of the features are to be added as I go along. Sounds? Keyboard
        interactions? A winamp player? Screen saver feature? Who knows!
        <br />
        <br />
        Used draggable library for react. So the program tabs require double
        click to move around and you can resize them from the usual resize
        button from bottom right.
        <br />
        <br />
        Oh and feel free to open Outlook and send me a message.
        <br />
        <br />
        Cheers!
      </div>
    </div>
  );
}
