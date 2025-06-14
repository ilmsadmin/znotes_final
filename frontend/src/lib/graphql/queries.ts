import { gql } from '@apollo/client';

// User queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      avatarUrl
      createdAt
      updatedAt
      groupMemberships {
        id
        role
        joinedAt
        group {
          id
          name
          description
          avatarUrl
          maxMembers
          creator {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_USERS_IN_GROUP = gql`
  query GetUsersInGroup($groupId: ID) {
    usersInGroup(groupId: $groupId) {
      id
      name
      email
      avatarUrl
    }
  }
`;

// Notes queries
export const GET_NOTES = gql`
  query GetNotes($filter: NotesFilterInput) {
    notes(filter: $filter) {
      id
      title
      content
      type
      status
      priority
      severity
      deadline
      estimatedTime
      tags
      isPinned
      createdAt
      updatedAt
      creator {
        id
        name
        avatarUrl
      }
      assignments {
        id
        assignee {
          id
          name
          email
          avatarUrl
        }
      }
      comments {
        id
      }
    }
  }
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
      id
      title
      content
      type
      status
      priority
      severity
      deadline
      estimatedTime
      tags
      isPinned
      createdAt
      updatedAt
      creator {
        id
        name
        avatarUrl
      }
      assignments {
        id
        assignee {
          id
          name
          email
          avatarUrl
        }
      }
      comments {
        id
        content
        mentions
        createdAt
        updatedAt
        author {
          id
          name
          avatarUrl
        }
        parentComment {
          id
        }
        replies {
          id
          content
          createdAt
          author {
            id
            name
            avatarUrl
          }
        }
      }
      files {
        id
        fileName
        fileUrl
        fileType
        fileSize
        createdAt
        uploader {
          id
          name
        }
      }
    }
  }
`;

export const GET_NOTES_BY_TYPE = gql`
  query GetNotesByType($type: NoteType!) {
    notesByType(type: $type) {
      id
      title
      content
      status
      priority
      severity
      deadline
      estimatedTime
      tags
      isPinned
      createdAt
      updatedAt
      creator {
        id
        name
        avatarUrl
      }
      assignments {
        id
        assignee {
          id
          name
          email
          avatarUrl
        }
      }
    }
  }
`;

export const GET_MY_ASSIGNED_NOTES = gql`
  query GetMyAssignedNotes {
    myAssignedNotes {
      id
      title
      content
      type
      status
      priority
      deadline
      createdAt
      creator {
        id
        name
        avatarUrl
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
      priority
      tags
      createdAt
      creator {
        id
        name
        avatarUrl
      }
    }
  }
`;

// Comments queries
export const GET_COMMENTS_BY_NOTE = gql`
  query GetCommentsByNote($noteId: ID!) {
    commentsByNote(noteId: $noteId) {
      id
      content
      mentions
      createdAt
      updatedAt
      author {
        id
        name
        avatarUrl
      }
      parentComment {
        id
      }
      replies {
        id
        content
        createdAt
        author {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;

// Assignments queries
export const GET_ASSIGNMENTS_BY_NOTE = gql`
  query GetAssignmentsByNote($noteId: ID!) {
    assignmentsByNote(noteId: $noteId) {
      id
      createdAt
      assignee {
        id
        name
        email
        avatarUrl
      }
    }
  }
`;

export const GET_MY_ASSIGNMENTS = gql`
  query GetMyAssignments {
    myAssignments {
      id
      createdAt
      note {
        id
        title
        type
        status
        priority
        deadline
        creator {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;

// Groups queries
export const GET_MY_GROUPS = gql`
  query GetMyGroups {
    myGroups {
      id
      group {
        id
        name
        description
        avatarUrl
        maxMembers
        creator {
          id
          name
        }
        createdAt
      }
      role
      joinedAt
    }
  }
`;

export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    group(id: $id) {
      id
      name
      description
      avatarUrl
      maxMembers
      memberCount
      creator {
        id
        name
        avatarUrl
      }
      members {
        id
        role
        joinedAt
        user {
          id
          name
          email
          avatarUrl
        }
      }
      createdAt
    }
  }
`;

// Notifications queries
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($unreadOnly: Boolean = false) {
    notifications(unreadOnly: $unreadOnly) {
      id
      type
      message
      read
      createdAt
      note {
        id
        title
      }
    }
  }
`;
