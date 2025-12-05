"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { memo } from "react";

const HeroSection = memo(function HeroSection() {
    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center md:bg-fixed" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-gray-900/30 to-background animate-background-pan z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 max-w-5xl px-4 flex flex-col items-center"
            >
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 animate-text-shine bg-[200%_auto]">
                    Halali Meat Ltd.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300/80 max-w-2xl">
                    Sourced from the lush pastoral lands of East Africa,
                    delivered with uncompromising quality and faith.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/products">Explore Products</Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </motion.div>
        </section>
    );
});

export default HeroSection;
