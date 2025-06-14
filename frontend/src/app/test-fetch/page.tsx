'use client';

import { useState } from 'react';

export default function TestFetchPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-toan-firebase-uid:toan@zplus.vn'
        },
        body: JSON.stringify({
          query: `
            mutation CreateNote($input: CreateNoteInput!) {
              createNote(input: $input) {
                id
                title
                content
                type
                status
                createdAt
                creator {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            input: {
              title: "Frontend Fetch Test",
              content: "Testing with raw fetch",
              type: "note",
              priority: "medium",
              tags: ["fetch", "test"]
            }
          }
        })
      });

      const data = await response.json();
      setResult({ response: data, status: response.status });
      console.log('Fetch result:', data);
    } catch (error) {
      setResult({ error: error?.toString() });
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  const handleQueryTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-toan-firebase-uid:toan@zplus.vn'
        },
        body: JSON.stringify({
          query: `
            query GetMe {
              me {
                id
                name
                email
                groupMemberships {
                  id
                  role
                  group {
                    id
                    name
                    creator {
                      id
                      name
                    }
                  }
                }
              }
            }
          `
        })
      });

      const data = await response.json();
      setResult({ response: data, status: response.status });
      console.log('Query result:', data);
    } catch (error) {
      setResult({ error: error?.toString() });
      console.error('Query error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Raw Fetch</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={handleQueryTest}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test GetMe Query'}
          </button>
          
          <button 
            onClick={handleFetchTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Test Create Note'}
          </button>
        </div>

        <div>
          <strong>Result:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto max-h-96">
            {result ? JSON.stringify(result, null, 2) : 'No result yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
