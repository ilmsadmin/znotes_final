'use client';

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

interface TaskCardProps {
  task: Task;
  viewMode: 'grid' | 'list' | 'kanban';
}

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const priorityIndicators = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
};

export default function TaskCard({ task, viewMode }: TaskCardProps) {
  const baseClasses = "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer";
  
  if (viewMode === 'list') {
    return (
      <div className={`${baseClasses} flex items-start gap-4`}>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-lg">{priorityIndicators[task.priority]}</span>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${priorityColors[task.priority]}`}>
                  {task.priority} priority
                </span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 px-2 py-1">⋯</button>
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {task.assignee} • Due: {task.dueDate} • {task.estimatedTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid and Kanban view (similar layout, different container sizing)
  return (
    <div className={baseClasses}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{priorityIndicators[task.priority]}</span>
          <span className={`px-2 py-1 text-xs rounded ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 px-1">⋯</button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{task.description}</p>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-500">
          Due: {task.dueDate} • {task.estimatedTime} estimated
        </div>
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">👤 {task.assignee}</span>
          <span className={`px-2 py-1 text-xs rounded ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}