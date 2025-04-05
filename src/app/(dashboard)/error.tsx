'use client';

import {useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertCircle, PhoneCall, Mail, RotateCcw} from 'lucide-react';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Error",
    description: "An unexpected error occurred.",
};

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            className="flex flex-col justify-center items-center bg-gradient-to-b from-red-50 to-white p-4 overflow-y-auto">
            <Card className="w-full max-w-lg shadow-lg border-red-100 backdrop-blur-sm bg-white/80 overflow-y-auto">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-red-600"/>
                        <CardTitle className="text-xl font-semibold text-red-600">
                            Something went wrong!
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-gray-700">
                            {error.message || "An unexpected error occurred."}
                        </p>
                    </div>

                    <Button
                        onClick={reset}
                        className="w-full bg-red-500 hover:bg-red-600 transition-colors"
                        variant="destructive"
                    >
                        <RotateCcw className="h-4 w-4 mr-2"/>
                        Try Again
                    </Button>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <PhoneCall className="h-5 w-5 text-gray-600"/>
                            Contact Support
                        </h3>
                        <div className="space-y-4">
                            {[
                                {
                                    name: "Dasun Piyumal",
                                    phone: "077 918 8749",
                                    email: "w.piyumal2319@gmail.com"
                                },
                                {
                                    name: "Sadeepa Dilhara",
                                    phone: "071 362 7170",
                                    email: "sadeepadilharap@gmail.com"
                                },
                                {
                                    name: "Pubudu Manoj",
                                    phone: "078 317 2315",
                                    email: "pubudumanoj082@gmail.com"
                                }
                            ].map((contact, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-gray-50/50 rounded-lg border border-gray-100"
                                >
                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                    <div className="mt-1 space-y-1 text-sm">
                                        <p className="flex items-center gap-2 text-gray-600">
                                            <PhoneCall className="h-4 w-4"/>
                                            {contact.phone}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-600">
                                            <Mail className="h-4 w-4"/>
                                            {contact.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}