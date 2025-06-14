import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ASSIGNMENTS_BY_NOTE,
  GET_MY_ASSIGNMENTS,
  CREATE_ASSIGNMENT,
  REMOVE_ASSIGNMENT,
  UNASSIGN_FROM_NOTE,
} from '@/lib/graphql';
import { Assignment, CreateAssignmentInput } from '@/types';

// Get assignments for a note
export const useAssignmentsByNote = (noteId: string) => {
  return useQuery<{ assignmentsByNote: Assignment[] }>(GET_ASSIGNMENTS_BY_NOTE, {
    variables: { noteId },
    errorPolicy: 'all',
    skip: !noteId || (typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true),
  });
};

// Get my assignments
export const useMyAssignments = () => {
  return useQuery<{ myAssignments: Assignment[] }>(GET_MY_ASSIGNMENTS, {
    errorPolicy: 'all',
    skip: typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true,
  });
};

// Create assignment
export const useCreateAssignment = () => {
  return useMutation<{ createAssignment: Assignment }, { input: CreateAssignmentInput }>(
    CREATE_ASSIGNMENT,
    {
      refetchQueries: [{ query: GET_ASSIGNMENTS_BY_NOTE }, { query: GET_MY_ASSIGNMENTS }],
      awaitRefetchQueries: true,
    }
  );
};

// Remove assignment
export const useRemoveAssignment = () => {
  return useMutation<{ removeAssignment: boolean }, { id: string }>(REMOVE_ASSIGNMENT, {
    refetchQueries: [{ query: GET_ASSIGNMENTS_BY_NOTE }, { query: GET_MY_ASSIGNMENTS }],
    awaitRefetchQueries: true,
  });
};

// Unassign from note
export const useUnassignFromNote = () => {
  return useMutation<
    { unassignFromNote: boolean },
    { noteId: string; assigneeId: string }
  >(UNASSIGN_FROM_NOTE, {
    refetchQueries: [{ query: GET_ASSIGNMENTS_BY_NOTE }, { query: GET_MY_ASSIGNMENTS }],
    awaitRefetchQueries: true,
  });
};
