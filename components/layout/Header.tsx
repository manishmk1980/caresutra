"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        async function loadSession() {
            try {
                const res = await fetchWithTimeout("/api/admin/session");
                const data = (await res.json().catch(() => ({}))) as { authenticated?: boolean };
                if (!mounted) return;
                setIsAdminAuthenticated(Boolean(data.authenticated));
            } catch {
                if (!mounted) return;
                setIsAdminAuthenticated(false);
            }
        }
        void loadSession();
        return () => {
            mounted = false;
        };
    }, []);

    const navItems = useMemo(
        () => [
            { label: "Services", href: "/#services" },
            { label: "Why CareSutra", href: "/#why" },
            { label: "Contact", href: "/#contact" },
            isAdminAuthenticated
                ? { label: "Customer Records", href: "/admin/activity" }
                : { label: "Admin Login", href: "/admin/login" },
        ],
        [isAdminAuthenticated],
    );

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await fetchWithTimeout("/api/admin/logout", { method: "POST" });
            setIsAdminAuthenticated(false);
            setMobileMenuOpen(false);
            router.push("/admin/login");
            router.refresh();
        } catch {
            setIsLoggingOut(false);
            return;
        }
        setIsLoggingOut(false);
    }

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
                    {isAdminAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => void handleLogout()}
                            disabled={isLoggingOut}
                            className="inline-flex items-center gap-2 text-sm font-medium text-charcoal hover:text-trust-blue transition-colors disabled:opacity-60"
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                    ) : null}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <Button
                        asChild
                        className="bg-trust-blue hover:bg-support-blue text-white rounded-full px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:ring-offset-2"
                    >
                        <Link href="/#contact">Talk to CareSutra</Link>
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
                        {isAdminAuthenticated ? (
                            <button
                                type="button"
                                onClick={() => void handleLogout()}
                                disabled={isLoggingOut}
                                className="w-full rounded-xl px-4 py-3 text-left text-base font-medium text-charcoal hover:text-trust-blue hover:bg-soft-gold/10 transition-colors disabled:opacity-60"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </span>
                            </button>
                        ) : null}
                        <div className="pt-4 border-t border-soft-gold/20">
                            <Button
                                asChild
                                className="w-full bg-trust-blue hover:bg-support-blue text-white rounded-xl py-3 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link href="/#contact">Talk to CareSutra</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}