'use client';

import { SignInButton } from "@clerk/nextjs";
import { motion, Variants } from "framer-motion";
import Scene from "./Scene";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20
        }
    }
};

export default function LandingPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">

            {/* 3D Background */}
            <Scene />

            {/* Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center text-center space-y-16 max-w-4xl px-6"
            >

                {/* Hero */}
                <motion.div variants={item} className="space-y-8 backdrop-blur-sm p-8 rounded-[3rem] bg-white/10 border border-white/20 shadow-2xl shadow-rose-500/10 ring-1 ring-white/30">
                    <h1 className="text-9xl font-black tracking-tighter lowercase text-stone-800 leading-none drop-shadow-sm">
                        slap.
                    </h1>
                    <p className="text-2xl md:text-3xl text-stone-700 font-medium leading-relaxed max-w-xl mx-auto font-serif italic">
                        "Whatever you're complaining about, <br />
                        <span className="text-rose-600 font-black not-italic decoration-4 underline decoration-dotted underline-offset-8">it's your fault.</span>"
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                        { icon: "🧠", title: "Reality Check", desc: "Brutally honest analysis of your distortions." },
                        { icon: "📜", title: "Philosophy", desc: "Quotes from Nietzsche, Cioran, and realists." },
                        { icon: "💊", title: "Prescription", desc: "Book recommendations to fix your mindset." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="p-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 hover:bg-white/60 transition-all duration-300"
                        >
                            <div className="text-4xl mb-4 grayscale hover:grayscale-0 transition-all">{feature.icon}</div>
                            <h3 className="font-bold text-stone-900 text-lg uppercase tracking-wide mb-2">{feature.title}</h3>
                            <p className="text-stone-700 text-sm font-medium leading-6">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div variants={item} className="pt-4">
                    <SignInButton mode="modal">
                        <button className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-stone-900 px-12 font-medium text-white transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] focus:outline-none ring-4 ring-transparent hover:ring-rose-200">
                            <span className="mr-3 text-xl font-bold tracking-tight">Enter Reality</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </SignInButton>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-6 text-xs text-stone-500 font-mono uppercase tracking-[0.3em]"
                    >
                        Limited Access: 5 slaps / day
                    </motion.p>
                </motion.div>

            </motion.div>
        </div>
    );
}
