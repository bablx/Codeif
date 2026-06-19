'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileMenuProps {
  name: string;
  email: string;
  avatarColor?: string;
}

export default function ProfileMenu({ name, email, avatarColor = 'bg-[#7030E0]' }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sf_user');
    localStorage.removeItem('sf_solved');
    window.location.href = '/login';
  };

  const handleSettings = () => {
    setOpen(false);
    router.push('/settings');
  };

  // Read solved count from localStorage
  const solvedCount = (() => {
    try {
      const raw = localStorage.getItem('sf_solved');
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch { return 0; }
  })();

  return (
    <div className="relative z-[100]" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/70 transition-colors border border-transparent hover:border-gray-700"
      >
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white/10`}>
          {initial}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-white text-sm font-semibold leading-tight">{name || 'Engineer'}</div>
          <div className="text-gray-500 text-xs leading-tight truncate max-w-[140px]">{email || ''}</div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl shadow-black/80 z-[100] overflow-hidden">
          {/* Profile header */}
          <div className="px-4 py-4 bg-gradient-to-br from-[#7030E0]/20 to-transparent border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-white/10`}>
                {initial}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{name || 'Engineer'}</div>
                <div className="text-gray-400 text-xs truncate max-w-[140px]">{email}</div>
              </div>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/30 rounded-lg px-3 py-2 text-center border border-gray-800">
                <div className="text-[#7030E0] font-bold text-lg leading-none">{solvedCount}</div>
                <div className="text-gray-500 text-xs mt-0.5">Solved</div>
              </div>
              <div className="bg-black/30 rounded-lg px-3 py-2 text-center border border-gray-800">
                <div className="text-amber-400 font-bold text-lg leading-none">—</div>
                <div className="text-gray-500 text-xs mt-0.5">Rank</div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Settings
            </button>
          </div>

          <div className="border-t border-gray-800 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
