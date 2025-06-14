'use client';

import { useState, useEffect } from 'react';
import { useAuth, useCurrentUser } from '@/lib/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export default function AuthDemo() {
  const { login, logout } = useAuth();
  const { data, loading, error, refetch } = useCurrentUser();
  const [testCredentials, setTestCredentials] = useState({
    uid: 'test-uid-123',
    email: 'user@example.com'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by checking authentication status only on client
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    login(testCredentials.uid, testCredentials.email);
    setIsAuthenticated(true);
    // Refetch user data after login
    setTimeout(() => refetch(), 100);
    // Trigger a custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true } }));
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    // Trigger a custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false } }));
    }
  };

  const user = data?.me;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Demo</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Demo</h2>
      
      {!isAuthenticated ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Login with test credentials to connect to the GraphQL backend:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firebase UID
              </label>
              <input
                type="text"
                value={testCredentials.uid}
                onChange={(e) => setTestCredentials({ ...testCredentials, uid: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={testCredentials.email}
                onChange={(e) => setTestCredentials({ ...testCredentials, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login to Backend
          </button>
          
          <div className="text-sm text-gray-500">
            <p><strong>Note:</strong> This will automatically create a user and group if they don&apos;t exist.</p>
            <p>The group is determined by the email domain (e.g., @example.com).</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Connected to Backend</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage error={error} />}
          
          {user && (
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="font-medium text-gray-900 mb-2">User Information:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                {user.groupMemberships && user.groupMemberships.length > 0 && (
                  <>
                    <p><strong>Role:</strong> {user.groupMemberships[0].role}</p>
                    <p><strong>Group:</strong> {user.groupMemberships[0].group.name}</p>
                    <p><strong>Group Description:</strong> {user.groupMemberships[0].group.description}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
