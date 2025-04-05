import React from 'react';
import {FileQuestion, ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Page Not Found",
    description: "Page Not Found",
};

export default function NotFoundApp() {
    return (
        <div className="h-full flex items-center justify-center p-4">
            <div
                className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                    <FileQuestion className="h-8 w-8 text-blue-600"/>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Page Not Found
                </h1>

                <p className="text-gray-600 mb-8">
                    The page you&#39;re looking for doesn&#39;t exist or has been moved. Please check the URL and try
                    again.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2"/>
                        Return to Dashboard
                    </Link>

                    <Link
                        href="/"
                        className="inline-block w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}