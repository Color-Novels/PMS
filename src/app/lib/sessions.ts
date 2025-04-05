'use server';

import 'server-only'
import {jwtVerify, SignJWT} from "jose";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {SessionPayload} from "@/app/lib/definitions";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload).setProtectedHeader({alg: "HS256"}).setIssuedAt().setIssuer("patient-management-system").setAudience("patient-management-system").setExpirationTime("24h").sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
    try {
        if (!session) {
            return null;
        }

        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload;
    } catch (error) {
        console.error(error, 'Invalid session');
        return null;
    }
}

export async function createSession(sessionPayload: SessionPayload) {
    const cookieStore = await cookies();
    const session = await encrypt(sessionPayload);

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours
        sameSite: 'strict',
        path: '/'
    });
}

export const deleteSession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function verifySession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session?.id) {
        redirect("/login");
    }

    return session;
}