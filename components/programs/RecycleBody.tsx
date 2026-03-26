'use client';

import { useFileSystem } from '@/contexts/FileSystemContext';
import FileListItem from '@/components/ui/FileListItem';
import type { ProgramBodyProps } from '@/types';

export default function RecycleBody({ windowId }: ProgramBodyProps) {
  const { state } = useFileSystem();

  return (
    <div className="w-full h-[calc(100%-30px)] bg-white win-sunken">
      <div className="h-full w-full">
        {state.recycleItems.map((file) => (
          <FileListItem key={file.id} file={file} />
        ))}
        {state.recycleItems.length === 0 && (
          <div className="p-2 text-[0.55rem] text-[#a0a0a0]">
            (empty)
          </div>
        )}
      </div>
    </div>
  );
}
