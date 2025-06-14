'use client';

import TaskCard from './TaskCard';
import { Note } from '@/types';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  estimatedTime: string;
  tags: string[];
}

interface TasksViewProps {
  viewMode: 'grid' | 'list' | 'kanban';
  tasks?: Note[]; // Notes from the API
  loading?: boolean;
  onTaskClick?: (taskId: string) => void;
  onEditClick?: (taskId: string) => void;
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

export default function TasksView({ viewMode, tasks: propTasks, loading, onTaskClick, onEditClick }: TasksViewProps) {
  // Transform Note objects to Task objects for component compatibility
  const transformNoteToTask = (note: Note): Task => ({
    id: note.id,
    title: note.title,
    description: note.content || '',
    status: note.status === 'open' ? 'todo' : 
            note.status === 'in_progress' ? 'in-progress' : 'done',
    priority: (note.priority?.toLowerCase() as Task['priority']) || 'medium',
    assignee: note.assignments?.[0]?.assignee?.name || 'Unassigned',
    dueDate: note.deadline ? new Date(note.deadline).toLocaleDateString() : 'No deadline',
    estimatedTime: note.estimatedTime ? `${note.estimatedTime}h` : 'N/A',
    tags: note.tags || [],
  });

  const transformedTasks = propTasks ? propTasks.map(transformNoteToTask) : mockTasks;
  const tasks = transformedTasks;
  if (loading) {
    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} viewMode="grid" onTaskClick={onTaskClick} onEditClick={onEditClick} />
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} viewMode="list" onTaskClick={onTaskClick} onEditClick={onEditClick} />
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
    acc[status.id] = tasks.filter(task => task.status === status.id);
    return acc;
  }, {} as Record<string, typeof tasks>);

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
                <TaskCard key={task.id} task={task} viewMode="kanban" onTaskClick={onTaskClick} onEditClick={onEditClick} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}