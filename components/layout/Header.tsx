"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Services", href: "#services" },
        { label: "Why CareSutra", href: "#why" },
        { label: "Contact", href: "#contact" },
        { label: "Admin Login", href: "/admin/activity" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-soft-gold/30 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center">
                    <div className="relative w-[200px] h-14 md:w-[250px] md:h-17">
                        <Image
                            src="/caresutra-hr-logo.svg"
                            alt="CareSutra Logo"
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 200px, 250px"
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-charcoal hover:text-trust-blue transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-heritage-gold group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <Button
                        className="bg-trust-blue hover:bg-support-blue text-white rounded-full px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:ring-offset-2"
                    >
                        Talk to CareSutra
                    </Button>
                </div>

                {/* Mobile menu button */}
                <button
                    className="lg:hidden p-2 text-charcoal hover:text-trust-blue"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-soft-gold/20 bg-ivory">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="block py-3 text-base font-medium text-charcoal hover:text-trust-blue hover:bg-soft-gold/10 rounded-xl px-4 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-soft-gold/20">
                            <Button
                                className="w-full bg-trust-blue hover:bg-support-blue text-white rounded-xl py-3 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Talk to CareSutra
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}