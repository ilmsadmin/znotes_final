'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes, useCurrentUser } from '@/lib/hooks';
import NotesGridView from './NotesGridView';
import NotesKanbanView from './NotesKanbanView';
import TasksView from '../tasks/TasksView';
import IssuesView from '../issues/IssuesView';
import LoginPrompt from '../auth/LoginPrompt';

type TabType = 'notes' | 'tasks' | 'issues';
type ViewType = 'grid' | 'kanban' | 'list';

export default function WebDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [viewMode, setViewMode] = useState<ViewType>('grid');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const { data: notesData, loading: notesLoading } = useNotes();
  const { data: userData } = useCurrentUser();

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

  // Set default view mode based on active tab
  useEffect(() => {
    if (activeTab === 'notes') {
      setViewMode('grid');
    } else if (activeTab === 'tasks') {
      setViewMode('kanban');
    } else if (activeTab === 'issues') {
      setViewMode('list');
    }
  }, [activeTab]);

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  const notes = notesData?.notes || [];
  const user = userData?.me;

  const handleCreateNew = () => {
    switch (activeTab) {
      case 'notes':
        router.push('/notes?mode=create');
        break;
      case 'tasks':
        router.push('/tasks?mode=create');
        break;
      case 'issues':
        router.push('/issues?mode=create');
        break;
      default:
        router.push('/notes?mode=create');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            Welcome back, {user.name}! 
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </h2>
          <p className="text-blue-100">
            Here&apos;s your productivity dashboard. You have {notes.length} notes ready to review.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          <TabButton 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Notes
          </TabButton>
          <TabButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tasks
          </TabButton>
          <TabButton 
            active={activeTab === 'issues'} 
            onClick={() => setActiveTab('issues')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.5 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Issues
          </TabButton>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          {/* View Mode Buttons */}
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </ViewButton>
            <ViewButton
              active={viewMode === 'kanban'}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zM3 8a1 1 0 000 2h14a1 1 0 100-2H3zM3 12a1 1 0 100 2h14a1 1 0 100-2H3z" />
              </svg>
            </ViewButton>
          </div>

          {/* Create Button */}
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'notes' && (
          <div className="notes-content">
            {viewMode === 'grid' && <NotesGridView notes={notes} loading={notesLoading} />}
            {viewMode === 'kanban' && <NotesKanbanView notes={notes} loading={notesLoading} />}
            {viewMode === 'list' && <NotesGridView notes={notes} loading={notesLoading} viewMode="list" />}
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <TasksView viewMode={viewMode} />
        )}
        
        {activeTab === 'issues' && (
          <IssuesView viewMode={viewMode} />
        )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

interface ViewButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}

function ViewButton({ children, active, onClick, title }: ViewButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}
