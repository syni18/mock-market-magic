import { supabase } from "@/lib/supabase";

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { data: null, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    localStorage.setItem('userProfileAction', JSON.stringify(data));
    console.log("Google sign in data:", data);

    if (!error && data.user) {
      // Create or update profile
      const { error: profileError } = await supabase.from("users").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      );

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Google sign in error:", error);
    return { data: null, error };
  }
};

export const signInWithPhone = async (phone: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    return { data, error: null };
  } catch (error) {
    console.error("Phone sign in error:", error);
    return { data: null, error };
  }
};

export const verifyOtp = async (phone: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    return { data, error: null };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { data: null, error };
  }
};

export const signUp = async (
  email: string,
  password: string,
  userData?: Record<string, any>,
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (!error && data.user) {
      // Create profile for new user
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: userData?.full_name,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error };
  }
};
