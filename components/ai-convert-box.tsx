'use client';

import Link from 'next/link';
import { Copy, Mic, Search, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { parseNaturalLanguage } from '@/lib/ai/parser';

const examples = [
  'Convert 6 foot 2 to cm',
  'How many bags of cement for 20 square meters?',
  'Convert diesel consumption from liters per hectare to liters per acre',
  'Convert Namibian dollars to South African rand'
];

export function AiConvertBox() {
  const [query, setQuery] = useState(examples[0]);
  const suggestions = useMemo(() => parseNaturalLanguage(query), [query]);
  const best = suggestions[0];

  async function copyResult() {
    if (best?.message) await navigator.clipboard?.writeText(best.message);
  }

  async function shareResult() {
    if (navigator.share && best?.message) {
      await navigator.share({ title: 'FieldConvert result', text: best.message, url: best.href ? location.origin + best.href : location.href });
    }
  }

  function voiceInput() {
    const SpeechRecognition = window.webkitSpeechRecognition ?? window.SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-ZA';
    recognition.onresult = (event: SpeechRecognitionEvent) => setQuery(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <section id="ai" className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-field">AI conversion input</p>
          <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">Ask in plain language</h2>
        </div>
        <button onClick={voiceInput} className="grid h-11 w-11 place-items-center rounded-lg bg-field text-white" aria-label="Use voice input">
          <Mic size={20} />
        </button>
      </div>
      <div className="sticky top-[65px] z-20 mt-4 rounded-lg bg-white pb-2 dark:bg-slate-950">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-14 w-full rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-base outline-none ring-field/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Convert, calculate or ask a field question"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button key={example} onClick={() => setQuery(example)} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">
            {example}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.message} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-ink dark:text-white">{suggestion.message}</p>
              <span className="rounded bg-field/10 px-2 py-1 text-xs font-black text-field">{Math.round(suggestion.confidence * 100)}%</span>
            </div>
            <div className="mt-3 flex gap-2">
              {suggestion.href ? (
                <Link href={suggestion.href} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-ink">
                  Open
                </Link>
              ) : null}
              <button onClick={copyResult} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700" aria-label="Copy result">
                <Copy size={18} />
              </button>
              <button onClick={shareResult} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700" aria-label="Share result">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
