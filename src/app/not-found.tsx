import React from 'react';
import {FileQuestion, ArrowLeft, Stethoscope} from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPublic() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-md shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Link href="/" className="flex items-center">
                        <Stethoscope className="h-8 w-8 text-primary-500"/>
                        <span className="ml-2 text-xl font-bold text-gray-900">
                            MediPanel
                        </span>
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div
                    className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                        <FileQuestion className="h-8 w-8 text-blue-600"/>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Page Not Found
                    </h1>

                    <p className="text-gray-600 mb-8">
                        The page you&#39;re looking for doesn&#39;t exist or has been moved. Please check the URL and try again.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2"/>
                            Back to Home
                        </Link>

                        <Link
                            href="/login"
                            className="inline-block w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            © 2025 ColorNovels. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}