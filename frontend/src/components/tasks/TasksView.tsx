'use client';

import TaskCard from './TaskCard';

interface TasksViewProps {
  viewMode: 'grid' | 'list' | 'kanban';
}

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Design User Profile Screens',
    description: 'Create mockups and prototypes for user profile and account settings.',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignee: 'Emily Chen',
    dueDate: 'This week',
    estimatedTime: '6h',
    tags: ['design', 'ui', 'mobile'],
  },
  {
    id: '2',
    title: 'Database Schema Implementation',
    description: 'Design and implement PostgreSQL schema for notes, tasks, and user management.',
    status: 'in-progress' as const,
    priority: 'high' as const,
    assignee: 'Alex Rodriguez',
    dueDate: 'Today',
    estimatedTime: '12h',
    tags: ['backend', 'database', 'schema'],
  },
  {
    id: '3',
    title: 'Authentication Flow Testing',
    description: 'Test OAuth integration and user session management across all platforms.',
    status: 'in-progress' as const,
    priority: 'high' as const,
    assignee: 'Mike Johnson',
    dueDate: 'Tomorrow',
    estimatedTime: '8h',
    tags: ['auth', 'testing', 'security'],
  },
  {
    id: '4',
    title: 'API Documentation Update',
    description: 'Update GraphQL API documentation with new endpoints and authentication methods.',
    status: 'done' as const,
    priority: 'medium' as const,
    assignee: 'John Doe',
    dueDate: 'Last week',
    estimatedTime: '4h',
    tags: ['documentation', 'api', 'graphql'],
  },
  {
    id: '5',
    title: 'Mobile App Store Submission',
    description: 'Prepare and submit iOS and Android apps to respective app stores.',
    status: 'todo' as const,
    priority: 'low' as const,
    assignee: 'Sarah Wilson',
    dueDate: 'Next month',
    estimatedTime: '16h',
    tags: ['mobile', 'deployment', 'store'],
  },
  {
    id: '6',
    title: 'Performance Optimization',
    description: 'Optimize database queries and implement caching strategies for better performance.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    assignee: 'Alex Rodriguez',
    dueDate: 'Next week',
    estimatedTime: '10h',
    tags: ['performance', 'optimization', 'backend'],
  },
];

export default function TasksView({ viewMode }: TasksViewProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} viewMode="grid" />
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} viewMode="list" />
        ))}
      </div>
    );
  }

  // Kanban view for tasks (organized by status)
  const statuses = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status.id] = mockTasks.filter(task => task.status === status.id);
    return acc;
  }, {} as Record<string, typeof mockTasks>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <div key={status.id} className="flex-shrink-0 w-80">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {tasksByStatus[status.id]?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus[status.id]?.map((task) => (
                <TaskCard key={task.id} task={task} viewMode="kanban" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}