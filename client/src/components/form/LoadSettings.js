import React, { useEffect, useState } from 'react';

export default function LoadSettings({ savedEntries, selectedEntry, setSelectedEntry }) {
  const [query, setQuery] = useState('');

  // Assuming savedEntries are sorted by timestamp, descending.
  useEffect(() => {
    if (savedEntries.length > 0 && !selectedEntry) {
      setSelectedEntry(savedEntries[0]); // Automatically select the most recent entry on page load
    }
  }, [savedEntries, selectedEntry, setSelectedEntry]); // Dependency array ensures this effect runs only when needed

  const filteredEntries = (query === '' ? savedEntries : savedEntries.filter((entry) =>
    entry.prompts.toLowerCase().includes(query.toLowerCase())
  )).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Search..."
      />

      <div className="relative mt-2">
        <div className="overflow-auto border border-gray-200 rounded-md" style={{ maxHeight: '60vh' }}>
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompts</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positive Prompts</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negative Prompts</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LoRA</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame Rate</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ControlNet On</th>
                <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ControlNet Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.timestamp} className={`${selectedEntry === entry ? 'bg-gray-100' : ''} cursor-pointer`} onClick={() => setSelectedEntry(entry)}>
                  <td className="px-2 py-1 whitespace-nowrap">{new Date(entry.timestamp).toLocaleDateString()}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.prompts}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.positivePrompts || 'N/A'}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.negativePrompts || 'N/A'}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.loras || 'N/A'}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.maxFrames || 'N/A'}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.cn1Enabled ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{entry.cn1VidPath || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
