import {NextRequest, NextResponse} from "next/server";
import {decrypt} from "@/app/lib/sessions";
import {cookies} from "next/headers";

const publicRoutes = ["/login", "/", '/forgot-password', '/reset-password'];
const doctorOnlyRoutes = [
    "/patients/[id]/prescriptions/add",
    "/patients/[id]/medicalCertificates",
    "/patients/[id]/reports",
    "/patients/[id]/notes",
    "/patients/[id]/history",
    "/admin/staff",
    "/admin/reports",
    "/admin/fees",
    "/admin/prescription",
    "/inventory/cost-management"
];

// Helper function to check if a path matches a route pattern
function matchRoute(path: string, pattern: string): boolean {
    const pathParts = path.split('/');
    const patternParts = pattern.split('/');

    if (pathParts.length !== patternParts.length) {
        return false;
    }

    return patternParts.every((part, i) => {
        // If the pattern part is wrapped in [], it's a parameter
        if (part.startsWith('[') && part.endsWith(']')) {
            // Check if the corresponding path part exists and isn't empty
            return pathParts[i] && pathParts[i].length > 0;
        }
        // Otherwise, check for exact match
        return part === pathParts[i];
    });
}

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const role = session?.role;

    // Redirect to /login if the user is not authenticated and trying to access a protected route
    if (!isPublicRoute && !session?.id) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Restrict doctor-only routes using pattern matching
    const isDoctorOnlyRoute = doctorOnlyRoutes.some(route => matchRoute(path, route));
    if (isDoctorOnlyRoute && role !== 'DOCTOR') {
        return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }

    // Redirect authenticated users away from the login page
    if (path === "/login" && session?.id) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};