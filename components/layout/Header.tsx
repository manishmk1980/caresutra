"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
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
        <header className="sticky top-0 z-50 w-full min-w-0 border-b border-soft-gold/30 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
            <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:gap-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex min-w-0 shrink items-center">
                    <div className="relative h-10 w-[132px] shrink-0 sm:h-12 sm:w-[168px] md:h-14 md:w-[220px] lg:h-16 lg:w-[250px]">
                        <Image
                            src="/caresutra-hr-logo.svg"
                            alt="CareSutra Logo"
                            fill
                            className="object-contain object-left"
                            priority
                            sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 250px"
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
                    {isAdminAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => void handleLogout()}
                            disabled={isLoggingOut}
                            aria-label="Logout"
                            title="Logout"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-soft-gold/50 text-charcoal hover:text-trust-blue hover:border-trust-blue/50 transition-colors disabled:opacity-60"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    ) : null}
                    <Button
                        asChild
                        className="bg-trust-blue hover:bg-support-blue text-white rounded-full px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:ring-offset-2"
                    >
                        <TrackedBookAppointmentLink location="header">
                            Book Appointment
                        </TrackedBookAppointmentLink>
                    </Button>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="shrink-0 p-2 text-charcoal hover:text-trust-blue lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-soft-gold/20 bg-ivory lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-3 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
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
                            >
                                <TrackedBookAppointmentLink
                                    location="header"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Book Appointment
                                </TrackedBookAppointmentLink>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}