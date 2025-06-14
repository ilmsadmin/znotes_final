'use client';

import { useState } from 'react';
import IssueCard from './IssueCard';
import { Note } from '@/types';

interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'enhancement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'closed';
  assignee: string;
  reporter: string;
  createdAt: string;
  tags: string[];
}

interface IssuesViewProps {
  viewMode: 'grid' | 'list' | 'kanban';
  issues?: Note[]; // Notes from the API
  loading?: boolean;
  onIssueClick?: (issueId: string) => void;
  onEditClick?: (issueId: string) => void;
}

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Login Authentication Bug',
    description: 'Users are unable to login with valid credentials. The authentication system returns 401 errors intermittently.',
    type: 'bug',
    severity: 'high',
    status: 'open',
    assignee: 'John Doe',
    reporter: 'Jane Smith',
    createdAt: '2 hours ago',
    tags: ['authentication', 'backend', 'urgent'],
  },
  {
    id: '2',
    title: 'Dark Mode Implementation',
    description: 'Add dark mode toggle functionality to improve user experience during nighttime usage.',
    type: 'feature',
    severity: 'medium',
    status: 'in-progress',
    assignee: 'Mike Johnson',
    reporter: 'Sarah Wilson',
    createdAt: '1 day ago',
    tags: ['ui', 'frontend', 'enhancement'],
  },
  {
    id: '3',
    title: 'Performance Optimization',
    description: 'Optimize database queries to improve page load times. Current response time is above acceptable thresholds.',
    type: 'enhancement',
    severity: 'medium',
    status: 'open',
    assignee: 'Alice Brown',
    reporter: 'Bob Davis',
    createdAt: '3 days ago',
    tags: ['performance', 'database', 'optimization'],
  },
  {
    id: '4',
    title: 'Critical Security Vulnerability',
    description: 'SQL injection vulnerability discovered in user input validation. Immediate fix required.',
    type: 'bug',
    severity: 'critical',
    status: 'in-progress',
    assignee: 'John Doe',
    reporter: 'Security Team',
    createdAt: '30 minutes ago',
    tags: ['security', 'critical', 'sql'],
  },
  {
    id: '5',
    title: 'Mobile App Store Submission',
    description: 'Prepare and submit the mobile application to both iOS App Store and Google Play Store.',
    type: 'feature',
    severity: 'low',
    status: 'closed',
    assignee: 'Sarah Wilson',
    reporter: 'Product Manager',
    createdAt: '1 week ago',
    tags: ['mobile', 'deployment', 'store'],
  },
  {
    id: '6',
    title: 'Email Notification System',
    description: 'Implement email notifications for important events like task assignments and deadline reminders.',
    type: 'feature',
    severity: 'medium',
    status: 'open',
    assignee: 'Mike Johnson',
    reporter: 'User Feedback',
    createdAt: '2 days ago',
    tags: ['email', 'notifications', 'backend'],
  },
];

export default function IssuesView({ viewMode, issues: propIssues, loading, onIssueClick, onEditClick }: IssuesViewProps) {
  // Transform Note objects to Issue objects for component compatibility
  const transformNoteToIssue = (note: Note): Issue => ({
    id: note.id,
    title: note.title,
    description: note.content || '',
    type: 'bug', // Default type, could be mapped based on note.tags or other criteria
    severity: (note.severity?.toLowerCase() as Issue['severity']) || 'medium',
    status: note.status === 'open' ? 'open' : 
            note.status === 'in_progress' ? 'in-progress' : 'closed',
    assignee: note.assignments?.[0]?.assignee?.name || 'Unassigned',
    reporter: note.creator?.name || 'Unknown',
    createdAt: note.createdAt || '',
    tags: note.tags || [],
  });

  const transformedIssues = propIssues ? propIssues.map(transformNoteToIssue) : mockIssues;
  const [issues] = useState<Issue[]>(transformedIssues);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading skeleton for issues */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === statusFilter);

  const statusCounts = {
    all: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    'in-progress': issues.filter(i => i.status === 'in-progress').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

  if (viewMode === 'kanban') {
    return <IssuesKanbanView issues={issues} onIssueClick={onIssueClick} onEditClick={onEditClick} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Issues"
          count={statusCounts.all}
          color="bg-gray-100 text-gray-700"
          icon="🎯"
        />
        <StatCard
          title="Open"
          count={statusCounts.open}
          color="bg-red-100 text-red-700"
          icon="🔴"
        />
        <StatCard
          title="In Progress"
          count={statusCounts['in-progress']}
          color="bg-blue-100 text-blue-700"
          icon="🔵"
        />
        <StatCard
          title="Closed"
          count={statusCounts.closed}
          color="bg-green-100 text-green-700"
          icon="✅"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600 mb-6">No issues match the current filter</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} viewMode={viewMode} onIssueClick={onIssueClick} onEditClick={onEditClick} />
          ))}
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  count: number;
  color: string;
  icon: string;
}

function StatCard({ title, count, color, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-700', '-100')}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );
}

interface IssuesKanbanViewProps {
  issues: Issue[];
  onIssueClick?: (issueId: string) => void;
  onEditClick?: (issueId: string) => void;
}

function IssuesKanbanView({ issues, onIssueClick, onEditClick }: IssuesKanbanViewProps) {
  const columns = [
    { id: 'open', title: 'Open', color: 'bg-red-50 border-red-200' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'closed', title: 'Closed', color: 'bg-green-50 border-green-200' },
  ];

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.status]) {
      acc[issue.status] = [];
    }
    acc[issue.status].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className={`min-w-80 rounded-xl p-4 border-2 ${column.color}`}>
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
            <span className="bg-white text-gray-600 px-3 py-1 rounded-full text-sm font-medium border">
              {groupedIssues[column.id]?.length || 0}
            </span>
          </div>

          <div className="space-y-3">
            {(groupedIssues[column.id] || []).map((issue) => (
              <IssueCard key={issue.id} issue={issue} viewMode="kanban" onIssueClick={onIssueClick} onEditClick={onEditClick} />
            ))}
          </div>

          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Issue
          </button>
        </div>
      ))}
    </div>
  );
}