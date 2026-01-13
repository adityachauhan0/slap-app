'use client';

import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center text-center space-y-12 max-w-2xl px-6">

            {/* Hero */}
            <div className="space-y-6">
                <h1 className="text-8xl font-black tracking-tighter lowercase text-stone-900 leading-none">
                    slap.
                </h1>
                <p className="text-xl md:text-2xl text-stone-600 font-medium leading-relaxed max-w-lg mx-auto">
                    Whatever you're complaining about, <br className="hidden md:block" />
                    <span className="text-rose-500 italic font-serif">it's probably your fault.</span>
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100/50">
                    <div className="text-2xl mb-2">🧠</div>
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide mb-1">Reality Check</h3>
                    <p className="text-stone-500 text-xs leading-5">Brutally honest analysis of your cognitive distortions.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100/50">
                    <div className="text-2xl mb-2">📜</div>
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide mb-1">Philosophy</h3>
                    <p className="text-stone-500 text-xs leading-5">Quotes from Nietzsche, Cioran, and other realists.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100/50">
                    <div className="text-2xl mb-2">💊</div>
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide mb-1">Prescription</h3>
                    <p className="text-stone-500 text-xs leading-5">Book recommendations to fix your mindset.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
                <SignInButton mode="modal">
                    <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-stone-900 px-10 font-medium text-white transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2">
                        <span className="mr-2 text-lg">Enter Reality</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                    </button>
                </SignInButton>
                <p className="mt-4 text-[10px] text-stone-400 font-mono uppercase tracking-[0.2em]">
                    5 free slaps / day
                </p>
            </div>

        </div>
    );
}
