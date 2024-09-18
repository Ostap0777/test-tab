import React, { ForwardedRef, forwardRef } from 'react';
import styles from './tabsList.module.scss';
import { useDrag, useDrop } from 'react-dnd';
import { Link } from 'react-router-dom';
import { TabsListProps } from '../../../models/models';

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ tab, index, moveTab, togglePinTab, tabs }, ref) => {
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
        }
      }
    },
  });

  const combinedRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
    if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  return (
    <div
      ref={combinedRef}
      className={styles.tab__item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={tab.img} className={styles.tab__img} alt={tab.name} />
      <Link to={`/tab/${tab.id}`}>
        <p className={styles.tab__name}>{tab.name}</p>
      </Link>
      <button
        className={styles.button}
        onClick={(e) => {
          e.stopPropagation();
          togglePinTab(tab.id);
        }}
      >
        {tab.isPinned ? (
          <img
            className={styles.button__remove} src="/img/free-icon-remove-1828843.png" alt="Remove"
          />
        ) : (
          <img
            className={styles.button__add} src="/img/free-icon-plus-2549959.png" alt="Add"
          />
        )}
      </button>
    </div>
  );
});

export default TabsList;
