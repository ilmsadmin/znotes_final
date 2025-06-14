import { ApolloError } from '@apollo/client';

/**
 * Extract meaningful error message from Apollo Error
 */
export function getErrorMessage(error: ApolloError | Error): string {
  if (error instanceof ApolloError) {
    // Network error (connection issues, server down, etc.)
    if (error.networkError) {
      if ('statusCode' in error.networkError) {
        switch (error.networkError.statusCode) {
          case 401:
            return 'Authentication required. Please login.';
          case 403:
            return 'You do not have permission to perform this action.';
          case 404:
            return 'The requested resource was not found.';
          case 500:
            return 'Server error. Please try again later.';
          default:
            return `Network error (${error.networkError.statusCode}). Please check your connection.`;
        }
      }
      return 'Network error. Please check your connection and try again.';
    }
    
    // GraphQL errors (validation, business logic, etc.)
    if (error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    
    return error.message;
  }
  
  return error.message;
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: ApolloError): boolean {
  if (error.networkError && 'statusCode' in error.networkError) {
    return error.networkError.statusCode === 401;
  }
  
  return error.graphQLErrors.some(
    err => err.message.toLowerCase().includes('unauthorized') ||
           err.message.toLowerCase().includes('authentication')
  );
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate authentication token format for development
 */
export function generateAuthToken(firebaseUid: string, email: string): string {
  return `${firebaseUid}:${email}`;
}

/**
 * Parse authentication token
 */
export function parseAuthToken(token: string): { firebaseUid: string; email: string } | null {
  const parts = token.split(':');
  if (parts.length !== 2) return null;
  
  return {
    firebaseUid: parts[0],
    email: parts[1]
  };
}
