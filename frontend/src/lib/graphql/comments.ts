import { gql } from '@apollo/client';

// Comments Queries
export const GET_COMMENTS_BY_NOTE = gql`
  query GetCommentsByNote($noteId: String!) {
    commentsByNote(noteId: $noteId) {
      id
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

// Comments Mutations
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: String!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;
