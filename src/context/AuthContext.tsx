
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: Error | null}>;
  signInWithPhone: (phone: string) => Promise<{error: Error | null}>;
  verifyOtp: (phone: string, token: string) => Promise<{error: Error | null}>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{error: Error | null, user: User | null}>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      // Check active session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        setIsLoading(false);
        return;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  // Sign in with phone
  const signInWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the code.",
      });
      return { error: null };
    } catch (error) {
      console.error('Phone sign in error:', error);
      toast({
        title: "Failed to send code",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  // Verify phone OTP
  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) throw error;
      toast({
        title: "Successfully verified",
        description: "Your phone number has been verified.",
      });
      return { error: null };
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid or expired code.",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
      return { error: error as Error, user: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signInWithPhone,
    verifyOtp,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
