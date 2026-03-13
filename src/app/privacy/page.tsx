export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-vybe-dark text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-purple border border-vybe-purple/20 px-4 py-2 rounded-full mb-8">
                    <span>✦</span> Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic mb-12">Privacy Policy</h1>

                <div className="space-y-8 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p>
                            Vybe CLI executes entirely locally on your machine. We do not collect, store, or transmit any telemetry, source code, or personal data from your use of the language or toolchain.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Website Analytics</h2>
                        <p>
                            This website may use fundamental analytics to understand traffic patterns and improve the developer experience. This data is strictly anonymized and cannot be used to identify you personally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Links</h2>
                        <p>
                            Our documentation and community hubs (e.g., Discord or GitHub) contain links to third-party sites. We are not responsible for the privacy practices of those platforms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
