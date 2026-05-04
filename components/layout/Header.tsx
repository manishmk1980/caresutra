import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    {/* Logo placeholder - replace with actual logo */}
                    <div className="relative h-10 w-40">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-900">CareSutra</span>
                        </div>
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="#services"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        href="#why"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Why CareSutra
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/admin/activity"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Admin
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Talk to CareSutra
                    </Button>
                </div>
            </div>
        </header>
    );
}