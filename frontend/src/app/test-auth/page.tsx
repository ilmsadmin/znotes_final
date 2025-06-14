'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/hooks';

export default function TestAuthPage() {
  const [token, setToken] = useState('');
  const { data: userData, loading, error } = useCurrentUser();

  const handleSetToken = () => {
    const testToken = 'admin-toan-firebase-uid:toan@zplus.vn';
    localStorage.setItem('auth_token', testToken);
    document.cookie = `auth_token=${testToken}; path=/; max-age=2592000`;
    setToken(testToken);
    window.location.reload();
  };

  const handleClearToken = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setToken('');
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handleSetToken}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Set Demo Token
          </button>
          <button 
            onClick={handleClearToken}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear Token
          </button>
        </div>

        <div>
          <strong>Current Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('auth_token') || 'None' : 'Loading...'}
        </div>

        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>

        <div>
          <strong>Error:</strong> {error ? JSON.stringify(error, null, 2) : 'None'}
        </div>

        <div>
          <strong>User Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {userData ? JSON.stringify(userData, null, 2) : 'No data'}
          </pre>
        </div>
      </div>
    </div>
  );
}
