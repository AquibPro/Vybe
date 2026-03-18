export default function LicensePage() {
    return (
        <div className="min-h-screen bg-vybe-dark text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-purple border border-vybe-purple/20 px-4 py-2 rounded-full mb-8">
                    <span>✦</span> Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic mb-12">Vybe Software License</h1>

                <div className="space-y-6 text-white/70 leading-relaxed font-mono text-sm bg-white/5 p-8 rounded-2xl border border-white/10">
                    <p>Copyright (c) 2026 Vybe Core Team. All Rights Reserved.</p>

                    <h2 className="text-white font-bold mt-8 mb-4 uppercase tracking-wider">1. Grant of License</h2>
                    <p>
                        Vybe is provided as a tool for software development. You are granted a limited, non-exclusive, non-transferable license to use Vybe for the purpose of developing, compiling, and running software applications.
                    </p>

                    <h2 className="text-white font-bold mt-8 mb-4 uppercase tracking-wider">2. Restrictions</h2>
                    <p>
                        You are strictly prohibited from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Modifying, reverse-engineering, or altering the Vybe compiler, runtime, or core libraries.</li>
                        <li>Claiming ownership of the Vybe programming language, its syntax, or its underlying technology.</li>
                        <li>Copying, redistributing, or selling the Vybe software itself as a standalone product or under a different name.</li>
                        <li>Using Vybe to create a fork or derivative programming language that competes with Vybe.</li>
                    </ul>

                    <h2 className="text-white font-bold mt-8 mb-4 uppercase tracking-wider">3. Ownership</h2>
                    <p>
                        The Vybe programming language, including its compiler, documentation, and brand, remains the sole property of the Vybe Core Team. Using Vybe to build applications does not grant you any rights to the language itself.
                    </p>

                    <p className="mt-12 pt-8 border-t border-white/10 italic">
                        By using Vybe, you agree to these terms. Failure to comply will result in the immediate termination of your license to use the software.
                    </p>
                </div>
            </div>
        </div>
    );
}
