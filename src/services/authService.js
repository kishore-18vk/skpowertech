import { supabase } from '../supabase';

export const authService = {
  // 1. Check if there is an active session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        return {
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email
          }
        };
      }
    } catch (e) {
      console.warn("Supabase session check failed, checking local storage:", e);
    }

    const localSession = localStorage.getItem('sk_local_session');
    if (localSession) {
      try {
        const user = JSON.parse(localSession);
        return {
          isAuthenticated: true,
          user
        };
      } catch (e) {
        localStorage.removeItem('sk_local_session');
      }
    }
    return null;
  },

  // 2. Log in with email and password
  async login(usernameOrEmail, password) {
    // Automatically turn a plain username into the valid email format Supabase requires
    let email = usernameOrEmail;
    if (!usernameOrEmail.includes('@')) {
      email = `${usernameOrEmail}@skpowertech.com`;
    }

    // Try authenticating directly via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // If successful, return the valid database session user profile
    if (!error && data?.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      };
    }

    // Log the actual backend authentication rejection message to assist debugging
    if (error) {
      console.error("Supabase Auth rejected application request:", error.message);
    }

    // Local Fallback credentials for development / offline use
    const localUsername = usernameOrEmail.split('@')[0];
    if ((localUsername === 'admin' || email === 'admin@skpowertech.com') && password === 'admin123') {
      const mockUser = {
        id: 'local-admin-id',
        email: 'admin@skpowertech.com'
      };
      localStorage.setItem('sk_local_session', JSON.stringify(mockUser));
      return {
        success: true,
        user: mockUser
      };
    }

    return { 
      success: false, 
      error: error ? error.message : "Invalid credentials" 
    };
  },

  // 3. Log out of the session
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase logout failed:", e);
    }
    localStorage.removeItem('sk_local_session');
    return true;
  }
};