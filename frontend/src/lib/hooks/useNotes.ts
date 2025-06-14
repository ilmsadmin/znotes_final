import { useQuery, useMutation } from '@apollo/client';
import {
  GET_NOTES,
  GET_NOTE,
  GET_NOTES_BY_TYPE,
  GET_MY_ASSIGNED_NOTES,
  SEARCH_NOTES,
  CREATE_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  PIN_NOTE,
} from '@/lib/graphql';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types';

// Get all notes
export const useNotes = () => {
  return useQuery<{ notes: Note[] }>(GET_NOTES, {
    errorPolicy: 'all',
    // Skip query if no token
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Get notes by type
export const useNotesByType = (type: string) => {
  return useQuery<{ notesByType: Note[] }>(GET_NOTES_BY_TYPE, {
    variables: { type },
    errorPolicy: 'all',
    // Skip query if no token
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Search notes
export const useSearchNotes = (query: string) => {
  return useQuery<{ searchNotes: Note[] }>(SEARCH_NOTES, {
    variables: { query },
    skip: !query || query.length < 2 || (typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true),
    errorPolicy: 'all',
  });
};

// Create note
export const useCreateNote = () => {
  return useMutation<{ createNote: Note }, { input: CreateNoteInput }>(
    CREATE_NOTE,
    {
      refetchQueries: [{ query: GET_NOTES }],
      awaitRefetchQueries: true,
    }
  );
};

// Update note
export const useUpdateNote = () => {
  return useMutation<
    { updateNote: Note },
    { id: string; input: UpdateNoteInput }
  >(UPDATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
};

// Delete note
export const useDeleteNote = () => {
  return useMutation<{ deleteNote: boolean }, { id: string }>(DELETE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
    awaitRefetchQueries: true,
  });
};

// Get single note by ID
export const useNote = (id: string) => {
  return useQuery<{ note: Note }>(GET_NOTE, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id || (typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true),
  });
};

// Get my assigned notes
export const useMyAssignedNotes = () => {
  return useQuery<{ myAssignedNotes: Note[] }>(GET_MY_ASSIGNED_NOTES, {
    errorPolicy: 'all',
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Pin/unpin note
export const usePinNote = () => {
  return useMutation<
    { updateNotePinStatus: Note },
    { id: string; isPinned: boolean }
  >(PIN_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
};

// Convenience hooks for specific types
export const useTasks = () => {
  return useNotesByType('task');
};

export const useIssues = () => {
  return useNotesByType('issue');
};

export const useNotesList = () => {
  return useNotesByType('note');
};
