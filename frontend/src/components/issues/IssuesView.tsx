'use client';

import IssueCard from './IssueCard';

interface IssuesViewProps {
  viewMode: 'grid' | 'list' | 'kanban';
}

// Mock data for issues
const mockIssues = [
  {
    id: '1',
    title: 'Sync conflict on mobile devices',
    description: 'Users report data conflicts when switching between devices with poor network connectivity.',
    type: 'bug' as const,
    severity: 'high' as const,
    status: 'open' as const,
    assignee: 'Alex Rodriguez',
    reporter: 'John Doe',
    createdAt: '2 days ago',
    tags: ['sync', 'mobile', 'network'],
  },
  {
    id: '2',
    title: 'Add dark mode support',
    description: 'Implement dark mode theme for better user experience in low-light environments.',
    type: 'feature' as const,
    severity: 'medium' as const,
    status: 'in-progress' as const,
    assignee: 'Emily Chen',
    reporter: 'Sarah Wilson',
    createdAt: '1 week ago',
    tags: ['ui', 'theme', 'accessibility'],
  },
  {
    id: '3',
    title: 'Performance issue with large notes',
    description: 'Application becomes sluggish when editing notes with more than 10,000 characters.',
    type: 'bug' as const,
    severity: 'medium' as const,
    status: 'closed' as const,
    assignee: 'Mike Johnson',
    reporter: 'Lisa Park',
    createdAt: '3 weeks ago',
    tags: ['performance', 'editor', 'optimization'],
  },
];

export default function IssuesView({ viewMode }: IssuesViewProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} viewMode="grid" />
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {mockIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} viewMode="list" />
        ))}
      </div>
    );
  }

  // Kanban view for issues (organized by status)
  const statuses = [
    { id: 'open', title: 'Open', color: 'red' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'closed', title: 'Closed', color: 'green' },
  ];

  const issuesByStatus = statuses.reduce((acc, status) => {
    acc[status.id] = mockIssues.filter(issue => issue.status === status.id);
    return acc;
  }, {} as Record<string, typeof mockIssues>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <div key={status.id} className="flex-shrink-0 w-80">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {issuesByStatus[status.id]?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {issuesByStatus[status.id]?.map((issue) => (
                <IssueCard key={issue.id} issue={issue} viewMode="kanban" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}