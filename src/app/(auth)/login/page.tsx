import React from 'react';
import Link from "next/link";
import LoginForm from "@/app/(auth)/login/_componets/LoginForm";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Login",
    description: "Patient Management System - Login",
};

export default function LoginPage() {
    return (
        <div className={'w-full flex items-center justify-center p-4'}>
            <div
                className="bg-white/70 rounded-xl shadow-lg p-10 border border-white/20 my-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-gray-600">Please sign in to your account</p>
                </div>
                <LoginForm/>
                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}