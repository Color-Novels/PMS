'use client';

import React, {useEffect} from 'react';
import {useActionState} from 'react';
import {login} from "@/app/lib/auth";
import {Mail, Lock} from 'lucide-react';
import {Input} from "@/components/ui/input";

function LoginForm() {
    const [state, action, pending] = useActionState(login, '');
    // Clear LocalStorage on mount
    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <form action={action} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400"/>
                    </div>
                    <Input
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {/* Error message */}
            {state && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                    {state}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 relative overflow-hidden"
            >
                <span className={`flex items-center justify-center ${pending ? 'opacity-0' : 'opacity-100'}`}>
                    Sign In
                </span>
                {pending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    </div>
                )}
            </button>
        </form>
    );
}

export default LoginForm;