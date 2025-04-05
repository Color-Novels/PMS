import React from 'react';
import {Brain, Sparkles, BarChart3, CircuitBoard} from 'lucide-react';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Dashboard",
    description: "View and manage your dashboard.",
};

export default function DashboardPage() {
    return (
        <div className="h-full flex items-center justify-center p-4">
            <div
                className="max-w-2xl w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20 text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <CircuitBoard className="w-full h-full text-primary-500"/>
                </div>

                <div className="relative">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center gap-2 mb-6">
                        <Brain className="h-12 w-12 text-primary-500"/>
                        <Sparkles className="h-6 w-6 text-primary-500 animate-pulse"/>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        AI-Powered Dashboard
                        <span className="text-primary-500"> Coming Soon</span>
                    </h1>

                    <p className="text-gray-600 mb-8 text-lg">
                        We&#39;re crafting an intelligent analytics dashboard that will transform your healthcare data into
                        actionable insights.
                    </p>

                    {/* Features preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-4 rounded-lg bg-white/50 border border-gray-100">
                            <BarChart3 className="h-6 w-6 text-primary-500 mb-2"/>
                            <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
                            <p className="text-sm text-gray-600">Real-time data processing with AI-driven insights</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/50 border border-gray-100">
                            <Brain className="h-6 w-6 text-primary-500 mb-2"/>
                            <h3 className="font-semibold text-gray-900">Predictive Intelligence</h3>
                            <p className="text-sm text-gray-600">Smart forecasting and trend analysis</p>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div
                            className="h-2 w-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div
                            className="h-2 w-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}