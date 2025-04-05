import React from 'react';
import {ShieldOff, ArrowLeft, LogOut} from 'lucide-react';
import Link from 'next/link';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Unauthorized Access",
    description: "Unauthorized Access",
};

export default function UnauthorizedPage() {
    return (
        <div className="h-full flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.2]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(239 68 68 / 0.2) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}/>

            <div
                className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-red-100 text-center relative">
                {/* Icon Container */}
                <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6 ring-8 ring-red-50">
                    <ShieldOff className="h-8 w-8 text-red-600 animate-pulse"/>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Unauthorized Access
                </h1>

                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
                    <p className="text-gray-700">
                        Sorry, you don&#39;t have permission to access this page. Please contact your administrator if you
                        think this is a mistake.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"/>
                        Return to Dashboard
                    </Link>

                    <Link
                        href='/logout'
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-2"/>
                        Sign in with different account
                    </Link>
                </div>
            </div>
        </div>
    );
}