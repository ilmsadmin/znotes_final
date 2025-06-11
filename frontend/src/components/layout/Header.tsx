'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button className="lg:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">
            ☰
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-48 lg:w-80">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            />
          </div>

          {/* Action Buttons */}
          <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            🔔
          </button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            ➕
          </button>
        </div>
      </div>
    </header>
  );
}