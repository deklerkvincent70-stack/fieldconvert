'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextDark = stored ? stored === 'dark' : prefersDark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-ink/95">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-field text-lg font-black text-white">FC</span>
          <span className="text-lg font-black text-ink dark:text-white">FieldConvert</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-bold text-slate-700 dark:text-slate-300 md:flex">
          <Link href="/convert/hectare-to-acre">Land</Link>
          <Link href="/construction/concrete-calculator">Concrete</Link>
          <Link href="/farming/crop-spacing-calculator">Farming</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <button
          onClick={toggleTheme}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 md:ml-2"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
