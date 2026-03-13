"use client";

import { motion } from "framer-motion";
import { Cpu, Globe, Infinity, Layout, Package, Send } from "lucide-react";

const features = [
    {
        icon: Layout,
        title: "Expressive Syntax",
        description: "Built for speed and readability. Code that feels as natural as writing in your journal."
    },
    {
        icon: Cpu,
        title: "Modern Runtime",
        description: "Blazing fast execution with memory safety and zero-cost abstractions built right in."
    },
    {
        icon: Send,
        title: "Async First",
        description: "Handles concurrency with a beautiful await-less syntax that keeps your code clean."
    },
    {
        icon: Infinity,
        title: "Pattern Matching",
        description: "Powerful destructuring and pattern matching for complex data structures."
    },
    {
        icon: Package,
        title: "Built-in Tooling",
        description: "Package manager, formatter, and test runner all included in the single binary CLI."
    },
    {
        icon: Globe,
        title: "Rich Ecosystem",
        description: "First-class vs-code extensions, extensive documentation, and a thriving community."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Features</h2>
                    <h3 className="text-4xl md:text-5xl font-black mb-6">Standard Tools, <br /><span className="gradient-text italic">Elite Experience</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-vybe-gradient opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl" />
                            <div className="glass p-8 md:p-10 rounded-3xl h-full border border-white/5 group-hover:border-white/20 transition-all duration-500 relative flex flex-col items-start overflow-hidden">
                                <div className="p-3 rounded-2xl bg-white/5 mb-6 group-hover:bg-vybe-purple/20 transition-colors duration-500">
                                    <feature.icon className="w-6 h-6 text-white group-hover:text-vybe-blue transition-colors duration-500" />
                                </div>
                                <h4 className="text-xl font-bold mb-4 text-white">{feature.title}</h4>
                                <p className="text-white/40 leading-relaxed text-sm group-hover:text-white/60 transition-colors duration-500">{feature.description}</p>

                                {/* Micro-glow in corner */}
                                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-vybe-blue/5 blur-xl group-hover:bg-vybe-blue/20 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
