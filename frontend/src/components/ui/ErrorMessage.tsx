import { ApolloError } from '@apollo/client';

interface ErrorMessageProps {
  error: ApolloError | Error | null;
  className?: string;
}

export default function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  const getErrorMessage = (error: ApolloError | Error) => {
    if (error instanceof ApolloError) {
      if (error.networkError) {
        return 'Network error: Unable to connect to the server. Please check your connection.';
      }
      if (error.graphQLErrors.length > 0) {
        return error.graphQLErrors[0].message;
      }
      return error.message;
    }
    return error.message;
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            {getErrorMessage(error)}
          </div>
        </div>
      </div>
    </div>
  );
}
