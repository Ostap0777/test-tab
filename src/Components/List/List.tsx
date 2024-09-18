import React, { useEffect, useState } from 'react';
import styles from './list.module.scss';
import { ListItem } from '../../models/models';
import { saveTabsToLocalStorage } from '../../saveToLocalStorage';
import { Link } from 'react-router-dom';

export default function List() {
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    saveTabsToLocalStorage();
    const storedData = localStorage.getItem('tabs');
    console.log(storedData);

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log(parsedData); 
        setItems(parsedData.overflowTabs || []);
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
      }
    }
  }, []);

  return (
    <section className={styles.list__section}>
      {items.length > 0 ? (
        items.map(item => (
          <Link to={`/tab/${item.id}`} key={item.id}>
            <p className={styles.list__name}>{item.name}</p>
          </Link>
        ))
      ) : (
        <p>No data available</p>
      )}
    </section>
  );
}
