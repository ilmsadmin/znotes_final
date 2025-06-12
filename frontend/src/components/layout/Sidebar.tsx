'use client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigationSections = [
    {
      title: 'Workspace',
      items: [
        { icon: '🏠', label: 'Dashboard', href: '/dashboard', active: true },
        { icon: '📝', label: 'All Notes', href: '/notes' },
        { icon: '✅', label: 'Tasks', href: '/tasks' },
        { icon: '🐛', label: 'Issues', href: '/issues' },
      ]
    },
    {
      title: 'Team', 
      items: [
        { icon: '👥', label: 'Members', href: '/members' },
        { icon: '📊', label: 'Analytics', href: '/analytics' },
        { icon: '⚙️', label: 'Settings', href: '/settings' },
      ]
    },
    {
      title: 'Recent',
      items: [
        { icon: '📄', label: 'Project Planning', href: '/notes/project-planning' },
        { icon: '🎨', label: 'Design System', href: '/notes/design-system' },
        { icon: '👥', label: 'Team Sync', href: '/notes/team-sync' },
      ]
    }
  ];

  const user = {
    name: 'John Doe',
    email: 'john@noteflow.dev',
    avatar: 'JD'
  };

  return (
    <div className={`w-[280px] bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-y-auto z-40 transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:block`}>
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-2xl font-bold text-gray-900">NoteFlow</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {section.title}
            </div>
            {section.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}