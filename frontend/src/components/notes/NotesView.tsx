'use client';

import NoteCard from './NoteCard';

interface NotesViewProps {
  viewMode: 'grid' | 'list' | 'kanban';
}

// Mock data for notes
const mockNotes = [
  {
    id: '1',
    title: 'API Architecture Design',
    content: 'Reviewed GraphQL schema design and endpoint specifications. Discussed authentication flow and data synchronization strategies for offline support.',
    tags: ['api', 'architecture', 'technical'],
    author: 'John Doe',
    createdAt: '1 week ago',
    category: 'Technical',
    isPinned: true,
  },
  {
    id: '2',
    title: 'User Research Findings',
    content: 'Conducted interviews with 12 users to understand their note-taking and task management workflows. Key insights on offline usage patterns.',
    tags: ['research', 'user-experience', 'insights'],
    author: 'Sarah Wilson',
    createdAt: '2 weeks ago',
    category: 'Research',
    isPinned: false,
  },
  {
    id: '3',
    title: 'Team Meeting Notes',
    content: 'Weekly standup discussion about project progress, upcoming deadlines, and resource allocation for the next sprint.',
    tags: ['meeting', 'team', 'planning'],
    author: 'Mike Johnson',
    createdAt: '3 days ago',
    category: 'Meeting',
    isPinned: false,
  },
  {
    id: '4',
    title: 'Design Inspiration',
    content: 'Collection of UI patterns and design references for the mobile app interface. Focus on accessibility and clean layouts.',
    tags: ['design', 'ui', 'inspiration'],
    author: 'Emily Chen',
    createdAt: '5 days ago',
    category: 'Design',
    isPinned: false,
  },
  {
    id: '5',
    title: 'Bug Investigation',
    content: 'Investigating sync issues reported by beta users. Potential race condition in the offline data reconciliation process.',
    tags: ['bug', 'sync', 'investigation'],
    author: 'Alex Rodriguez',
    createdAt: '1 day ago',
    category: 'Technical',
    isPinned: false,
  },
  {
    id: '6',
    title: 'Marketing Strategy',
    content: 'Outline for product launch campaign including social media strategy, content calendar, and influencer partnerships.',
    tags: ['marketing', 'strategy', 'launch'],
    author: 'Lisa Park',
    createdAt: '4 days ago',
    category: 'Business',
    isPinned: false,
  },
];

export default function NotesView({ viewMode }: NotesViewProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockNotes.map((note) => (
          <NoteCard key={note.id} note={note} viewMode="grid" />
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {mockNotes.map((note) => (
          <NoteCard key={note.id} note={note} viewMode="list" />
        ))}
      </div>
    );
  }

  // Kanban view for notes (organized by category)
  const categories = ['Technical', 'Research', 'Design', 'Meeting', 'Business'];
  const notesByCategory = categories.reduce((acc, category) => {
    acc[category] = mockNotes.filter(note => note.category === category);
    return acc;
  }, {} as Record<string, typeof mockNotes>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {categories.map((category) => (
        <div key={category} className="flex-shrink-0 w-80">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{category}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {notesByCategory[category]?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {notesByCategory[category]?.map((note) => (
                <NoteCard key={note.id} note={note} viewMode="kanban" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}