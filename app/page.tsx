'use client';

import { useState } from 'react';
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const wordCount = input.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSlap = async () => {
    if (!input.trim()) return;
    if (wordCount > 100) {
      setError("Too many words. Nobody cares.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/slap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (res.status === 429) {
        throw new Error("You've had enough reality for today. Come back in 24 hours.");
      }
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#e6e2dd] text-[#2c3e50] relative">
      <div className="absolute top-6 right-6">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <header className="text-center space-y-2 mt-10">
          <h1 className="text-7xl font-black tracking-tighter lowercase text-stone-800">slap.</h1>
          <p className="text-stone-500 text-xs font-mono tracking-[0.2em] uppercase">The reality check you didn&apos;t ask for</p>
        </header>

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 transition-all focus-within:ring-4 focus-within:ring-rose-100/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me your sob story..."
            className="w-full h-32 resize-none bg-transparent border-none focus:ring-0 text-lg placeholder:text-stone-300 font-normal leading-relaxed"
          />
          <div className="flex justify-between items-center mt-6 border-t border-stone-100 pt-4">
            <span className={`text-xs font-mono font-bold ${wordCount > 100 ? 'text-red-500' : 'text-stone-300'}`}>
              {wordCount}/100
            </span>
            <button
              onClick={handleSlap}
              disabled={loading || !input || wordCount > 100}
              className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold text-sm tracking-wide hover:bg-black disabled:opacity-20 disabled:scale-95 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-stone-200"
            >
              {loading ? 'JUDGING...' : 'SLAP ME'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-rose-500 text-center font-mono text-xs font-bold uppercase tracking-wide bg-rose-50 py-2 rounded-lg">{error}</div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            <div className="p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3 ml-1">Reality Check</h3>
              <p className="text-lg font-medium leading-relaxed text-stone-800">{result.reality_check}</p>
            </div>

            <div className="p-6 bg-stone-100 rounded-2xl shadow-inner">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">Philosophical Slap</h3>
              <blockquote className="text-xl italic font-serif text-stone-600 leading-serif">"{result.philosophical_slap}"</blockquote>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-5">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 text-2xl font-serif shrink-0">Rx</div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">Prescription</h3>
                <p className="font-bold text-blue-900 leading-tight">{result.prescription}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
