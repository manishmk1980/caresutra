import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold">C</span>
                            </div>
                            <span className="text-xl font-bold text-blue-900">CareSutra</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Har Zarurat Ka Sahi Margdarshan
                        </p>
                        <p className="text-gray-500 text-sm">
                            Aapke saath, har kadam.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#services" className="hover:text-blue-600">
                                    Insurance
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="hover:text-blue-600">
                                    Loans
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="hover:text-blue-600">
                                    Health Services
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#why" className="hover:text-blue-600">
                                    Why CareSutra
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:text-blue-600">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/activity" className="hover:text-blue-600">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Email: info@caresutra.com</li>
                            <li>Phone: +91 98765 43210</li>
                            <li>Address: Delhi, India</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} CareSutra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}