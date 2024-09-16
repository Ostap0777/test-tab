import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './tab.module.scss';
import { TabItems } from '../../../models/models';
import TabsList from '../TabsList/TabsList';
import { saveTabsToLocalStorage } from '../../../saveToLocalStorage';

const Tab: React.FC = () => {
  const [tabs, setTabs] = useState<TabItems[]>([]);
  const [longPress, setLongPress] = useState<boolean>(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    saveTabsToLocalStorage();
    const storedTabs = localStorage.getItem('tabs');
    console.log('Stored Tabs:', storedTabs);

    if (storedTabs) {
      try {
        const parsedData = JSON.parse(storedTabs);
        console.log('Parsed Data:', parsedData);
        const parsedTabs = parsedData.tab;
        if (Array.isArray(parsedTabs)) {
          setTabs(parsedTabs);
        } else {
          console.error('Stored data is not an array:', parsedTabs);
        }
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
      }
    } else {
      console.log('No data in localStorage');
    }
  }, []);

  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      setLongPress(true);
    }, 2000); 
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (longPress) {
      setLongPress(false);
    }
  };

  const moveTab = (fromIndex: number, toIndex: number) => {
    const updatedTabs = [...tabs];
    const [movedTab] = updatedTabs.splice(fromIndex, 1);
    updatedTabs.splice(toIndex, 0, movedTab);

    const finalTabs = updatedTabs.filter(tab => !tab.isPinned);
    const pinnedTabs = tabs.filter(tab => tab.isPinned);
    const newTabs = [...pinnedTabs, ...finalTabs];

    setTabs(newTabs);
  };

  const togglePinTab = (tabId: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, isPinned: !tab.isPinned } : tab
    );
    const sortedTabs = updatedTabs.sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

    setTabs(sortedTabs);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className={styles.tab__section}>
        <div 
          className={styles.tab__content}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img className={styles.tab__icon} src="/img/fi-rs-box-alt.svg" alt="" />
          {tabs.map((tab, index) => (
            <TabsList
              key={tab.id}
              tab={tab}
              index={index}
              moveTab={moveTab}
              togglePinTab={togglePinTab}
              tabs={tabs}
            />
          ))}
          <img className={styles.tab__vector} src="/img/Vector (13).svg" alt="" />
        </div>
      </section>
    </DndProvider>
  );
};

export default Tab;
