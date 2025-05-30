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
  console.log('Tabs component - active tab:', active);
  
  return (
    <div className="w-full max-w-[1000px] flex justify-center">
      <div className="flex bg-card rounded-xl p-2 mb-0 flex-wrap gap-1 w-fit shadow-sm border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 bg-transparent border-none rounded-lg cursor-pointer text-base transition-all duration-200 ease-in-out font-medium relative whitespace-nowrap min-h-11 flex items-center justify-center
              ${active === tab.id 
                ? 'text-white font-semibold bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/30 -translate-y-px hover:shadow-lg hover:shadow-primary/40' 
                : 'text-text-secondary hover:text-primary hover:bg-primary/8 hover:-translate-y-px focus:outline-primary focus:outline-2 focus:outline-offset-2 focus:not-focus-visible:outline-none'}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}