import React, { ReactNode } from 'react';

interface TabProps {
  active: string;
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ active, tabs, onTabChange }: TabProps): React.ReactNode {
  return (
    <div className="w-full max-w-4xl flex justify-center">
      <div className="flex bg-white rounded-xl p-1.5 mb-0 flex-wrap gap-1 w-fit shadow-sm border border-gray-200 max-md:w-[calc(100%-1rem)] max-md:mx-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-2 bg-transparent border-none rounded-lg cursor-pointer text-base text-gray-600 transition-all duration-200 ease-in-out font-medium relative whitespace-nowrap min-h-9 flex items-center justify-center hover:text-blue-500 hover:bg-blue-500/8 hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 max-md:px-4 max-md:text-sm max-md:min-h-9 ${active === tab.id ? 'text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_2px_8px_rgba(59,130,246,0.3)] -translate-y-px hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}