import { gql } from '@apollo/client';

// User mutations
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      avatarUrl
      updatedAt
    }
  }
`;

// Notes mutations
export const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
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
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
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

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

export const PIN_NOTE = gql`
  mutation PinNote($id: ID!, $isPinned: Boolean!) {
    updateNotePinStatus(id: $id, isPinned: $isPinned) {
      id
      isPinned
      updatedAt
    }
  }
`;

// Comments mutations
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      mentions
      createdAt
      author {
        id
        name
        avatarUrl
      }
      note {
        id
      }
      parentComment {
        id
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      id
      content
      mentions
      updatedAt
      author {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

// Assignments mutations
export const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      createdAt
      assignee {
        id
        name
        email
        avatarUrl
      }
      note {
        id
        title
      }
    }
  }
`;

export const REMOVE_ASSIGNMENT = gql`
  mutation RemoveAssignment($id: ID!) {
    removeAssignment(id: $id)
  }
`;

export const UNASSIGN_FROM_NOTE = gql`
  mutation UnassignFromNote($noteId: ID!, $assigneeId: ID!) {
    unassignFromNote(noteId: $noteId, assigneeId: $assigneeId)
  }
`;

// Groups mutations
export const CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
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
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {
    updateGroup(id: $id, input: $input) {
      id
      name
      description
      avatarUrl
      updatedAt
    }
  }
`;

export const INVITE_TO_GROUP = gql`
  mutation InviteToGroup($input: InviteToGroupInput!) {
    inviteToGroup(input: $input) {
      id
      email
      token
      status
      expiresAt
      group {
        id
        name
      }
      inviter {
        id
        name
      }
    }
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($token: String!) {
    acceptInvitation(token: $token) {
      id
      role
      joinedAt
      group {
        id
        name
        description
      }
    }
  }
`;

export const DECLINE_INVITATION = gql`
  mutation DeclineInvitation($token: String!) {
    declineInvitation(token: $token)
  }
`;

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroup($groupId: ID!, $userId: ID!) {
    removeUserFromGroup(groupId: $groupId, userId: $userId)
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($groupId: ID!, $userId: ID!, $role: String!) {
    updateUserRole(groupId: $groupId, userId: $userId, role: $role)
  }
`;

// Notifications mutations
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;
