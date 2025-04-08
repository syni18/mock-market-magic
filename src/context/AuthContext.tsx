
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: Error | null}>;
  signInWithPhone: (phone: string) => Promise<{error: Error | null}>;
  verifyOtp: (phone: string, token: string) => Promise<{error: Error | null}>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{error: Error | null, user: User | null}>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{error: Error | null}>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth and set up listeners
  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Sync user data with profiles table
          await syncUserProfile(session.user);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            
            if (session?.user) {
              // Sync user profile on sign in
              await syncUserProfile(session.user);
              
              // If it's a sign in event, navigate to home page
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Welcome!",
                  description: `You've been successfully signed in, ${session.user.user_metadata?.full_name || 'User'}!`,
                });
                
                // Navigate to home page
                navigate("/");
              }
            }
            
            setIsLoading(false);
          }
        );
        
        setIsLoading(false);
        
        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth setup error:', error);
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, [navigate, toast]);

  // Helper function to sync user data with profiles table
  const syncUserProfile = async (user: User) => {
    if (!user) return;
    
    try {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (existingProfile) {
        // Update existing profile with latest user data
        await supabase
          .from('profiles')
          .update({
            email: user.email,
            full_name: user.user_metadata?.full_name || existingProfile.full_name,
            avatar_url: user.user_metadata?.avatar_url || existingProfile.avatar_url,
            phone: user.phone || existingProfile.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } else {
        // Create new profile
        await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            phone: user.phone || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      
      // Redirect to home page after successful sign in
      navigate('/');
      
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

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Set up redirect URL explicitly using the current window location origin
      const redirectTo = window.location.origin;
      console.log("Setting redirect URL to:", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google sign in failed",
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
      
      // Redirect to home page after successful verification
      navigate('/');
      
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
      
      // Redirect to sign in page after sign out
      navigate('/signin');
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
    signInWithGoogle,
    isAuthenticated,
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
