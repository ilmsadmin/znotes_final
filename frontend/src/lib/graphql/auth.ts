import { gql } from '@apollo/client';

// Health Check Queries
export const HEALTH_CHECK = gql`
  query HealthCheck {
    health
    databaseHealth
    redisHealth
    cacheHealth
  }
`;

// User Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      avatarUrl
      createdAt
      groupMemberships {
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
  }
`;

export const GET_USERS_IN_GROUP = gql`
  query GetUsersInGroup {
    usersInGroup {
      id
      name
      email
      avatarUrl
    }
  }
`;

// User Mutations
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;

// Group Queries
export const GET_MY_GROUP = gql`
  query GetMyGroup {
    myGroup {
      id
      name
      domain
      users {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_GROUP_STATS = gql`
  query GetGroupStats {
    groupStats
  }
`;

// Group Mutations
export const UPDATE_GROUP_SETTINGS = gql`
  mutation UpdateGroupSettings($settings: String!) {
    updateGroupSettings(settings: $settings) {
      id
      name
    }
  }
`;
