import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './tab.module.scss';
import { TabItems } from '../../../models/models';
import TabsList from '../TabsList/TabsList';
import { saveTabsToLocalStorage } from '../../../saveToLocalStorage';
import List from '../../List/List'; // Importing List component

const Tab: React.FC = () => {
  const [pinnedTabs, setPinnedTabs] = useState<TabItems[]>([]);
  const [overflowTabs, setOverflowTabs] = useState<TabItems[]>([]);
  const [otherTabs, setOtherTabs] = useState<TabItems[]>([]);
  const [longPress, setLongPress] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false); // State for showing List component
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const tabRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visibleTabs = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.getAttribute('data-id'));

      const allTabs = [...pinnedTabs, ...overflowTabs, ...otherTabs];
      const visibleTabsIds = new Set(visibleTabs);

      const updatedPinnedTabs = allTabs.filter(tab => tab.isPinned);
      const updatedOverflowTabs = allTabs.filter(tab => !tab.isPinned && !visibleTabsIds.has(tab.id));
      const updatedOtherTabs = allTabs.filter(tab => !tab.isPinned && visibleTabsIds.has(tab.id));

      setPinnedTabs(updatedPinnedTabs);
      setOverflowTabs(updatedOverflowTabs);
      setOtherTabs(updatedOtherTabs);
      saveTabsToLocalStorage(updatedPinnedTabs, updatedOverflowTabs, updatedOtherTabs);
    }, { threshold: [1] });

    tabRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      tabRefs.current.forEach(ref => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [pinnedTabs, overflowTabs, otherTabs]);

  useEffect(() => {
    saveTabsToLocalStorage(pinnedTabs, overflowTabs, otherTabs);
    const storedTabs = localStorage.getItem('tabs');
    console.log('Stored Tabs:', storedTabs);

    if (storedTabs) {
      try {
        const parsedData = JSON.parse(storedTabs);
        console.log('Parsed Data:', parsedData);
        if (parsedData.pinnedTabs && parsedData.overflowTabs && parsedData.otherTabs) {
          setPinnedTabs(parsedData.pinnedTabs);
          setOverflowTabs(parsedData.overflowTabs);
          setOtherTabs(parsedData.otherTabs);
        } else {
          console.error('Stored data is incomplete or malformed:', parsedData);
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
    const allTabs = [...pinnedTabs, ...overflowTabs, ...otherTabs];
    const [movedTab] = allTabs.splice(fromIndex, 1);
    allTabs.splice(toIndex, 0, movedTab);

    const updatedPinnedTabs = allTabs.filter(tab => tab.isPinned);
    const updatedOverflowTabs = allTabs.filter(tab => !tab.isPinned && tab.isOverflow);
    const updatedOtherTabs = allTabs.filter(tab => !tab.isPinned && !tab.isOverflow);
    setPinnedTabs(updatedPinnedTabs);
    setOverflowTabs(updatedOverflowTabs);
    setOtherTabs(updatedOtherTabs);
    saveTabsToLocalStorage(updatedPinnedTabs, updatedOverflowTabs, updatedOtherTabs);
  };

  const togglePinTab = (tabId: string) => {
    const allTabs = [...pinnedTabs, ...overflowTabs, ...otherTabs];
    const updatedTabs = allTabs.map((tab) =>
      tab.id === tabId ? { ...tab, isPinned: !tab.isPinned } : tab
    );

    const updatedPinnedTabs = updatedTabs.filter(tab => tab.isPinned);
    const updatedOverflowTabs = updatedTabs.filter(tab => !tab.isPinned && tab.isOverflow);
    const updatedOtherTabs = updatedTabs.filter(tab => !tab.isPinned && !tab.isOverflow);

    setPinnedTabs(updatedPinnedTabs);
    setOverflowTabs(updatedOverflowTabs);
    setOtherTabs(updatedOtherTabs);

    saveTabsToLocalStorage(updatedPinnedTabs, updatedOverflowTabs, updatedOtherTabs);
  };

  const handleIconClick = () => {
    setShowList(prevState => !prevState); // Toggle the List component visibility
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className={styles.tab__section}>
        <div 
          className={styles.tab__container}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.tab__pinned}>
            <img className={styles.tab__icon} src="/img/fi-rs-box-alt.svg" alt="" />
            {pinnedTabs.map((tab, index) => (
              <TabsList
                key={tab.id}
                ref={(el) => tabRefs.current[index] = el as HTMLDivElement}
                tab={tab}
                index={index}
                moveTab={moveTab}
                togglePinTab={togglePinTab}
                tabs={pinnedTabs}
              />
            ))}
          </div>
          <div className={styles.tab__overflow}>
            {overflowTabs.map((tab, index) => (
              <TabsList
                key={tab.id}
                ref={(el) => tabRefs.current[index + pinnedTabs.length] = el as HTMLDivElement}
                tab={tab}
                index={index}
                moveTab={moveTab}
                togglePinTab={togglePinTab}
                tabs={overflowTabs}
              />
            ))}
            {otherTabs.map((tab, index) => (
              <TabsList
                key={tab.id}
                ref={(el) => tabRefs.current[index + pinnedTabs.length + overflowTabs.length] = el as HTMLDivElement}
                tab={tab}
                index={index}
                moveTab={moveTab}
                togglePinTab={togglePinTab}
                tabs={otherTabs}
              />
            ))}
          </div>
        </div>
        <img 
          className={styles.tab__vector} 
          src="/img/Vector (13).svg" 
          alt="" 
          onClick={handleIconClick}
        />
      </section>
		{showList && <List />} {/* Conditionally render List component */}
    </DndProvider>
  );
};

export default Tab;
