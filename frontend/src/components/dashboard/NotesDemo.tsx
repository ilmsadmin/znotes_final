'use client';

import { useState, useEffect } from 'react';
import { useNotes, useCreateNote } from '@/lib/hooks';
import { NoteType } from '@/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export default function NotesDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data, loading, error, refetch } = useNotes();
  const [createNote, { loading: creating }] = useCreateNote();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: NoteType.NOTE
  });

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

  const notes = data?.notes || [];

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    try {
      await createNote({
        variables: { input: newNote }
      });
      setNewNote({ title: '', content: '', type: NoteType.NOTE });
      setIsCreating(false);
      refetch(); // Refetch to update the list
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // If not mounted yet, show loading to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="text-center">
            <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600">Please login using the Authentication Demo above to view and manage notes.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner className="py-8" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Live Notes Demo</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Note'}
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="p-6 border-b bg-gray-50">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newNote.type}
                onChange={(e) => setNewNote({ ...newNote, type: e.target.value as NoteType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={NoteType.NOTE}>Note</option>
                <option value={NoteType.TASK}>Task</option>
                <option value={NoteType.MEETING}>Meeting</option>
                <option value={NoteType.ANNOUNCEMENT}>Announcement</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating || !newNote.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="divide-y">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No notes found</p>
            <p>Create your first note to see the live integration in action!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(note.type)}`}>
                      {note.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(note.status)}`}>
                      {note.status.replace('_', ' ')}
                    </span>
                  </div>
                  {note.content && (
                    <p className="text-gray-600 mb-2">{note.content}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created by {note.creator.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getTypeColor(type: NoteType) {
  switch (type) {
    case NoteType.TASK:
      return 'bg-green-100 text-green-800';
    case NoteType.MEETING:
      return 'bg-purple-100 text-purple-800';
    case NoteType.ANNOUNCEMENT:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}
