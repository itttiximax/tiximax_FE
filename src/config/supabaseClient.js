import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jrpqhpnrknyxvgzbrrfv.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycHFocG5ya255eHZnemJycmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzY1OTIsImV4cCI6MjA3MTkxMjU5Mn0.AZKUZglU-AQlXYKmrnYEtH4ISBE3CiOy4VP2kDcrGeY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: "tiximax-auth",
  },
});

export const getCurrentSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};

export default supabase;
