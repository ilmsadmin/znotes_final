'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'issues'>('notes');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen max-w-full bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <MainContent 
          activeTab={activeTab}
          viewMode={viewMode}
          onTabChange={setActiveTab}
          onViewChange={setViewMode}
        />
      </div>
    </div>
  );
}