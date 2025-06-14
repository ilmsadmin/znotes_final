'use client';

import React, { useState } from 'react';
import { useNote, useDeleteNote, usePinNote } from '@/lib/hooks/useNotes';
import { useCommentsByNote, useCreateComment } from '@/lib/hooks/useComments';
import { useAssignmentsByNote, useCreateAssignment, useUnassignFromNote } from '@/lib/hooks/useAssignments';
import { useUsersInGroup } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';
import { CreateCommentInput, CreateAssignmentInput } from '@/types';

interface NoteDetailProps {
  noteId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NoteDetail({ noteId, onEdit, onDelete }: NoteDetailProps) {
  // Hooks
  const { data: noteData, loading: noteLoading } = useNote(noteId);
  const { data: commentsData, loading: commentsLoading } = useCommentsByNote(noteId);
  const { data: assignmentsData } = useAssignmentsByNote(noteId);
  const { data: usersData } = useUsersInGroup();
  
  const [deleteNote] = useDeleteNote();
  const [pinNote] = usePinNote();
  const [createComment] = useCreateComment();
  const [createAssignment] = useCreateAssignment();
  const [unassignFromNote] = useUnassignFromNote();

  // State
  const [newComment, setNewComment] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  if (noteLoading) {
    return <div className="p-6 text-center">Loading note...</div>;
  }

  if (!noteData?.note) {
    return <div className="p-6 text-center text-red-500">Note not found</div>;
  }

  const note = noteData.note;
  const comments = commentsData?.commentsByNote || [];
  const assignments = assignmentsData?.assignmentsByNote || [];
  const users = usersData?.usersInGroup || [];

  // Handle pin/unpin
  const handleTogglePin = async () => {
    try {
      await pinNote({
        variables: {
          id: noteId,
          isPinned: !note.isPinned
        }
      });
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote({ variables: { id: noteId } });
        onDelete?.();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  // Handle comment creation
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const input: CreateCommentInput = {
        noteId,
        content: newComment.trim()
      };
      await createComment({ variables: { input } });
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedAssignee) return;

    try {
      const input: CreateAssignmentInput = {
        noteId,
        assigneeId: selectedAssignee
      };
      await createAssignment({ variables: { input } });
      setSelectedAssignee('');
      setShowAssignDialog(false);
    } catch (error) {
      console.error('Failed to assign user:', error);
    }
  };

  // Handle unassign
  const handleUnassign = async (assigneeId: string) => {
    try {
      await unassignFromNote({ variables: { noteId, assigneeId } });
    } catch (error) {
      console.error('Failed to unassign user:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'open': return 'text-gray-600 bg-gray-100';
      case 'archived': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              {note.type}
            </span>
            {note.isPinned && (
              <span className="text-yellow-500">📌</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{note.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Created by {note.creator.name}</span>
            <span>{formatDate(note.createdAt)}</span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>Updated {formatDate(note.updatedAt)}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePin}
            className="p-2 text-gray-500 hover:text-yellow-500 rounded-md hover:bg-gray-100"
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-md hover:bg-gray-100"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-gray-100"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Status and metadata */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(note.status)}`}>
          {note.status.replace('_', ' ').toUpperCase()}
        </span>
        {note.priority && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(note.priority)}`}>
            {note.priority.toUpperCase()} PRIORITY
          </span>
        )}
        {note.severity && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(note.severity)}`}>
            {note.severity.toUpperCase()} SEVERITY
          </span>
        )}
        {note.deadline && (
          <span className="px-3 py-1 rounded-full text-sm font-medium text-purple-600 bg-purple-100">
            Due: {formatDate(note.deadline)}
          </span>
        )}
        {note.estimatedTime && (
          <span className="px-3 py-1 rounded-full text-sm font-medium text-indigo-600 bg-indigo-100">
            {note.estimatedTime}h estimated
          </span>
        )}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none mb-8">
        <div className="whitespace-pre-wrap text-gray-900">
          {note.content}
        </div>
      </div>

      {/* Assignments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assignees</h2>
          <button
            onClick={() => setShowAssignDialog(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            + Assign
          </button>
        </div>
        
        {assignments.length > 0 ? (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {assignment.assignee.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{assignment.assignee.name}</div>
                    <div className="text-sm text-gray-500">{assignment.assignee.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleUnassign(assignment.assignee.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No assignees</p>
        )}

        {/* Assignment dialog */}
        {showAssignDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Assign User</h3>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select a user...</option>
                {users
                  .filter(user => !assignments.some(a => a.assignee.id === user.id))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAssignDialog(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAssignee}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
        
        {/* Add comment form */}
        <form onSubmit={handleCreateComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Add Comment
          </button>
        </form>

        {/* Comments list */}
        {commentsLoading ? (
          <div className="text-center text-gray-500">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {comment.author.name.charAt(0)}
                  </div>
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="text-gray-900 whitespace-pre-wrap">{comment.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
}
