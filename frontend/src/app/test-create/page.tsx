'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_NOTE } from '@/lib/graphql';
import { CreateNoteInput, NoteType, Priority } from '@/types';

export default function TestCreatePage() {
  const [createNote, { loading, error, data }] = useMutation(CREATE_NOTE);
  const [result, setResult] = useState<any>(null);

  const handleTestCreate = async () => {
    try {
      // Set token manually
      const token = 'admin-toan-firebase-uid:toan@zplus.vn';
      localStorage.setItem('auth_token', token);

      const input: CreateNoteInput = {
        title: "Frontend Test Note",
        content: "Testing create note from frontend",
        type: NoteType.NOTE,
        priority: Priority.MEDIUM,
        tags: ["frontend", "test"]
      };

      const response = await createNote({
        variables: { input },
        context: {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      });

      setResult(response);
      console.log('Create note success:', response);
    } catch (err) {
      console.error('Create note error:', err);
      setResult({ error: err });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Create Note</h1>
      
      <div className="space-y-4">
        <button 
          onClick={handleTestCreate}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Test Create Note'}
        </button>

        <div>
          <strong>Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('auth_token') || 'None' : 'Loading...'}
        </div>

        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>

        <div>
          <strong>Error:</strong> {error ? JSON.stringify(error, null, 2) : 'None'}
        </div>

        <div>
          <strong>Result:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">
            {result ? JSON.stringify(result, null, 2) : 'No result yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
