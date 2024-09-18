import { useState, useEffect, useRef } from 'react';
import { Tab } from '../models/models';

// Хук для перевірки видимості вкладок
const useTabsVisibility = (tabs: Tab[]) => {
  const [overflowTabs, setOverflowTabs] = useState<Tab[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let totalWidth = 0;
      let overflow: Tab[] = [];

      tabs.forEach((tab) => {
        const tabWidth = 100; // Припустимо, що вкладка має ширину 100px
        if (totalWidth + tabWidth > containerWidth) {
          overflow.push(tab);
        }
        totalWidth += tabWidth;
      });

      setOverflowTabs(overflow);
    };

    updateVisibility();
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('resize', updateVisibility);
    };
  }, [tabs]);

  return { overflowTabs, containerRef };
};
