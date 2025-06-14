'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WebLayout from '@/components/layout/WebLayout';
import IssuesView from '@/components/issues/IssuesView';
import NoteForm from '@/components/notes/NoteForm';
import NoteDetail from '@/components/notes/NoteDetail';
import { useIssues } from '@/lib/hooks';
import { NoteType } from '@/types';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

function IssuesContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const { data: issuesData, loading: issuesLoading } = useIssues();
  const issues = issuesData?.notesByType || [];

  // Check if we should start in create mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'create') {
      setViewMode('create');
    }
  }, [searchParams]);

  const handleCreateIssue = () => {
    setSelectedIssueId(null);
    setViewMode('create');
  };

  const handleEditIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setViewMode('edit');
  };

  const handleViewIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedIssueId(null);
    setViewMode('list');
  };

  const handleIssueCreated = () => {
    setViewMode('list');
  };

  const handleIssueUpdated = () => {
    setViewMode('detail');
  };

  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Issues
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Issue</h1>
        </div>
        
        <NoteForm
          initialType={NoteType.ISSUE}
          onSuccess={handleIssueCreated}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && selectedIssueId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Issues
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Issue</h1>
        </div>
        
        <NoteForm
          noteId={selectedIssueId}
          initialType={NoteType.ISSUE}
          onSuccess={handleIssueUpdated}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (viewMode === 'detail' && selectedIssueId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Issues
          </button>
        </div>
        
        <NoteDetail
          noteId={selectedIssueId}
          onEdit={() => handleEditIssue(selectedIssueId)}
          onDelete={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600">Track and resolve issues</p>
        </div>
        <button 
          onClick={handleCreateIssue}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Issue
        </button>
      </div>

      <IssuesView 
        viewMode="list"
        issues={issues}
        loading={issuesLoading}
        onIssueClick={handleViewIssue}
        onEditClick={handleEditIssue}
      />
    </div>
  );
}

export default function IssuesPage() {
  return (
    <WebLayout>
      <IssuesContent />
    </WebLayout>
  );
}
