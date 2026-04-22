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
    <nav className="flex items-center">
      <div className="flex bg-surface-100 rounded-xl p-1 gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-1.5 border-none rounded-lg cursor-pointer text-sm transition-all duration-200 ease-out font-medium whitespace-nowrap
              ${active === tab.id
                ? 'bg-white text-primary-700 shadow-app-sm font-semibold'
                : 'bg-transparent text-text-muted hover:text-text-primary'
              }
              max-md:px-3 max-md:text-xs`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
