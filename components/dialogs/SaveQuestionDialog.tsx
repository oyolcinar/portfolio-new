'use client';

import Image from 'next/image';
import { useDraggable } from '@/hooks/useDraggable';

import closeIcon from '@/public/icons/close.png';
import questionIcon from '@/public/icons/question.png';

interface SaveQuestionDialogProps {
  title: string;
  fileTitle: string;
  onYes: () => void;
  onNo: () => void;
  onCancel: () => void;
}

export default function SaveQuestionDialog({
  title,
  fileTitle,
  onYes,
  onNo,
  onCancel,
}: SaveQuestionDialogProps) {
  const { containerStyle, handleProps } = useDraggable();

  const btnClass =
    'win-btn w-[100px] cursor-pointer text-[0.55rem] font-[Win95]';

  return (
    <div
      className='absolute z-[60] left-1/2 top-[200px] -translate-x-1/2'
      style={containerStyle}
    >
      <div className='win-raised bg-[#c0c0c0] w-[400px]'>
        {/* Title bar */}
        <div {...handleProps} className='win-titlebar'>
          <div
            className='text-[0.73rem] text-white pb-[5px]'
            style={{ fontFamily: "'Win95 Bold', sans-serif" }}
          >
            {title}
          </div>
          <div className='ml-0.5'>
            <Image
              alt='close'
              src={closeIcon}
              height={23}
              className='cursor-pointer'
              onClick={onCancel}
            />
          </div>
        </div>

        {/* Body */}
        <div
          className='flex p-[10px] text-[0.55rem]'
          style={{ border: '2px solid #bdbdbd' }}
        >
          <div className='flex items-start mr-[10px]'>
            <Image src={questionIcon} alt='' height={45} />
          </div>
          <div>
            Do you want to save changes to &apos;{fileTitle || 'Untitled'}
            &apos;?
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-center gap-[10px] ml-[50px] mb-[10px]'>
          <button className={btnClass} onClick={onYes}>
            <span className='underline'>Y</span>es
          </button>
          <button className={btnClass} onClick={onNo}>
            N<span className='underline'>o</span>
          </button>
          <button className={btnClass} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
