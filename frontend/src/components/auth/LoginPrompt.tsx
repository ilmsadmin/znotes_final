'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPrompt() {
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter();

  const handleDemoLogin = async () => {
    try {
      // Use real backend authentication with demo credentials
      const firebaseUid = 'admin-toan-firebase-uid';
      const email = 'toan@zplus.vn';
      const token = `${firebaseUid}:${email}`;
      
      localStorage.setItem('auth_token', token);
      
      // Set cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=2592000`; // 30 days
      
      // Trigger auth state change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
      
      // Reload page to update auth state
      window.location.reload();
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            N
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to NoteFlow</h1>
          <p className="text-gray-600">
            Sign in to access your dashboard and manage your notes, tasks, and issues.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🚀 Try Demo (No signup required)
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
          >
            Sign in with Email
          </Link>

          {showDemo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-sm">
                <strong>Demo Features:</strong><br />
                • Full dashboard with notes, tasks, and issues<br />
                • Multiple view modes (Grid, Kanban, List)<br />
                • Responsive design for all devices<br />
                • GraphQL integration with mock data
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
