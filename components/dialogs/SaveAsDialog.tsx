'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useDraggable } from '@/hooks/useDraggable';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useProgramData } from '@/contexts/ProgramDataContext';

import closeIcon from '@/public/icons/close.png';
import downArrowIcon from '@/public/icons/downArrow.png';
import desktopIcon from '@/public/icons/desktop.png';
import briefcaseIconImg from '@/public/icons/briefcaseIcon.png';
import favoritesIcon from '@/public/icons/directoryFavorites.png';

interface SaveAsDialogProps {
  windowId: string;
  programType: 'notepad' | 'paint';
  isSaveMode: boolean; // true = Save As, false = Open
  onClose: () => void;
  onSaveComplete?: () => void;
  onOpenFile?: (fileId: string) => void;
}

export default function SaveAsDialog({
  windowId,
  programType,
  isSaveMode,
  onClose,
  onSaveComplete,
  onOpenFile,
}: SaveAsDialogProps) {
  const { containerStyle, handleProps } = useDraggable();
  const fs = useFileSystem();
  const pd = useProgramData();

  const [fileName, setFileName] = useState('');
  const [directory, setDirectory] = useState<'desktop' | 'briefcase'>(
    'desktop',
  );
  const [showDirDropdown, setShowDirDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState(
    programType === 'notepad' ? '.txt' : '.bmp',
  );
  const [selectedFileId, setSelectedFileId] = useState('');

  const typeLabels: Record<string, string> = {
    '.txt': 'Text Documents (*.txt)',
    '.bmp': 'Bitmap Files (*.bmp)',
    '.jpg': 'JPG Files (*.jpg)',
    '.jpeg': 'JPEG Files (*.jpeg)',
    all: 'All Documents (*)',
  };

  // Get files filtered by type and directory
  const filteredFiles =
    selectedFileType === 'all'
      ? fs.getFilesByDirectory(directory)
      : fs.getFilesByType(selectedFileType, directory);

  function handleSave() {
    if (!fileName.trim()) return;
    const data = pd.getData(windowId);
    const result = fs.saveFile(
      fileName,
      selectedFileType,
      data.text,
      directory,
      programType,
    );
    if (result.success) {
      pd.setFileTitle(windowId, fileName + selectedFileType);
      pd.setFileId(windowId, result.id);
      pd.setIsSaved(windowId, true);
      onSaveComplete?.();
      onClose();
    } else if (result.duplicate) {
      // File exists — could show overwrite prompt; for now just alert
      // The old code triggered setSaveNameSameNotepad here
      alert(`'${fileName}${selectedFileType}' already exists.`);
    }
  }

  function handleOpen() {
    if (!selectedFileId) return;
    onOpenFile?.(selectedFileId);
    onClose();
  }

  const btnClass =
    'win-btn w-[100px] cursor-pointer text-[0.55rem] font-[Win95]';

  return (
    <div
      className='absolute z-[50] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      style={containerStyle}
    >
      <div className='win-raised bg-[#c0c0c0] w-[600px]'>
        {/* Title bar */}
        <div {...handleProps} className='win-titlebar'>
          <div
            className='text-[0.73rem] text-white pb-[5px]'
            style={{ fontFamily: "'Win95 Bold', sans-serif" }}
          >
            {isSaveMode ? 'Save As' : 'Open'}
          </div>
          <div className='ml-0.5'>
            <Image
              alt='close'
              src={closeIcon}
              height={23}
              className='cursor-pointer'
              onClick={onClose}
            />
          </div>
        </div>

        {/* Body */}
        <div className='flex flex-col p-0 text-[0.55rem]'>
          {/* Directory selector row */}
          <div className='flex items-center mt-[10px] mb-[10px] ml-[12px]'>
            <div className='w-[100px]'>
              {isSaveMode ? 'Save' : 'Look'}{' '}
              <span className='underline'>i</span>n:
            </div>
            <div
              className='flex h-[24px] w-[330px] items-center bg-white'
              style={{
                border: '2px inset #393939',
                borderBottom: 'white',
                borderRight: 'white',
              }}
            >
              <div
                className='flex-1 flex items-center gap-1 px-1 cursor-pointer h-full hover:text-white hover:bg-[#000181]'
                onClick={() => setShowDirDropdown((p) => !p)}
              >
                <Image
                  src={directory === 'desktop' ? desktopIcon : briefcaseIconImg}
                  alt=''
                  height={18}
                />
                <span>{directory === 'desktop' ? 'Desktop' : 'Briefcase'}</span>
              </div>
              <div
                className='flex justify-center items-center h-[22px] w-[20px] cursor-pointer'
                style={{
                  border: '2px solid #393939',
                  borderTopColor: 'white',
                  borderLeftColor: 'white',
                }}
                onClick={() => setShowDirDropdown((p) => !p)}
              >
                <Image src={downArrowIcon} alt='' height={12} />
              </div>
            </div>
            <div className='flex ml-[10px]'>
              <div
                className='flex justify-center items-center h-[24px] w-[24px] cursor-pointer'
                style={{
                  border: '2px solid #393939',
                  borderTopColor: 'white',
                  borderLeftColor: 'white',
                }}
              >
                <Image src={favoritesIcon} height={18} alt='' />
              </div>
              <div
                className='flex justify-center items-center h-[24px] w-[24px] cursor-pointer ml-[2px]'
                style={{
                  border: '2px solid #393939',
                  borderTopColor: 'white',
                  borderLeftColor: 'white',
                }}
              >
                <Image src={desktopIcon} height={18} alt='' />
              </div>
            </div>
          </div>

          {/* Directory dropdown */}
          {showDirDropdown && (
            <div
              className='absolute top-[68px] left-[112px] bg-white w-[312px] h-[25px] flex items-center px-1 cursor-pointer hover:text-white hover:bg-[#000181]'
              style={{
                border: '2px solid #c0c0c0',
                borderTop: 'none',
                borderLeftColor: '#393939',
              }}
              onClick={() => {
                setDirectory(directory === 'desktop' ? 'briefcase' : 'desktop');
                setShowDirDropdown(false);
              }}
            >
              <Image
                src={directory === 'desktop' ? briefcaseIconImg : desktopIcon}
                alt=''
                height={18}
              />
              <span className='ml-1'>
                {directory === 'desktop' ? 'Briefcase' : 'Desktop'}
              </span>
            </div>
          )}

          {/* File list area */}
          <div
            className='ml-[10px] mb-[10px] h-[200px] bg-white overflow-y-auto'
            style={{
              width: 'calc(100% - 20px)',
              border: '2px inset #393939',
              borderBottomColor: 'white',
              borderRightColor: 'white',
            }}
          >
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`px-2 py-[2px] cursor-pointer flex items-center ${
                  selectedFileId === file.id
                    ? 'bg-[#000181] text-white'
                    : 'hover:bg-[#000181] hover:text-white'
                }`}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setFileName(file.name);
                }}
                onDoubleClick={() => {
                  if (!isSaveMode) {
                    setSelectedFileId(file.id);
                    onOpenFile?.(file.id);
                    onClose();
                  }
                }}
              >
                {file.name}
                {file.type}
              </div>
            ))}
          </div>

          {/* Bottom: filename + type + buttons */}
          <div className='flex'>
            <div className='flex flex-col ml-[12px] mr-[30px] mb-[10px] mt-[5px]'>
              {/* File name */}
              <div className='flex items-center mb-[10px]'>
                <div className='w-[100px]'>
                  File <span className='underline'>n</span>ame:
                </div>
                <input
                  type='text'
                  className='win-input h-[24px] w-[330px]'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>

              {/* File type */}
              <div className='flex items-center relative'>
                <div className='w-[100px]'>
                  {isSaveMode ? 'Save as' : 'Files of'}{' '}
                  <span className='underline'>t</span>ype:
                </div>
                <div
                  className='flex h-[24px] w-[330px] items-center bg-white'
                  style={{
                    border: '2px inset #393939',
                    borderBottom: 'white',
                    borderRight: 'white',
                  }}
                >
                  <div
                    className='flex-1 px-1 cursor-pointer h-full flex items-center'
                    onClick={() => setShowTypeDropdown((p) => !p)}
                  >
                    {typeLabels[selectedFileType] || selectedFileType}
                  </div>
                  <div
                    className='flex justify-center items-center h-[22px] w-[20px] cursor-pointer'
                    style={{
                      border: '2px solid #393939',
                      borderTopColor: 'white',
                      borderLeftColor: 'white',
                    }}
                    onClick={() => setShowTypeDropdown((p) => !p)}
                  >
                    <Image src={downArrowIcon} alt='' height={12} />
                  </div>
                </div>

                {/* Type dropdown */}
                {showTypeDropdown && (
                  <div
                    className='absolute top-[28px] left-[100px] bg-white w-[312px] z-10'
                    style={{
                      border: '2px solid #c0c0c0',
                      borderTop: 'none',
                      borderLeftColor: '#393939',
                    }}
                  >
                    {Object.entries(typeLabels)
                      .filter(([key]) => {
                        if (programType === 'notepad') return key === '.txt';
                        if (programType === 'paint')
                          return ['.bmp', '.jpg', '.jpeg'].includes(key);
                        return true;
                      })
                      .filter(([key]) => key !== selectedFileType)
                      .map(([key, label]) => (
                        <div
                          key={key}
                          className='px-1 py-[2px] cursor-pointer hover:bg-[#000181] hover:text-white'
                          onClick={() => {
                            setSelectedFileType(key);
                            setShowTypeDropdown(false);
                          }}
                        >
                          {label}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex flex-col gap-[10px] mt-[5px] mb-[10px]'>
              <button
                className={btnClass}
                onClick={isSaveMode ? handleSave : handleOpen}
              >
                <span className='underline'>{isSaveMode ? 'S' : 'O'}</span>
                {isSaveMode ? 'ave' : 'pen'}
              </button>
              <button className={btnClass} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
