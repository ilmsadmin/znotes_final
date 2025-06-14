'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WebLayout from '@/components/layout/WebLayout';
import TasksView from '@/components/tasks/TasksView';
import NoteForm from '@/components/notes/NoteForm';
import NoteDetail from '@/components/notes/NoteDetail';
import { useTasks } from '@/lib/hooks';
import { NoteType } from '@/types';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

function TasksContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const { data: tasksData, loading: tasksLoading } = useTasks();
  const tasks = tasksData?.notesByType || [];

  // Check if we should start in create mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'create') {
      setViewMode('create');
    }
  }, [searchParams]);

  const handleCreateTask = () => {
    setSelectedTaskId(null);
    setViewMode('create');
  };

  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode('edit');
  };

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
    setViewMode('list');
  };

  const handleTaskCreated = () => {
    setViewMode('list');
  };

  const handleTaskUpdated = () => {
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
            Back to Tasks
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        </div>
        
        <NoteForm
          initialType={NoteType.TASK}
          onSuccess={handleTaskCreated}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && selectedTaskId) {
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
            Back to Tasks
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        </div>
        
        <NoteForm
          noteId={selectedTaskId}
          initialType={NoteType.TASK}
          onSuccess={handleTaskUpdated}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (viewMode === 'detail' && selectedTaskId) {
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
            Back to Tasks
          </button>
        </div>
        
        <NoteDetail
          noteId={selectedTaskId}
          onEdit={() => handleEditTask(selectedTaskId)}
          onDelete={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Organize and track your tasks</p>
        </div>
        <button 
          onClick={handleCreateTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      <TasksView 
        viewMode="kanban"
        tasks={tasks}
        loading={tasksLoading}
        onTaskClick={handleViewTask}
        onEditClick={handleEditTask}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <WebLayout>
      <TasksContent />
    </WebLayout>
  );
}
