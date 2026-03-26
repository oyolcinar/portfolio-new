'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { ProgramBodyProps } from '@/types';

import envelopeOpenBig from '@/public/icons/envelopeOpen.png';
import envelopeOpenIcon from '@/public/icons/envelope_open_sheet-1.png';
import printerIcon from '@/public/icons/printer-1.png';
import searchIcon from '@/public/icons/search_file.png';
import userIcon from '@/public/icons/users-1.png';
import helpSmallIcon from '@/public/icons/helpIcon.png';

export default function OutlookBody({ windowId }: ProgramBodyProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [buttonMessage, setButtonMessage] = useState('Send');
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !subject || !message) return;

    try {
      const res = await fetch('/api/sendMail', {
        body: JSON.stringify({ email, subject, message }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      if (!data.error) {
        setButtonMessage('Sent!');
      }
    } catch {
      // silent fail
    }
  }

  const toolbarBtn = 'px-[6px] py-px cursor-pointer hover:bg-[#000181] active:bg-[#000181]';
  const vSep = 'h-[26px] border-l border-l-[#393939] border-r border-r-white mx-[6px]';
  const isSent = buttonMessage === 'Sent!';

  return (
    <div className="flex flex-col h-full">
      <div className="win-separator" />

      {/* Toolbar */}
      <div className="flex items-center pl-1">
        <div className="flex items-center">
          <div className={toolbarBtn} onClick={handleSubmit}>
            <Image src={envelopeOpenIcon} alt="" height={20} />
          </div>
        </div>
        <div className={vSep} />
        <div className="flex items-center gap-0">
          <div className={toolbarBtn}>
            <Image src={printerIcon} alt="" height={20} />
          </div>
          <div className={toolbarBtn}>
            <Image src={searchIcon} alt="" height={20} />
          </div>
        </div>
        <div className={vSep} />
        <div className="flex items-center gap-0">
          <div className={toolbarBtn}>
            <Image src={userIcon} alt="" height={20} />
          </div>
          <div className={toolbarBtn}>
            <Image src={helpSmallIcon} alt="" height={20} />
          </div>
        </div>
      </div>

      <div className="win-separator" />

      {/* Form */}
      <form
        className="absolute px-px border-t-2 border-l-2 border-r-2 border-[#bdbdbd] w-full"
        style={{ height: 'calc(100% - 148px)' }}
        onSubmit={handleSubmit}
      >
        {/* Send button */}
        <button
          type="submit"
          className={`absolute right-[10px] top-[20px] w-[70px] flex flex-col items-center text-[0.55rem] cursor-pointer ${
            isSent
              ? 'bg-[#000181] text-white win-raised'
              : 'bg-[#c0c0c0] win-raised'
          }`}
        >
          <Image src={envelopeOpenBig} alt="" height={40} />
          {buttonMessage}
        </button>

        <label className="inline-block text-[0.55rem] w-[68px] pl-[7px]">To:</label>
        <input
          type="email"
          value="oyolcinar@gmail.com"
          readOnly
          className="win-input h-[21px]"
          style={{ width: 'calc(100% - 160px)' }}
        />
        <br />
        <label className="inline-block text-[0.55rem] w-[68px] pl-[7px]">From:</label>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="win-input h-[21px]"
          style={{ width: 'calc(100% - 160px)' }}
        />
        <br />
        <label className="inline-block text-[0.55rem] w-[68px] pl-[7px]">Subject:</label>
        <input
          ref={subjectRef}
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="win-input h-[21px] mb-[10px]"
          style={{ width: 'calc(100% - 160px)' }}
        />

        <div className="win-sunken flex-1" style={{ width: 'calc(100% - 1px)', height: 'calc(100% + 26px)' }}>
          <textarea
            ref={messageRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-full border-none outline-none text-[0.6rem] tracking-wide overflow-auto resize-none win-scrollbar box-border"
          />
        </div>
      </form>
    </div>
  );
}
