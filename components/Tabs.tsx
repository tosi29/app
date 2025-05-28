import React, { ReactNode } from 'react';
import styles from '../styles/Tabs.module.css';

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
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${active === tab.id ? styles.activeTab : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}