'use client';

import { Note, NoteType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotesKanbanViewProps {
  notes: Note[];
  loading: boolean;
}

type ColumnType = 'todo' | 'in-progress' | 'review' | 'done';

interface KanbanColumn {
  id: ColumnType;
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

export default function NotesKanbanView({ notes, loading }: NotesKanbanViewProps) {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-80 bg-white rounded-xl p-4 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group notes by status (for demo purposes, we'll distribute them across columns)
  const groupedNotes = notes.reduce((acc, note, index) => {
    const columnIndex = index % columns.length;
    const column = columns[columnIndex];
    if (!acc[column.id]) {
      acc[column.id] = [];
    }
    acc[column.id].push(note);
    return acc;
  }, {} as Record<ColumnType, Note[]>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumnComponent
          key={column.id}
          column={column}
          notes={groupedNotes[column.id] || []}
        />
      ))}
    </div>
  );
}

interface KanbanColumnComponentProps {
  column: KanbanColumn;
  notes: Note[];
}

function KanbanColumnComponent({ column, notes }: KanbanColumnComponentProps) {
  return (
    <div className="min-w-80 bg-white rounded-xl p-4 border border-gray-200">
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {notes.length}
        </span>
      </div>

      {/* Notes */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm">No notes in {column.title.toLowerCase()}</p>
          </div>
        ) : (
          notes.map((note) => (
            <KanbanNoteCard key={note.id} note={note} />
          ))
        )}
      </div>

      {/* Add Button */}
      <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Note
      </button>
    </div>
  );
}

interface KanbanNoteCardProps {
  note: Note;
}

function KanbanNoteCard({ note }: KanbanNoteCardProps) {
  const typeIcons = {
    [NoteType.NOTE]: '📝',
    [NoteType.TASK]: '✅',
    [NoteType.ISSUE]: '🐛',
    [NoteType.MEETING]: '🎯',
    [NoteType.ANNOUNCEMENT]: '📢',
  };

  const typeColors = {
    [NoteType.NOTE]: 'bg-blue-100 text-blue-700',
    [NoteType.TASK]: 'bg-green-100 text-green-700',
    [NoteType.ISSUE]: 'bg-red-100 text-red-700',
    [NoteType.MEETING]: 'bg-purple-100 text-purple-700',
    [NoteType.ANNOUNCEMENT]: 'bg-orange-100 text-orange-700',
  };

  const priorityColors = ['bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-red-100 text-red-700'];
  const priority = Math.floor(Math.random() * 3); // Demo priority

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Priority Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{typeIcons[note.type]}</span>
        <span className={`px-2 py-1 text-xs rounded ${priorityColors[priority]}`}>
          {priority === 0 ? 'Low' : priority === 1 ? 'Medium' : 'High'}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{note.title}</h4>

      {/* Content */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {note.content || 'No content available'}
      </p>

      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 text-xs rounded ${typeColors[note.type]}`}>
          {note.type}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>👤 {note.creator?.name}</span>
        <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-200">
        <button className="w-8 h-8 rounded bg-white hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-colors">
          💬
        </button>
        <button className="w-8 h-8 rounded bg-white hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-colors">
          📎
        </button>
        <button className="w-8 h-8 rounded bg-white hover:bg-yellow-50 hover:text-yellow-600 flex items-center justify-center text-gray-500 transition-colors">
          ⭐
        </button>
      </div>
    </div>
  );
}
