'use server';

import {redirect} from "next/navigation";
import {createSession, deleteSession} from "@/app/lib/sessions";
import {prisma} from "@/app/lib/prisma";
// import bcrypt from 'bcryptjs';
import {Role} from "@prisma/client";

export async function login(message: string, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return "Please fill in all fields";
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return "Invalid credentials";
    }

    // const valid = await bcrypt.compare(password, user.password);
    const valid = password === user.password; // For testing only

    if (!valid) {
        return "Invalid credentials";
    }

    await createSession({
        role: user.role,
        id: user.id,
    });
    redirect("/dashboard"); // Redirect only if valid
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

//get user details from session

export async function getStaff() {
    try {
        return await prisma.user.findMany({
            where: {
                role: {
                    not: Role.DOCTOR
                }
            },
            select: {
                id: true,
                role: true,
                name: true,
                gender: true,
                email: true,
                image: true,
                mobile: true,
            },
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw new Error("Failed to fetch users");
    }
}

//To get Nurse Details
export async function getNurses() {
    try {
        return await prisma.user.findMany({
            where: {
                role: 'NURSE'
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    } catch (error) {
        console.error("Failed to fetch nurses:", error);
        throw new Error("Failed to fetch nurses");
    }
}