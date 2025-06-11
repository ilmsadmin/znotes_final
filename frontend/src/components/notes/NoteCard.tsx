'use client';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
  category: string;
  isPinned: boolean;
}

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list' | 'kanban';
}

export default function NoteCard({ note, viewMode }: NoteCardProps) {
  const baseClasses = "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer";
  
  if (viewMode === 'list') {
    return (
      <div className={`${baseClasses} flex items-start gap-4`}>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                {note.isPinned && <span className="text-yellow-500">📌</span>}
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{note.author} • {note.createdAt} • {note.category}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 px-2 py-1">⋯</button>
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{note.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">💬</button>
              <button className="text-gray-400 hover:text-gray-600">📎</button>
              <button className="text-gray-400 hover:text-gray-600">⭐</button>
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
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            {note.isPinned && <span className="text-yellow-500">📌</span>}
            {note.title}
          </h3>
          <p className="text-sm text-gray-500">{note.author} • {note.createdAt}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 px-1">⋯</button>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{note.content}</p>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{note.category}</span>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">💬</button>
            <button className="text-gray-400 hover:text-gray-600">📎</button>
            <button className="text-gray-400 hover:text-gray-600">⭐</button>
          </div>
        </div>
      </div>
    </div>
  );
}