import { useQuery } from '@apollo/client';
import { GET_USERS_IN_GROUP } from '../graphql';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export function useUsersInGroup(groupId?: string) {
  return useQuery<{ usersInGroup: User[] }>(GET_USERS_IN_GROUP, {
    variables: { groupId },
    skip: !groupId,
    fetchPolicy: 'cache-and-network',
  });
}
