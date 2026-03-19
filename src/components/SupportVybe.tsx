"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, CreditCard, Bitcoin, Smartphone, QrCode, AlertTriangle } from "lucide-react";

const AMOUNTS = [
    { label: "$20", link: "https://buy.stripe.com/test_20" },
    { label: "$40", link: "https://buy.stripe.com/test_40" },
    { label: "$80", link: "https://buy.stripe.com/test_80" },
    { label: "$200", link: "https://buy.stripe.com/test_200" },
    { label: "$500", link: "https://buy.stripe.com/test_500" },
    { label: "Other", link: "https://buy.stripe.com/test_other" },
];

const CRYPTO_ASSETS = [
    { 
        name: "Bitcoin", 
        symbol: "BTC", 
        address: "bc1qfafetz3qun8n825qs23u48x2tcv0l75j7fkhy9",
        logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png"
    },
    { 
        name: "Ethereum", 
        symbol: "ETH", 
        address: "0x1AD6E7bF320D574C8cbD3E74cCa4bA26154bd15b",
        logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png"
    },
    { 
        name: "Solana", 
        symbol: "SOL", 
        address: "4PsKifmvdpNxkcjrnzqVgDiotYjPcY4wJ3g2DzRGouFD",
        logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png"
    },
];

const UPI_ID = "aquibk@fam";

export default function SupportVybe() {
    const [method, setMethod] = useState<"gateway" | "crypto" | "upi">("gateway");
    const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleProceed = () => {
        setShowPopup(true);
    };

    return (
        <section className="py-24 bg-vybe-dark relative overflow-hidden">
            {/* Payment Modal */}
            <AnimatePresence>
                {showPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPopup(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#0D1117] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-vybe-gradient" />
                            
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-vybe-purple/20 flex items-center justify-center mb-6 border border-vybe-purple/30">
                                    <AlertTriangle className="w-8 h-8 text-vybe-purple" />
                                </div>
                                
                                <h3 className="text-2xl font-black italic mb-4">Feature Unavailable</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        The direct payment gateway is currently under maintenance. 
                                        To support Vybe, please use the <span className="text-white font-bold">Crypto</span> or <span className="text-white font-bold">UPI</span> options.
                                    </p>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Direct Help</div>
                                        <div className="text-sm font-bold text-vybe-blue">aquib@vybe.pro</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowPopup(false)}
                                    className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-95"
                                >
                                    Go Back
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-vybe-purple/20 blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vybe-blue/20 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-blue border border-vybe-blue/20 px-4 py-2 rounded-full mb-6">
                        <span>✦</span> Ecosystem
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic mb-6">Support Vybe</h2>
                    <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Support the growth of Vybe. Help improve the language, expand the ecosystem, and build better developer tools. 
                        Every contribution directly supports development and future features.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    {/* Method Toggle */}
                    <div className="flex p-1.5 bg-black/40 rounded-2xl mb-12 max-w-md mx-auto relative">
                        <motion.div 
                            className="absolute bg-vybe-gradient rounded-xl shadow-lg"
                            initial={false}
                            animate={{ 
                                x: method === "gateway" ? 0 : method === "crypto" ? "100%" : "200%",
                                width: "33.33%"
                            }}
                            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            style={{ top: 6, bottom: 6 }}
                        />
                        <button 
                            onClick={() => { setMethod("gateway"); setSelectedAmount(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${method === "gateway" ? "text-white" : "text-white/40 hover:text-white/60"}`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            Gateway
                        </button>
                        <button 
                            onClick={() => setMethod("crypto")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${method === "crypto" ? "text-white" : "text-white/40 hover:text-white/60"}`}
                        >
                            <Bitcoin className="w-3.5 h-3.5" />
                            Crypto
                        </button>
                        <button 
                            onClick={() => setMethod("upi")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${method === "upi" ? "text-white" : "text-white/40 hover:text-white/60"}`}
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            UPI
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {method === "gateway" && (
                            <motion.div 
                                key="gateway"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-8">
                                    {AMOUNTS.map((amt) => (
                                        <button 
                                            key={amt.label}
                                            onClick={() => setSelectedAmount(amt.label)}
                                            className={`group p-6 rounded-2xl border transition-all text-center ${selectedAmount === amt.label ? 'bg-vybe-purple/20 border-vybe-purple shadow-[0_0_20px_rgba(127,90,240,0.2)]' : 'bg-white/[0.03] border-white/5 hover:border-vybe-purple/50 hover:bg-white/[0.05]'}`}
                                        >
                                            <div className="text-xl font-black text-white group-hover:scale-110 transition-transform mb-1">{amt.label}</div>
                                            <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold group-hover:text-vybe-purple transition-colors">
                                                {selectedAmount === amt.label ? 'Selected' : 'Select'}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {selectedAmount && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={handleProceed}
                                        className="px-12 py-4 rounded-xl bg-vybe-gradient text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Proceed with {selectedAmount}
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {method === "crypto" && (
                            <motion.div 
                                key="crypto"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4 max-w-2xl mx-auto"
                            >
                                {CRYPTO_ASSETS.map((asset) => (
                                    <div key={asset.symbol} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-vybe-blue/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center p-2 border border-white/10 overflow-hidden">
                                                <img src={asset.logo} alt={asset.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-white">{asset.name}</div>
                                                <div className="text-[10px] text-white/30 truncate max-w-[150px] md:max-w-xs font-mono mt-0.5">{asset.address}</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(asset.address, asset.symbol)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            {copied === asset.symbol ? (
                                                <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {method === "upi" && (
                            <motion.div 
                                key="upi"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="p-4 bg-white rounded-3xl mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white">
                                        <img src="/images/upi-qr.png" alt="UPI QR" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-2">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Support via UPI</div>
                                    <div className="text-xl font-black italic text-white tracking-tight">{UPI_ID}</div>
                                </div>

                                <button 
                                    onClick={() => handleCopy(UPI_ID, "upi-main")}
                                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-vybe-gradient text-white transition-all text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg mt-4"
                                >
                                    {copied === "upi-main" ? (
                                        <><Check className="w-4 h-4" /> Copied</>
                                    ) : (
                                        <><Copy className="w-4 h-4" /> Copy UPI ID</>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
