import { createCookieSessionStorage, redirect } from "react-router";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";

// Cookie session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__selectify_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t-d3f4ult-k3y-ch4ng3-m3"],
    secure: process.env.NODE_ENV === "production",
  },
});

// Get the session from the request
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Get the currently logged-in user ID from the session
export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId || null;
}

// Get the currently logged-in user object
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return user;
  } catch {
    return null;
  }
}

// Require authentication — redirects to /login if not logged in
export async function requireAuth(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    const url = new URL(request.url);
    throw redirect(`/login?next=${encodeURIComponent(url.pathname)}`);
  }
  return userId;
}

// Register a new user
export async function registerUser(email: string, password: string, name?: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return { user };
}

// Login an existing user
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

  return { user };
}

// Create a user session (set cookie) and redirect
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Logout — destroy the session
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
