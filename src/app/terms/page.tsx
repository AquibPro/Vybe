export default function TermsPage() {
    return (
        <div className="min-h-screen bg-vybe-dark text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-purple border border-vybe-purple/20 px-4 py-2 rounded-full mb-8">
                    <span>✦</span> Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic mb-12">Terms of Service</h1>

                <div className="space-y-8 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing this website and utilizing the Vybe programming language, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Use of Language</h2>
                        <p>
                            Vybe is provided &quot;as is&quot;, without warranty of any kind. We are not liable for any damages or losses arising from your use of the language, interpreter, or compiled binaries in any environment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Community Guidelines</h2>
                        <p>
                            Users participating in our community ecosystems (Discord, GitHub, etc.) must maintain respectful conduct. We reserve the right to remove individuals who violate community standards.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
