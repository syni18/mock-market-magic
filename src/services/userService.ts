
import { supabase, getAuthHeaders } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  preferences?: Record<string, any>;
}

export async function createUserProfile(profile: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
}

export async function updateUserAvatar(userId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    // Update the user profile with the avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();
      
    if (error) throw error;
    
    // Update user metadata
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });
    
    return { data, error: null, publicUrl };
  } catch (error) {
    console.error('Error updating user avatar:', error);
    return { data: null, error, publicUrl: null };
  }
}

// Function to get current user with fresh data
export async function getCurrentUser(): Promise<{ user: User | null, error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error as Error };
  }
}

// Function to handle a protected API call (example)
export async function makeProtectedApiCall(endpoint: string, method = 'GET', body?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(endpoint, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error making protected API call:', error);
    return { data: null, error };
  }
}
