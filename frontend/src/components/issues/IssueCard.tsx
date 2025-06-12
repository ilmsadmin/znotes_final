'use client';

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

interface IssueCardProps {
  issue: Issue;
  viewMode: 'grid' | 'list' | 'kanban';
}

const typeColors = {
  bug: 'bg-red-100 text-red-700',
  feature: 'bg-blue-100 text-blue-700',
  enhancement: 'bg-purple-100 text-purple-700',
};

const severityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusColors = {
  open: 'bg-red-100 text-red-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  closed: 'bg-green-100 text-green-700',
};

const statusLabels = {
  open: 'Open',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

const typeIcons = {
  bug: '🐛',
  feature: '✨',
  enhancement: '🔧',
};

const severityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  critical: '🔴',
};

export default function IssueCard({ issue, viewMode }: IssueCardProps) {
  const baseClasses = "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer";
  
  if (viewMode === 'list') {
    return (
      <div className={`${baseClasses} flex items-start gap-4`}>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-lg">{typeIcons[issue.type]}</span>
                {issue.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded ${statusColors[issue.status]}`}>
                  {statusLabels[issue.status]}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${typeColors[issue.type]}`}>
                  {issue.type}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${severityColors[issue.severity]}`}>
                  {issue.severity}
                </span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 px-2 py-1">⋯</button>
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{issue.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {issue.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              👤 {issue.assignee} • 📝 {issue.reporter} • {issue.createdAt}
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
          <span className="text-lg">{typeIcons[issue.type]}</span>
          <span className={`px-2 py-1 text-xs rounded ${statusColors[issue.status]}`}>
            {statusLabels[issue.status]}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 px-1">⋯</button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{issue.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${typeColors[issue.type]}`}>
            {issue.type}
          </span>
          <span className="flex items-center gap-1">
            {severityIcons[issue.severity]}
            <span className={`px-2 py-1 text-xs rounded ${severityColors[issue.severity]}`}>
              {issue.severity}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {issue.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>👤 {issue.assignee}</span>
          <span>{issue.createdAt}</span>
        </div>
        <div className="text-xs text-gray-500">
          Reported by {issue.reporter}
        </div>
      </div>
    </div>
  );
}