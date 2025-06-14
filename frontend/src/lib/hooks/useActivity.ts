import { useQuery } from '@apollo/client';
import { GET_GROUP_ACTIVITY, GET_MY_ACTIVITY, GET_NOTE_ACTIVITY } from '@/lib/graphql';
import { Activity } from '@/types';

// Get group activity
export const useGroupActivity = (limit: number = 50) => {
  return useQuery<{ groupActivity: Activity[] }>(GET_GROUP_ACTIVITY, {
    variables: { limit },
    errorPolicy: 'all',
    // Skip query if no token
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Get current user's activity
export const useMyActivity = (limit: number = 20) => {
  return useQuery<{ myActivity: Activity[] }>(GET_MY_ACTIVITY, {
    variables: { limit },
    errorPolicy: 'all',
    // Skip query if no token
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Get activity for a specific note
export const useNoteActivity = (noteId: string) => {
  return useQuery<{ noteActivity: Activity[] }>(GET_NOTE_ACTIVITY, {
    variables: { noteId },
    skip: !noteId || (typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true),
    errorPolicy: 'all',
  });
};
