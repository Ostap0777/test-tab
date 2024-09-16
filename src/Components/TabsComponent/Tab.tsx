import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './tab.module.scss';
import { TabItems } from '../../models/models';
import { saveTabsToLocalStorage } from '../../saveToLocalStorage';
import { Link } from 'react-router-dom';
const Tab: React.FC = () => {
  const [tabs, setTabs] = useState<TabItems[]>([]);

  useEffect(() => {
	saveTabsToLocalStorage();
	const storedTabs = localStorage.getItem('tabs');
	console.log(storedTabs);
	
	if (storedTabs) {
	  try {
		 const parsedData = JSON.parse(storedTabs);
		 const parsedTabs = parsedData.tab;
		 if (Array.isArray(parsedTabs)) {
			console.log('Loaded tabs from localStorage:', parsedTabs); 
			setTabs(parsedTabs);
		 } else {
			console.error('Stored data is not an array:', parsedTabs);
		 }
	  } catch (error) {
		 console.error('Error parsing JSON from localStorage:', error);
	  }
	} else {
	  console.log('No tabs found in localStorage');
	}
 }, []);

  const moveTab = (fromIndex: number, toIndex: number) => {
    const updatedTabs = [...tabs];
    const [movedTab] = updatedTabs.splice(fromIndex, 1);
    updatedTabs.splice(toIndex, 0, movedTab);

    const finalTabs = updatedTabs.filter(tab => !tab.isPinned);
    const pinnedTabs = tabs.filter(tab => tab.isPinned);
    const newTabs = [...pinnedTabs, ...finalTabs];

    console.log('Updating tabs:', newTabs)
    setTabs(newTabs);
    localStorage.setItem('tabs', JSON.stringify(newTabs));
  };

  const togglePinTab = (tabId: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, isPinned: !tab.isPinned } : tab
    );
    const sortedTabs = updatedTabs.sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

    console.log('Toggling pin, updated tabs:', sortedTabs);
    setTabs(sortedTabs);
    localStorage.setItem('tabs', JSON.stringify(sortedTabs));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className={styles.tab__section}>
        <div className={styles.tab__content}>
          <img className={styles.tab__icon} src="/img/fi-rs-box-alt.svg" alt="Icon" />
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.id}
              tab={tab}
              index={index}
              moveTab={moveTab}
              togglePinTab={togglePinTab}
              tabs={tabs}
            />
          ))}
          <img className={styles.tab__vector} src="/img/Vector (13).svg" alt="Vector" />
        </div>
      </section>
    </DndProvider>
  );
};

const TabItem: React.FC<{
  tab: TabItems;
  index: number;
  moveTab: (fromIndex: number, toIndex: number) => void;
  togglePinTab: (tabId: string) => void;
  tabs: TabItems[];
}> = ({ tab, index, moveTab, togglePinTab, tabs }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TAB',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TAB',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        const fromTab = tabs[item.index];
        const toTab = tabs[index];
        
        if (!fromTab.isPinned && !toTab.isPinned) {
          moveTab(item.index, index);
          item.index = index;
        } else if (fromTab.isPinned && !toTab.isPinned) {
          moveTab(item.index, index);
          item.index = index;
        } else if (!fromTab.isPinned && toTab.isPinned) {
        }
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={styles.tab__item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={tab.img} className={styles.tab__img} alt={tab.name} />
		<Link to={'/tab/:id'}>
		<p className={styles.tab__name}>{tab.name}</p>
		</Link>
      <button className={styles.button}
        onClick={(e) => {
          e.stopPropagation();
          togglePinTab(tab.id);
        }}
      >
        {tab.isPinned ? 
          <img className={styles.button__remove} src="/img/free-icon-remove-1828843.png" alt="Remove" />
          : 
          <img className={styles.button__add} src="/img/free-icon-plus-2549959.png" alt="Add" />
        }
      </button>
    </div>
  );
};

export default Tab;
