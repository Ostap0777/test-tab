import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TabItems } from '../../models/models';
import { getTabId } from '../../Service/service';
import Tab from '../TabsComponent/Tab';
import styles from './tabsId.module.scss';
import { Link } from 'react-router-dom';
import Loader from '../UI/Loader/Loader';

export default function TabId() {
  const { id } = useParams<{ id: string }>();
  const [tabIdData, setTabIdData] = useState<TabItems | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await getTabId(id);
          setTabIdData(data);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [id]);

  return (

    <section className={styles.tab__section}>
		<Link to={'/'} className={styles.home__link}>
		<img className={styles.back__home} src="/img/free-icon-left-arrow-271218 (1).png" alt="" />
		</Link>
		<Tab/>
      {tabIdData ? (
        <div className={styles.tab__content}>
          <h1 className={styles.tab__name}>{tabIdData.name}</h1>
        </div>
      ) : (
       <Loader/>
      )}
    </section>
  );
}
