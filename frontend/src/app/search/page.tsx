import WebLayout from '@/components/layout/WebLayout';

function SearchContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600">Search across notes, tasks, and issues</p>
      </div>

      <div className="max-w-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Filters</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              📝 All Notes
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              ✅ All Tasks
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              🐛 All Issues
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              💬 All Comments
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 px-3 py-2">
              "project planning"
            </div>
            <div className="text-sm text-gray-600 px-3 py-2">
              "bug fixes"
            </div>
            <div className="text-sm text-gray-600 px-3 py-2">
              "team meeting"
            </div>
            <div className="text-sm text-gray-600 px-3 py-2">
              "design system"
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">urgent</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">bug</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">feature</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">meeting</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">design</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">planning</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Enter a search term to find notes, tasks, and issues</p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <WebLayout>
      <SearchContent />
    </WebLayout>
  );
}
