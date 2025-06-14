'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser, useNotes } from '@/lib/hooks';
import { NoteType } from '@/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export default function DashboardStats() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data: userData, loading: userLoading, error: userError } = useCurrentUser();
  const { data: notesData, loading: notesLoading, error: notesError } = useNotes();

  // Check authentication status on mount
  useEffect(() => {
    setMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    setIsAuthenticated(!!token);

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      const newToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      setIsAuthenticated(!!newToken);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('authStateChanged', handleAuthStateChange);
      return () => window.removeEventListener('authStateChanged', handleAuthStateChange);
    }
  }, []);

  // If not mounted yet, show loading to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-4 bg-white rounded-lg p-6 shadow-sm border">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-4 bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-center">
            <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please Login</h3>
            <p className="text-gray-600">Login using the Authentication Demo above to view your dashboard statistics.</p>
          </div>
        </div>
      </div>
    );
  }

  if (userLoading || notesLoading) return <LoadingSpinner />;
  if (userError || notesError) return <ErrorMessage error={userError || notesError || null} />;

  const notes = notesData?.notes || [];
  const user = userData?.me;

  const stats = {
    totalNotes: notes.length,
    tasks: notes.filter(note => note.type === NoteType.TASK).length,
    meetings: notes.filter(note => note.type === NoteType.MEETING).length,
    announcements: notes.filter(note => note.type === NoteType.ANNOUNCEMENT).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Notes</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalNotes}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Tasks</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.tasks}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Meetings</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.meetings}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Announcements</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.announcements}</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="md:col-span-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Welcome back, {user.name}!</h3>
          {user.groupMemberships && user.groupMemberships.length > 0 && (
            <>
              <p className="text-blue-100">
                You&apos;re part of the <strong>{user.groupMemberships[0].group.name}</strong> group
              </p>
              <p className="text-blue-100 text-sm mt-1">Role: {user.groupMemberships[0].role}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
