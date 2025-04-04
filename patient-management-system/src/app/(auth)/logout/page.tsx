'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {logout} from "@/app/lib/auth";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                localStorage.clear();
                await logout();
                router.push('/login');
                // Force a hard refresh to clear any cached states
                router.refresh();
            } catch (error) {
                console.error('Logout failed:', error);
                // Still redirect to log in in case of error
                router.push('/login');
            }
        };

        handleLogout().then();
    }, [router]);

    // Show a loading state while logout is processing
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div
                    className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                <p className="text-gray-600">Signing out...</p>
            </div>
        </div>
    );
}