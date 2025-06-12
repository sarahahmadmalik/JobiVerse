import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/home", "/chats", "/my-resumes", "/application-manager", "/profile",
  "/saved-jobs", "/schedule", "/settings", "/recruiter", "/onboarding",
];

const candidateOnlyRoutes = [
  "/home", "/chats", "/my-resumes", "/application-manager", "/profile",
  "/saved-jobs", "/schedule", "/settings", "/onboarding",
];

const recruiterOnlyRoutes = [
  "/recruiter/home", "/recruiter/chats", "/recruiter/job-post",
  "/recruiter/profile", "/recruiter/settings",
];

const publicRoutes = [
  "/", "/login", "/register", "/forgot-password", "/api/auth",
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // ← use string or env directly
  });

    console.log("roken",token.role)

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token?.isFirstLogin && !path.startsWith("/onboarding") && !path.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const isCandidateRoute = candidateOnlyRoutes.some(route => path.startsWith(route));

  if (isCandidateRoute && token?.role !== "candidate") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const isRecruiterRoute = recruiterOnlyRoutes.some(route => path.startsWith(route));
  if (isRecruiterRoute && token?.role !== "recruiter") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)",
  ],
};
