'use client';

import DashboardStats from '../dashboard/DashboardStats';
import AuthDemo from '../dashboard/AuthDemo';
import NotesDemo from '../dashboard/NotesDemo';

export default function GraphQLDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NoteFlow - GraphQL Integration Demo</h1>
          <p className="text-gray-600 mt-2">
            This demo shows the frontend connected to the GraphQL backend API.
          </p>
        </div>

        <div className="space-y-8">
          {/* Authentication Demo */}
          <AuthDemo />

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Notes Demo */}
          <NotesDemo />
        </div>
      </div>
    </div>
  );
}
