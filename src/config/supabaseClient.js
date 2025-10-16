import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jrpqhpnrknyxvgzbrrfv.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycHFocG5ya255eHZnemJycmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzY1OTIsImV4cCI6MjA3MTkxMjU5Mn0.AZKUZglU-AQlXYKmrnYEtH4ISBE3CiOy4VP2kDcrGeY";

const getAppUrl = () => {
  if (import.meta.env.SSR) {
    return import.meta.env.VITE_APP_URL || "https://tiximax-three.vercel.app";
  }

  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }

  if (window.location.hostname.includes("vercel.app")) {
    return window.location.origin;
  }

  return import.meta.env.VITE_APP_URL || "https://tiximax-three.vercel.app";
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "tiximax-auth",
  },
  global: {
    headers: {
      "x-application-name": "tiximax",
    },
  },
});

// Rest of your helper functions remain the same...
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("tiximax-auth");
    }

    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};

// Auth state listener (same as before)
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("🔐 Auth event:", event);
    // ... rest of your logic
  });
}

export default supabase;
