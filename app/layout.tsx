import type { Metadata } from 'next';
import { WindowManagerProvider } from '@/contexts/WindowManagerContext';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { ProgramDataProvider } from '@/contexts/ProgramDataContext';
import './globals.css';

export const metadata: Metadata = {
  title: "Olgun Yolçınar's Desktop",
  description: 'Web Developer based in Turkey.',
  keywords: 'Web Development, Next.js, React, Front-End, Olgun Yolçınar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <WindowManagerProvider>
          <FileSystemProvider>
            <ProgramDataProvider>{children}</ProgramDataProvider>
          </FileSystemProvider>
        </WindowManagerProvider>
      </body>
    </html>
  );
}
