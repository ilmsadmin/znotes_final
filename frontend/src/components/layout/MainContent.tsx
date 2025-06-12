'use client';

import NotesView from '../notes/NotesView';
import TasksView from '../tasks/TasksView';
import IssuesView from '../issues/IssuesView';

interface MainContentProps {
  activeTab: 'notes' | 'tasks' | 'issues';
  viewMode: 'grid' | 'list' | 'kanban';
  onTabChange: (tab: 'notes' | 'tasks' | 'issues') => void;
  onViewChange: (view: 'grid' | 'list' | 'kanban') => void;
}

export default function MainContent({ 
  activeTab, 
  viewMode, 
  onTabChange, 
  onViewChange 
}: MainContentProps) {
  const tabs = [
    { id: 'notes' as const, label: 'Notes', count: 12 },
    { id: 'tasks' as const, label: 'Tasks', count: 8 },
    { id: 'issues' as const, label: 'Issues', count: 3 },
  ];

  const viewButtons = [
    { id: 'grid' as const, icon: '⊞', label: 'Grid' },
    { id: 'list' as const, icon: '☰', label: 'List' },
    { id: 'kanban' as const, icon: '⊟', label: 'Kanban' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6 bg-gray-50">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 lg:px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            {viewButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => onViewChange(button.id)}
                className={`w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200 ${
                  viewMode === button.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
          </div>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm lg:text-base">
            New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1">
        {activeTab === 'notes' && <NotesView viewMode={viewMode} />}
        {activeTab === 'tasks' && <TasksView viewMode={viewMode} />}
        {activeTab === 'issues' && <IssuesView viewMode={viewMode} />}
      </div>
    </div>
  );
}