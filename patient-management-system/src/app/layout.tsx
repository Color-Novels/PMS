// RootLayout (globals/layout.tsx)
import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";
import React from "react";
import {ToastContainer} from "react-toastify";

export const metadata: Metadata = {
    title: "Patient Management System",
    description: "Patient Management System",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-montserrat",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={montserrat.className}>
        <body className={'bg-background h-screen flex'}>
        {children}
        <ToastContainer/>
        </body>
        </html>
    );
}