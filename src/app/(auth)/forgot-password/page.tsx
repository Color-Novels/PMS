"use client";

import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PhoneCall, Mail, ArrowLeft} from "lucide-react";
import {useState} from "react";

type UserType = 'doctor' | 'assistant';

interface Doctor {
    name: string;
    specialty: string;
    phone: string;
}

interface SupportMember {
    name: string;
    phone: string;
    email: string;
}

const ForgetPasswordPage = () => {
    const [userType, setUserType] = useState<UserType>('doctor');

    const doctors: Doctor[] = [
        {
            name: "Dr. Dinej Chandrasiri",
            specialty: "General Medicine",
            phone: "071-823-6977",
        }
    ];

    const supportTeam: SupportMember[] = [
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
    ];

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg border-blue-100 relative backdrop-blur-sm bg-white/80">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold text-gray-900">
                            Password Recovery
                        </CardTitle>
                        <Link href="/login" className="flex items-center text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4 mr-1"/>
                            Back to Login
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* User Type Selection */}
                    <div className="flex gap-4 justify-center mb-6">
                        <Button
                            variant={userType === 'doctor' ? 'default' : 'outline'}
                            onClick={() => setUserType('doctor')}
                            className="w-40"
                        >
                            I&#39;m a Doctor
                        </Button>
                        <Button
                            variant={userType === 'assistant' ? 'default' : 'outline'}
                            onClick={() => setUserType('assistant')}
                            className="w-40"
                        >
                            I&#39;m an Assistant
                        </Button>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <PhoneCall className="h-5 w-5 text-gray-600"/>
                            {userType === 'assistant' ? 'Contact Your Doctor' : 'Contact Support'}
                        </h3>
                        <div className={`grid gap-4 ${userType === 'assistant' ? '' : 'md:grid-cols-2'}`}>
                            {(userType === 'assistant' ? doctors : supportTeam).map((contact, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                    {userType === 'assistant' && 'specialty' in contact && (
                                        <p className="text-sm text-gray-600 mt-1">{contact.specialty}</p>
                                    )}
                                    <div className="mt-2 space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-gray-600">
                                            <PhoneCall className="h-4 w-4"/>
                                            {contact.phone}
                                        </p>
                                        {'email' in contact && (
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4"/>
                                                {contact.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
        ;
};

export default ForgetPasswordPage;