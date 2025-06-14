import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_ME, UPDATE_PROFILE } from '@/lib/graphql';
import { User, UpdateProfileInput } from '@/types';

// Get current user
export const useCurrentUser = () => {
  return useQuery<{ me: User }>(GET_ME, {
    errorPolicy: 'all',
    // Skip query if no token
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  return useMutation<{ updateProfile: User }, { input: UpdateProfileInput }>(
    UPDATE_PROFILE,
    {
      refetchQueries: [{ query: GET_ME }],
    }
  );
};

// Authentication helper hooks
export const useAuth = () => {
  const client = useApolloClient();
  
  const login = async (firebaseUid: string, email: string) => {
    const token = `${firebaseUid}:${email}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      // Also set as cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=2592000`; // 30 days
    }
    
    // Reset Apollo cache to clear any cached data from previous user
    await client.resetStore();
    
    // Verify the login by trying to fetch user data
    try {
      const { data } = await client.query({
        query: GET_ME,
        errorPolicy: 'none', // Throw errors instead of returning them
        fetchPolicy: 'network-only', // Always fetch from network to verify token
      });
      
      if (!data?.me) {
        throw new Error('Authentication failed: User not found');
      }
      
      return data.me;
    } catch (error: any) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      
      // Re-throw the error so the calling component can handle it
      throw new Error(error.message || 'Authentication failed');
    }
  };
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('demo_user');
      // Remove cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
    
    // Clear Apollo cache
    client.clearStore();
  };
  
  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  };
  
  const isAuthenticated = () => {
    return !!getToken();
  };
  
  return {
    login,
    logout,
    getToken,
    isAuthenticated,
  };
};
