export default function LicensePage() {
    return (
        <div className="min-h-screen bg-vybe-dark text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-purple border border-vybe-purple/20 px-4 py-2 rounded-full mb-8">
                    <span>✦</span> Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic mb-12">MIT License</h1>

                <div className="space-y-6 text-white/70 leading-relaxed font-mono text-sm bg-white/5 p-8 rounded-2xl border border-white/10">
                    <p>Copyright (c) 2026 Vybe Core Team</p>

                    <p>
                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the &quot;Software&quot;), to deal
                        in the Software without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                        copies of the Software, and to permit persons to whom the Software is
                        furnished to do so, subject to the following conditions:
                    </p>

                    <p>
                        The above copyright notice and this permission notice shall be included in all
                        copies or substantial portions of the Software.
                    </p>

                    <p>
                        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                        SOFTWARE.
                    </p>
                </div>
            </div>
        </div>
    );
}
