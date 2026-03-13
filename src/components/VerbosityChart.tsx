"use client";

import { motion } from "framer-motion";

const data = [
    { lang: "Java", loc: 45, color: "bg-red-500" },
    { lang: "C++", loc: 38, color: "bg-blue-500" },
    { lang: "Python", loc: 12, color: "bg-yellow-500" },
    { lang: "JavaScript", loc: 15, color: "bg-yellow-400" },
    { lang: "Vybe", loc: 3, color: "bg-vybe-gradient", highlighted: true },
];

export default function VerbosityChart() {
    return (
        <section className="py-24 bg-black/40 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Performance & Clarity</h2>
                    <h3 className="text-4xl md:text-5xl font-black mb-6">Built for <span className="gradient-text italic">Maximum Flow</span></h3>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
                        Vybe eliminates boilerplates. Write logic, not syntax. See how Vybe reduces verbosity by up to <span className="text-white font-bold">15x</span> compared to legacy languages.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-10">
                        {data.map((item, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <div className="flex justify-between items-end">
                                    <span className={`text-sm font-black uppercase tracking-widest ${item.highlighted ? "gradient-text" : "text-white/60"}`}>
                                        {item.lang}
                                    </span>
                                    <span className={`text-xs font-bold ${item.highlighted ? "text-white" : "text-white/30"}`}>
                                        {item.loc} Lines
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(item.loc / 45) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                                        className={`h-full rounded-full ${item.color} ${item.highlighted ? "shadow-[0_0_20px_rgba(127,90,240,0.5)]" : ""}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-12">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">The Result</h4>
                            <p className="text-white/40 text-sm leading-relaxed italic">
                                &quot;In Java, setting up a rest endpoint takes 40+ lines of config and classes. In Vybe, it&apos;s a one-liner. That&apos;s the vibe.&quot;
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-vybe-blue/5 border border-vybe-blue/20">
                            <h4 className="gradient-text font-black uppercase tracking-widest text-[10px] mb-4">Focus Mode</h4>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Less time debugging syntax errors, more time building features. Real-time productivity unlocked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
