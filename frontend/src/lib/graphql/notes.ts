import { gql } from '@apollo/client';

// Notes Queries
export const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      title
      content
      type
      status
      createdAt
      creator {
        id
        name
      }
    }
  }
`;

export const GET_NOTES_BY_TYPE = gql`
  query GetNotesByType($type: String!) {
    notesByType(type: $type) {
      id
      title
      content
      type
      status
      createdAt
      creator {
        id
        name
      }
    }
  }
`;

export const SEARCH_NOTES = gql`
  query SearchNotes($query: String!) {
    searchNotes(query: $query) {
      id
      title
      content
      type
      status
      createdAt
    }
  }
`;

// Notes Mutations
export const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      content
      type
      status
      creator {
        id
        name
      }
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: String!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      id
      title
      content
      status
      type
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;
