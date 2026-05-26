/**
 * Lightweight Neon Auth client using direct REST API calls.
 * Replaces @neondatabase/neon-js which has broken transitive dependencies.
 */

const NEON_AUTH_URL =
  process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
  "https://ep-bold-brook-ap2c55hh.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth";

// Session token is stored in localStorage
const SESSION_TOKEN_KEY = "neon_session_token";
const SESSION_DATA_KEY = "neon_session_data";

interface NeonUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface NeonSession {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

interface NeonAuthResponse {
  user?: NeonUser;
  session?: NeonSession;
  error?: { message: string; code?: string; status?: number };
  token?: string;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

function storeSession(data: NeonAuthResponse) {
  if (typeof window === "undefined") return;
  // Prefer top-level JWT token for API auth, fall back to session token
  const apiToken = data.token || data.session?.token || null;
  if (apiToken) {
    localStorage.setItem(SESSION_TOKEN_KEY, apiToken);
  }
  // Always store user/session data if present (for getSession)
  if (data.user || data.session) {
    localStorage.setItem(
      SESSION_DATA_KEY,
      JSON.stringify({ user: data.user || null, session: data.session || null })
    );
  }
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_DATA_KEY);
}

function getStoredSessionData(): NeonAuthResponse | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function neonFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${NEON_AUTH_URL}${path}`;
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });
}

export const authClient = {
  signIn: {
    email: async (params: { email: string; password: string }) => {
      try {
        const res = await neonFetch("/sign-in/email", {
          method: "POST",
          body: JSON.stringify({ email: params.email, password: params.password }),
        });
        const data: NeonAuthResponse = await res.json();
        if (!res.ok || data.error) {
          return {
            error: {
              message: data.error?.message || "Invalid email or password",
              code: data.error?.code,
              status: res.status,
            },
            data: null,
          };
        }
        storeSession(data);
        return { data, error: null };
      } catch (err: any) {
        return {
          error: { message: err.message || "Network error", status: 0 },
          data: null,
        };
      }
    },
  },

  signUp: {
    email: async (params: { email: string; password: string; name: string }) => {
      try {
        const res = await neonFetch("/sign-up/email", {
          method: "POST",
          body: JSON.stringify({
            email: params.email,
            password: params.password,
            name: params.name,
          }),
        });
        const data: NeonAuthResponse = await res.json();
        if (!res.ok || data.error) {
          return {
            error: {
              message: data.error?.message || "Registration failed",
              code: data.error?.code,
              status: res.status,
            },
            data: null,
          };
        }
        storeSession(data);
        return { data, error: null };
      } catch (err: any) {
        return {
          error: { message: err.message || "Network error", status: 0 },
          data: null,
        };
      }
    },
  },

  signOut: async () => {
    try {
      await neonFetch("/sign-out", { method: "POST" });
    } catch {
      // Ignore errors
    }
    clearSession();
  },

  getSession: async (): Promise<{ data: NeonAuthResponse | null } | null> => {
    // First check localStorage - fast, no network needed
    const stored = getStoredSessionData();
    if (stored?.user && stored?.session) {
      // Check if token is still valid (not expired)
      // Handle both camelCase (expiresAt) and snake_case (expires_at)
      const expiresAtStr = stored.session.expiresAt || (stored.session as any).expires_at;
      if (expiresAtStr) {
        try {
          const expiresAt = new Date(expiresAtStr);
          if (!isNaN(expiresAt.getTime()) && expiresAt > new Date()) {
            return { data: stored };
          }
        } catch {
          // Date check failed
        }
      } else {
        // No expiration field — assume still valid and return stored data
        return { data: stored };
      }
    }

    // Try the server (handles new sessions, cross-tab sync, expired sessions)
    try {
      const res = await neonFetch("/session");
      if (res.ok) {
        const data: NeonAuthResponse = await res.json();
        if (data.user && data.session) {
          storeSession(data);
          return { data };
        }
      }
    } catch {
      // Server check failed
    }

    // If we had stored data but couldn't verify expiration, still return it
    if (stored?.user && stored?.session) {
      return { data: stored };
    }

    return { data: null };
  },

  /** Returns the current JWT token for use as a Bearer token - synchronous, no network */
  getToken: (): string | null => {
    return getStoredToken();
  },

  /** Returns user info from stored session data without a network call */
  getStoredUser: (): { email: string; name?: string } | null => {
    const stored = getStoredSessionData();
    if (stored?.user?.email) {
      return {
        email: stored.user.email,
        name: (stored.user as any).name,
      };
    }
    return null;
  },
};
