import React from "react";
import Link from "next/link";
import {Stethoscope} from "lucide-react";

export default function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="h-screen  overflow-y-auto w-full bg-gradient-to-b from-blue-50 to-white flex flex-col">
            {/* Fixed Header */}
            <header className="bg-white/70 backdrop-blur-md sticky top-0 shadow-sm z-10">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Link href="/" className="flex items-center">
                        <Stethoscope className="h-8 w-8 text-blue-600"/>
                        <span className="ml-2 text-xl font-bold text-gray-900">
                            MediPanel
                        </span>
                    </Link>
                </nav>
            </header>
            {/* Main content with padding to account for fixed header */}
            <div className="flex flex-col h-full">
                <div className={'flex-grow'}>
                    {children}
                </div>
                <footer className="bg-gray-50">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                © 2025 ColorNovels. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}