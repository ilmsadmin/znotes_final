'use client';

import React, { useState, useEffect } from 'react';
import { useCreateNote, useUpdateNote, useNote } from '@/lib/hooks/useNotes';
import { useUsersInGroup } from '@/lib/hooks';
import { CreateNoteInput, UpdateNoteInput, NoteType, Priority, Severity } from '@/types';

interface NoteFormProps {
  noteId?: string;
  initialType?: NoteType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NoteForm({ noteId, initialType = NoteType.NOTE, onSuccess, onCancel }: NoteFormProps) {
  const isEditing = !!noteId;
  
  // Hooks
  const { data: noteData, loading: noteLoading } = useNote(noteId || '');
  const { data: usersData } = useUsersInGroup();
  const [createNote, { loading: createLoading }] = useCreateNote();
  const [updateNote, { loading: updateLoading }] = useUpdateNote();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: initialType,
    status: 'open',
    priority: Priority.MEDIUM,
    severity: Severity.MEDIUM,
    deadline: '',
    estimatedTime: 0,
    tags: [] as string[],
    assigneeIds: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const isLoading = createLoading || updateLoading;

  // Load existing note data when editing
  useEffect(() => {
    if (isEditing && noteData?.note) {
      const note = noteData.note;
      setFormData({
        title: note.title,
        content: note.content,
        type: note.type,
        status: note.status,
        priority: note.priority || Priority.MEDIUM,
        severity: note.severity || Severity.MEDIUM,
        deadline: note.deadline || '',
        estimatedTime: note.estimatedTime || 0,
        tags: note.tags || [],
        assigneeIds: note.assignments?.map(a => a.assignee.id) || []
      });
    }
  }, [isEditing, noteData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const updateInput: UpdateNoteInput = {
          title: formData.title,
          content: formData.content,
          status: formData.status as any,
          priority: formData.priority,
          severity: formData.severity,
          deadline: formData.deadline || undefined,
          estimatedTime: formData.estimatedTime || undefined,
          tags: formData.tags
        };
        
        await updateNote({
          variables: {
            id: noteId!,
            input: updateInput
          }
        });
      } else {
        const createInput: CreateNoteInput = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          priority: formData.priority,
          severity: formData.severity,
          deadline: formData.deadline || undefined,
          estimatedTime: formData.estimatedTime || undefined,
          tags: formData.tags
        };
        
        await createNote({ variables: { input: createInput } });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  // Handle tag addition
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (isEditing && noteLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit' : 'Create'} {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Type (only show when creating) */}
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NoteType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={NoteType.NOTE}>Note</option>
              <option value={NoteType.TASK}>Task</option>
              <option value={NoteType.ISSUE}>Issue</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Status, Priority, Severity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
            </select>
          </div>

          {formData.type === NoteType.ISSUE && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as Severity }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={Severity.LOW}>Low</option>
                <option value={Severity.MEDIUM}>Medium</option>
                <option value={Severity.CRITICAL}>Critical</option>
              </select>
            </div>
          )}
        </div>

        {/* Deadline and Estimated Time */}
        {(formData.type === NoteType.TASK || formData.type === NoteType.ISSUE) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (hours)
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Assignees (only for create) */}
        {!isEditing && usersData?.usersInGroup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to
            </label>
            <select
              multiple
              value={formData.assigneeIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, assigneeIds: values }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              size={4}
            >
              {usersData.usersInGroup.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple users</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
