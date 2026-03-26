import type { ProgramConfig } from '@/types';

import NotepadBody from '@/components/programs/NotepadBody';
import PaintBody from '@/components/programs/PaintBody';
import ExplorerBody from '@/components/programs/ExplorerBody';
import BriefcaseBody from '@/components/programs/BriefcaseBody';
import OutlookBody from '@/components/programs/OutlookBody';
import HelpBody from '@/components/programs/HelpBody';
import RecycleBody from '@/components/programs/RecycleBody';
import WorksBody from '@/components/programs/WorksBody';
import MinesweeperBody from '@/components/programs/MinesweeperBody';

import notepadIcon from '@/public/icons/notepad.png';
import paintIcon from '@/public/icons/paint.png';
import explorerIcon from '@/public/icons/explorer.png';
import briefcaseIcon from '@/public/icons/briefcaseIcon.png';
import outlookIcon from '@/public/icons/outlookIcon.png';
import minesweeperIcon from '@/public/icons/minesweeper.png';
import helpIcon from '@/public/icons/helpIcon.png';
import recycleIconEmpty from '@/public/icons/recycleIconEmpty.png';
import directoryIcon from '@/public/icons/directoryIcon.png';

export const PROGRAMS: ProgramConfig[] = [
  {
    id: 'notepad',
    title: 'Notepad',
    icon: notepadIcon,
    initialSize: { w: 400, h: 500 },
    smallSize: { w: 300, h: 400 },
    saveable: true,
    opennable: true,
    hasMenuBar: true,
    titled: true,
    component: NotepadBody,
  },
  {
    id: 'paint',
    title: 'MS Paint',
    icon: paintIcon,
    initialSize: { w: 800, h: 600 },
    smallSize: { w: 300, h: 400 },
    saveable: true,
    opennable: true,
    hasMenuBar: true,
    titled: true,
    component: PaintBody,
  },
  {
    id: 'explorer',
    title: 'Internet Explorer',
    icon: explorerIcon,
    initialSize: { w: 800, h: 600 },
    smallSize: { w: 300, h: 300 },
    saveable: false,
    opennable: false,
    hasMenuBar: true,
    titled: false,
    component: ExplorerBody,
  },
  {
    id: 'briefcase',
    title: 'Briefcase',
    icon: briefcaseIcon,
    initialSize: { w: 800, h: 600 },
    smallSize: { w: 300, h: 300 },
    saveable: false,
    opennable: true,
    hasMenuBar: true,
    titled: false,
    component: BriefcaseBody,
  },
  {
    id: 'outlook',
    title: 'Outlook',
    icon: outlookIcon,
    initialSize: { w: 600, h: 400 },
    smallSize: { w: 300, h: 400 },
    saveable: false,
    opennable: false,
    hasMenuBar: true,
    titled: true,
    component: OutlookBody,
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: minesweeperIcon,
    initialSize: { w: 400, h: 500 },
    smallSize: { w: 300, h: 400 },
    saveable: false,
    opennable: false,
    hasMenuBar: true,
    titled: false,
    component: MinesweeperBody,
  },
  {
    id: 'help',
    title: 'Help',
    icon: helpIcon,
    initialSize: { w: 400, h: 350 },
    smallSize: { w: 300, h: 300 },
    saveable: false,
    opennable: false,
    hasMenuBar: false,
    titled: false,
    component: HelpBody,
  },
  {
    id: 'recycle',
    title: 'Recycle Bin',
    icon: recycleIconEmpty,
    initialSize: { w: 400, h: 300 },
    smallSize: { w: 300, h: 300 },
    saveable: false,
    opennable: false,
    hasMenuBar: true,
    titled: false,
    component: RecycleBody,
  },
  {
    id: 'works',
    title: 'Works',
    icon: directoryIcon,
    initialSize: { w: 800, h: 600 },
    smallSize: { w: 300, h: 300 },
    saveable: false,
    opennable: true,
    hasMenuBar: true,
    titled: false,
    component: WorksBody,
  },
];

export function getProgramConfig(id: string): ProgramConfig | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
