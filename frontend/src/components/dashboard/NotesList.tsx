'use client';

import { useState } from 'react';
import { useNotes, useCreateNote, useDeleteNote } from '@/lib/hooks';
import { Note, NoteType, NoteStatus, CreateNoteInput } from '@/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export default function NotesList() {
  const { data, loading, error } = useNotes();
  const [createNote] = useCreateNote();
  const [deleteNote] = useDeleteNote();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<CreateNoteInput>({
    title: '',
    content: '',
    type: NoteType.NOTE
  });

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
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote({ variables: { id } });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getTypeColor = (type: NoteType) => {
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
  };

  const getStatusColor = (status: NoteStatus) => {
    switch (status) {
      case NoteStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case NoteStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case NoteStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <LoadingSpinner className="py-8" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Note
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="p-6 border-b bg-gray-50">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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
            No notes found. Create your first note to get started!
          </div>
        ) : (
          notes.map((note: Note) => (
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
                    <p className="text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created by {note.creator.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
