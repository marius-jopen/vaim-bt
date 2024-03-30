// LoadSettings.js
import React, { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LoadSettings({ savedEntries, selectedEntry, setSelectedEntry }) {
  const [query, setQuery] = useState('');

  const filteredEntries = (query === '' ? savedEntries : savedEntries.filter((entry) =>
    entry.prompts.toLowerCase().includes(query.toLowerCase())
  )).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
<Combobox as="div" value={selectedEntry} onChange={(newSelectedEntry) => setSelectedEntry(newSelectedEntry)}>
    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Select a setting</Combobox.Label>
    <div className="relative mt-2">
      <Combobox.Button className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
        <span className="block truncate">
          {selectedEntry ? selectedEntry.prompts : 'Choose a setting'}
        </span>
        {/* <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 h-5 w-5 text-gray-400" /> */}
      </Combobox.Button>
      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {filteredEntries.map((entry) => (
          <Combobox.Option
            key={entry.timestamp}
            value={entry}
            className={({ active }) => classNames(
                'relative cursor-default select-none py-2 pl-3 pr-9',
                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
            )}
          >
            {({ selected }) => (
              <>
                <span className="block truncate">
                  {entry.prompts} - {new Date(entry.timestamp).toLocaleString()}
                </span>
                {selected && (
                  <CheckIcon className="absolute inset-y-0 right-0 flex items-center pr-4 h-5 w-5" aria-hidden="true" />
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </div>
  </Combobox>

  );
}
