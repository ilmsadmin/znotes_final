import { useQuery, useMutation } from '@apollo/client';
import {
  GET_COMMENTS_BY_NOTE,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from '@/lib/graphql';
import { Comment, CreateCommentInput } from '@/types';

// Get comments for a note
export const useCommentsByNote = (noteId: string) => {
  return useQuery<{ commentsByNote: Comment[] }>(GET_COMMENTS_BY_NOTE, {
    variables: { noteId },
    skip: !noteId || (typeof window !== 'undefined' ? !localStorage.getItem('auth_token') : true),
    errorPolicy: 'all',
  });
};

// Create comment
export const useCreateComment = () => {
  return useMutation<{ createComment: Comment }, { input: CreateCommentInput }>(
    CREATE_COMMENT,
    {
      refetchQueries: (result) => {
        if (result.data?.createComment) {
          return [
            {
              query: GET_COMMENTS_BY_NOTE,
              variables: { noteId: result.data.createComment.noteId },
            },
          ];
        }
        return [];
      },
    }
  );
};

// Update comment
export const useUpdateComment = () => {
  return useMutation<
    { updateComment: Comment },
    { id: string; content: string }
  >(UPDATE_COMMENT);
};

// Delete comment
export const useDeleteComment = () => {
  return useMutation<{ deleteComment: boolean }, { id: string }>(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS_BY_NOTE }],
  });
};
