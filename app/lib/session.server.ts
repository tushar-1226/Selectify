import { redirect } from "react-router";

function setCookie(res: Response, name: string, value: string, options: Record<string, any> = {}) {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.httpOnly) cookie += `; HttpOnly`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.secure) cookie += `; Secure`;
  res.headers.append('Set-Cookie', cookie);
}

export function getCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
function verifyJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
// Stub for createUserSession to allow registration/login to proceed
export async function createUserSession(userId: string, redirectTo: string) {
  // Set JWT cookie and redirect
  const url = redirectTo.startsWith("http")
    ? redirectTo
    : (redirectTo.startsWith("/") ? redirectTo : "/" + redirectTo);
  
  let cookie = `token=${encodeURIComponent(userId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      'Set-Cookie': cookie,
    },
  });
}
// Prisma removed. Stub session and user functions for future backend logic.

export async function getSession(request: Request) {
  // Get JWT cookie
  const token = getCookie(request, 'token');
  if (!token) return {};
  const payload = verifyJWT(token);
  return { user: payload };
}

export async function getUserId(request: Request): Promise<string | null> {
  // Get userId from JWT cookie
  const token = getCookie(request, 'token');
  if (!token) return null;
  const payload = verifyJWT(token);
  return payload?.id || null;
}

export async function getUser(request: Request) {
  // Return user object from JWT
  const token = getCookie(request, 'token');
  if (!token) return null;
  const payload = verifyJWT(token);
  return payload || null;
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
  // Call Python backend REST API for registration
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return { success: false, error: errorData.detail || "Registration failed" };
  }
  // Backend returns { success, token, user }
  return await res.json();
}

// Login an existing user
export async function loginUser(email: string, password: string) {
  // Call Python backend REST API for login
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return { success: false, error: errorData.detail || "Login failed" };
  }
  // Backend returns { success, token, user }
  return await res.json();
}

// Logout a user
export async function logout(request: Request) {
  return redirect("/", {
    headers: {
      "Set-Cookie": "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  });
}
