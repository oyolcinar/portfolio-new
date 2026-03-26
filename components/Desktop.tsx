'use client';

import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { PROGRAMS, getProgramConfig } from '@/config/programs';

import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import Connection from './Connection';
import ShutdownDialog from './dialogs/ShutdownDialog';

import shortcutIcon from '@/public/icons/shortcut.png';
import recycleEmpty from '@/public/icons/recycleEmpty.png';
import recycleFull from '@/public/icons/recycleFull.png';
import briefcaseImg from '@/public/icons/briefcase.png';
import explorerImg from '@/public/icons/explorer.png';
import outlookImg from '@/public/icons/outlook.png';
import notepadFile from '@/public/icons/notepadFile.png';
import directoryImg from '@/public/icons/directory.png';

export default function Desktop() {
  const wm = useWindowManager();
  const fs = useFileSystem();

  function openProgram(id: string) {
    const config = getProgramConfig(id);
    if (config) wm.open(config.id, config.initialSize);
  }

  const desktopIcons = [
    {
      id: 'recycle-icon',
      name: 'Recycle Bin',
      icon: fs.hasRecycleItems ? recycleFull : recycleEmpty,
      action: () => openProgram('recycle'),
    },
    {
      id: 'briefcase-icon',
      name: 'Briefcase',
      icon: briefcaseImg,
      action: () => openProgram('briefcase'),
    },
    {
      id: 'explorer-icon',
      name: 'Internet Explorer',
      icon: explorerImg,
      action: () => openProgram('explorer'),
    },
    {
      id: 'outlook-icon',
      name: 'Outlook',
      icon: outlookImg,
      action: () => openProgram('outlook'),
    },
    {
      id: 'about-icon',
      name: 'About.txt',
      icon: notepadFile,
      action: () => openProgram('notepad'),
    },
    {
      id: 'works-icon',
      name: 'Works',
      icon: directoryImg,
      action: () => openProgram('works'),
    },
  ];

  // Program windows (not modem, not shutdown)
  const programWindows = Object.values(wm.state.windows).filter(
    (w) => w.isOpen && w.id !== 'shutdown' && w.id !== 'modem',
  );

  return (
    <div className='h-[calc(100vh-45px)] w-screen relative'>
      {/* Desktop Icons */}
      {desktopIcons.map((item) => (
        <DesktopIcon
          key={item.id}
          name={item.name}
          icon={item.icon}
          shortcutOverlay={shortcutIcon}
          onDoubleClick={item.action}
        />
      ))}

      {/* User-created desktop files */}
      {fs.getFilesByDirectory('desktop').map((file) => (
        <DesktopIcon
          key={file.id}
          name={`${file.name}${file.type}`}
          icon={notepadFile}
          shortcutOverlay={shortcutIcon}
          onDoubleClick={() => openProgram(file.program)}
        />
      ))}

      {/* Program Windows */}
      {programWindows.map((win) => {
        const config = getProgramConfig(win.id);
        if (!config) return null;
        const BodyComponent = config.component;
        return (
          <Window key={win.id} config={config}>
            <BodyComponent windowId={win.id} />
          </Window>
        );
      })}

      {/* Modem Connection */}
      <Connection />

      {/* Shutdown Dialog */}
      {wm.getWindow('shutdown')?.isOpen && <ShutdownDialog />}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
