import { gql } from '@apollo/client';

// Activity Queries
export const GET_GROUP_ACTIVITY = gql`
  query GetGroupActivity($limit: Int) {
    groupActivity(limit: $limit) {
      id
      action
      details
      createdAt
      user {
        id
        name
      }
      note {
        id
        title
      }
    }
  }
`;

export const GET_MY_ACTIVITY = gql`
  query GetMyActivity($limit: Int) {
    myActivity(limit: $limit) {
      id
      action
      details
      createdAt
      note {
        id
        title
      }
    }
  }
`;

export const GET_NOTE_ACTIVITY = gql`
  query GetNoteActivity($noteId: String!) {
    noteActivity(noteId: $noteId) {
      id
      action
      details
      createdAt
      user {
        id
        name
      }
    }
  }
`;
